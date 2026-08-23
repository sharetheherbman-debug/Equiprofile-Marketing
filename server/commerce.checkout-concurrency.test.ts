import mysql from "mysql2/promise";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const databaseUrl = process.env.COMMERCE_TEST_DATABASE_URL;
const stripeCreate = vi.hoisted(() =>
  vi.fn(async (_params: unknown, options?: { idempotencyKey?: string }) => ({
    id: `cs_${options?.idempotencyKey ?? "test"}`,
    payment_intent: `pi_${options?.idempotencyKey ?? "test"}`,
    url: "https://checkout.stripe.test/session",
  })),
);

vi.mock("./stripe", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./stripe")>();
  return {
    ...actual,
    getStoreStripe: () => ({
      checkout: {
        sessions: {
          create: stripeCreate,
          retrieve: vi.fn(async () => ({
            url: "https://checkout.stripe.test/session",
          })),
        },
      },
    }),
  };
});

describe("Commerce database-backed checkout concurrency", () => {
  it("requires its disposable MariaDB gate in CI", () => {
    if (process.env.CI) expect(databaseUrl).toBeTruthy();
  });
});

const describeWithDatabase = databaseUrl ? describe : describe.skip;

describeWithDatabase("Commerce database-backed checkout concurrency", () => {
  let connection: mysql.Connection;
  let commerceRouter: typeof import("./commerceRouter").commerceRouter;

  const context = (userId: number) =>
    ({
      req: { method: "POST", headers: {} },
      res: {},
      user: {
        id: userId,
        openId: `commerce-test-${userId}`,
        email: `buyer${userId}@example.test`,
        name: `Buyer ${userId}`,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      hasAccess: true,
    }) as any;

  async function resetFixture(stock = 1, pricePence = 1_000, vatBps = 2_000) {
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    for (const table of [
      "commerceAuditLog",
      "commerceReturnItems",
      "commerceReturns",
      "commerceShipmentItems",
      "commerceShipments",
      "commerceOrderItems",
      "commerceOrders",
      "commerceCartItems",
      "commerceCarts",
      "commerceSupplierInventory",
      "commerceSupplierProducts",
      "commerceProductVariants",
      "commerceProducts",
      "commerceSuppliers",
    ]) {
      await connection.query(`TRUNCATE TABLE \`${table}\``);
    }
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    await connection.execute(
      "INSERT INTO commerceSuppliers (id, slug, name, status) VALUES (1, 'test-supplier', 'Test Supplier', 'active')",
    );
    await connection.execute(
      `INSERT INTO commerceProducts
        (id, slug, title, description, status, retailPricePence, vatRateBasisPoints, availabilityStatus, imageRightsStatus, factualProvenanceJson, developmentOnly, isArchived, returnEligibility)
       VALUES (1, 'test-product', 'Test product', 'Database concurrency fixture', 'published', ?, ?, 'in_stock', 'licensed', '{"source":"test"}', FALSE, FALSE, 'standard')`,
      [pricePence, vatBps],
    );
    await connection.execute(
      `INSERT INTO commerceProductVariants
        (id, productId, sku, title, attributesJson, isActive)
       VALUES (1, 1, 'SKU-1', 'Default', '{}', TRUE)`,
    );
    await connection.execute(
      `INSERT INTO commerceSupplierProducts
        (id, supplierId, productId, variantId, supplierSku, sourcePayloadJson, supplierCostPence)
       VALUES (1, 1, 1, 1, 'SUPPLIER-SKU-1', '{}', 500)`,
    );
    await connection.execute(
      `INSERT INTO commerceSupplierInventory
        (id, supplierProductId, quantity, availabilityStatus, freshUntil)
       VALUES (1, 1, ?, 'in_stock', DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY))`,
      [stock],
    );
    for (const userId of [101, 202]) {
      await connection.execute(
        `INSERT INTO users (id, openId, name, email, role)
         VALUES (?, ?, ?, ?, 'user')
         ON DUPLICATE KEY UPDATE openId = VALUES(openId), email = VALUES(email)`,
        [
          userId,
          `commerce-concurrency-${userId}`,
          `Commerce Buyer ${userId}`,
          `commerce-buyer-${userId}@example.test`,
        ],
      );
      await connection.execute(
        `INSERT INTO commerceCarts (userId, status, activeCartKey)
         VALUES (?, 'active', 'active')`,
        [userId],
      );
      await connection.execute(
        `INSERT INTO commerceCartItems (cartId, variantId, quantity)
         SELECT id, 1, 1 FROM commerceCarts WHERE userId = ? AND status = 'active'`,
        [userId],
      );
    }
  }

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.TEST_DATABASE_STRICT = "true";
    process.env.ENABLE_STORE_STRIPE = "true";
    process.env.COMMERCE_RETURN_WINDOW_DAYS = "30";
    process.env.DATABASE_URL = databaseUrl;
    connection = await mysql.createConnection(databaseUrl!);
    const statements = [
      `CREATE TABLE IF NOT EXISTS commerceSuppliers (
        id INT PRIMARY KEY, status VARCHAR(40) NOT NULL
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceProducts (
        id INT PRIMARY KEY, title VARCHAR(250) NOT NULL, status VARCHAR(40) NOT NULL,
        retailPricePence INT NOT NULL, salePricePence INT NULL, vatRateBasisPoints INT NOT NULL,
        imageRightsStatus VARCHAR(40) NOT NULL, developmentOnly BOOLEAN NOT NULL,
        isArchived BOOLEAN NOT NULL, returnEligibility VARCHAR(40) NOT NULL
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceProductVariants (
        id INT PRIMARY KEY, productId INT NOT NULL, sku VARCHAR(150) NOT NULL,
        title VARCHAR(250) NOT NULL, retailPricePence INT NULL, salePricePence INT NULL,
        isActive BOOLEAN NOT NULL
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceSupplierProducts (
        id INT PRIMARY KEY, supplierId INT NOT NULL, productId INT NOT NULL, variantId INT NOT NULL
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceSupplierInventory (
        id INT PRIMARY KEY, supplierProductId INT NOT NULL UNIQUE, quantity INT NULL,
        availabilityStatus VARCHAR(40) NOT NULL, freshUntil TIMESTAMP NULL
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceCarts (
        id INT AUTO_INCREMENT PRIMARY KEY, userId INT NOT NULL, currency CHAR(3) NOT NULL DEFAULT 'GBP',
        status VARCHAR(40) NOT NULL, activeCartKey VARCHAR(16) NOT NULL DEFAULT 'active',
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY commerceCarts_user_active (userId, activeCartKey)
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceCartItems (
        id INT AUTO_INCREMENT PRIMARY KEY, cartId INT NOT NULL, variantId INT NOT NULL,
        quantity INT NOT NULL, createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY commerceCartItems_cart_variant (cartId, variantId)
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceOrders (
        id INT AUTO_INCREMENT PRIMARY KEY, orderNumber VARCHAR(40) NOT NULL UNIQUE,
        userId INT NOT NULL, status VARCHAR(40) NOT NULL, currency CHAR(3) NOT NULL,
        subtotalPence INT NOT NULL, shippingPence INT NOT NULL, vatPence INT NOT NULL,
        totalPence INT NOT NULL, idempotencyKey VARCHAR(160) NOT NULL UNIQUE,
        stripeCheckoutSessionId VARCHAR(255) NULL,
        storePaymentStatus VARCHAR(40) NOT NULL DEFAULT 'not_configured',
        storePaymentReference VARCHAR(255) NULL
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceOrderItems (
        id INT AUTO_INCREMENT PRIMARY KEY, orderId INT NOT NULL, variantId INT NOT NULL,
        titleSnapshot VARCHAR(250) NOT NULL, skuSnapshot VARCHAR(150) NOT NULL,
        quantity INT NOT NULL, unitPricePence INT NOT NULL, vatPence INT NOT NULL,
        supplierId INT NULL, returnEligibility VARCHAR(40) NOT NULL,
        returnWindowDays INT NOT NULL, returnWindowEndsAt TIMESTAMP NULL
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceShipments (
        id INT AUTO_INCREMENT PRIMARY KEY, orderId INT NOT NULL,
        status VARCHAR(40) NOT NULL, deliveredAt TIMESTAMP NULL
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceShipmentItems (
        shipmentId INT NOT NULL, orderItemId INT NOT NULL, quantity INT NOT NULL,
        PRIMARY KEY (shipmentId, orderItemId)
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceReturns (
        id INT AUTO_INCREMENT PRIMARY KEY, orderId INT NOT NULL, userId INT NOT NULL,
        status VARCHAR(40) NOT NULL DEFAULT 'requested', reason TEXT NOT NULL
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceReturnItems (
        returnId INT NOT NULL, orderItemId INT NOT NULL, quantity INT NOT NULL,
        PRIMARY KEY (returnId, orderItemId)
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS commerceAuditLog (
        id INT AUTO_INCREMENT PRIMARY KEY, actorType VARCHAR(40) NOT NULL,
        actorUserId INT NULL, entityType VARCHAR(80) NOT NULL, entityId VARCHAR(160) NOT NULL,
        action VARCHAR(120) NOT NULL, detailsJson TEXT NOT NULL
      ) ENGINE=InnoDB`,
    ];
    for (const statement of statements) await connection.query(statement);
    await connection.query(
      "ALTER TABLE commerceCarts MODIFY activeCartKey VARCHAR(16) NOT NULL DEFAULT 'active'",
    );
    await connection.query(
      "ALTER TABLE commerceOrderItems ADD COLUMN IF NOT EXISTS returnWindowEndsAt TIMESTAMP NULL",
    );
    ({ commerceRouter } = await import("./commerceRouter"));
  }, 30_000);

  afterAll(async () => {
    await connection?.end();
  });

  it("serialises two buyers for the last unit and cannot oversell or double-decrement", async () => {
    await resetFixture(1);
    const first = commerceRouter.createCaller(context(101)).checkout({
      idempotencyKey: "buyer-101-last-unit",
    });
    const second = commerceRouter.createCaller(context(202)).checkout({
      idempotencyKey: "buyer-202-last-unit",
    });
    const results = await Promise.allSettled([first, second]);
    expect(
      results.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(1);
    expect(
      results.filter((result) => result.status === "rejected"),
    ).toHaveLength(1);
    const [[inventory]] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT quantity FROM commerceSupplierInventory WHERE id = 1",
    );
    const [[orders]] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS count FROM commerceOrders",
    );
    expect(Number(inventory.quantity)).toBe(0);
    expect(Number(orders.count)).toBe(1);
  });

  it("converges concurrent retries with one idempotency key on one order", async () => {
    await resetFixture(2);
    const caller = commerceRouter.createCaller(context(101));
    const results = await Promise.all([
      caller.checkout({ idempotencyKey: "same-checkout-key-101" }),
      caller.checkout({ idempotencyKey: "same-checkout-key-101" }),
    ]);
    expect(results.some((result) => result.idempotent)).toBe(true);
    const [[inventory]] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT quantity FROM commerceSupplierInventory WHERE id = 1",
    );
    const [[orders]] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS count FROM commerceOrders",
    );
    expect(Number(inventory.quantity)).toBe(1);
    expect(Number(orders.count)).toBe(1);
  });

  it("re-reads server price and VAT inside the locked checkout transaction", async () => {
    await resetFixture(3, 2_500, 2_000);
    const result = await commerceRouter.createCaller(context(101)).checkout({
      idempotencyKey: "server-money-source-101",
    });
    expect(result.totals).toMatchObject({
      subtotalPence: 2_500,
      vatPence: 500,
      totalPence: 3_000,
    });
    const [[order]] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT subtotalPence, vatPence, totalPence FROM commerceOrders LIMIT 1",
    );
    expect(Number(order.subtotalPence)).toBe(2_500);
    expect(Number(order.vatPence)).toBe(500);
    expect(Number(order.totalPence)).toBe(3_000);
  });

  it.each([
    [
      "unpublished product",
      "UPDATE commerceProducts SET status = 'draft' WHERE id = 1",
    ],
    [
      "development product",
      "UPDATE commerceProducts SET developmentOnly = TRUE WHERE id = 1",
    ],
    [
      "archived product",
      "UPDATE commerceProducts SET isArchived = TRUE WHERE id = 1",
    ],
    [
      "inactive variant",
      "UPDATE commerceProductVariants SET isActive = FALSE WHERE id = 1",
    ],
    [
      "inactive supplier",
      "UPDATE commerceSuppliers SET status = 'suspended' WHERE id = 1",
    ],
    [
      "stale inventory",
      "UPDATE commerceSupplierInventory SET freshUntil = DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MINUTE) WHERE id = 1",
    ],
  ])(
    "rejects %s inside the locked checkout query",
    async (_label, mutation) => {
      await resetFixture(2);
      await connection.query(mutation);
      await expect(
        commerceRouter.createCaller(context(101)).checkout({
          idempotencyKey: `blocked-${String(_label).replace(/\s+/g, "-")}`,
        }),
      ).rejects.toThrow();
      const [[inventory]] = await connection.query<mysql.RowDataPacket[]>(
        "SELECT quantity FROM commerceSupplierInventory WHERE id = 1",
      );
      const [[orders]] = await connection.query<mysql.RowDataPacket[]>(
        "SELECT COUNT(*) AS count FROM commerceOrders",
      );
      expect(Number(inventory.quantity)).toBe(2);
      expect(Number(orders.count)).toBe(0);
    },
  );

  it("serialises simultaneous returns so cumulative quantity cannot exceed the purchase", async () => {
    await resetFixture(5);
    await connection.execute(
      `INSERT INTO commerceOrders
        (orderNumber, userId, status, currency, subtotalPence, shippingPence, vatPence, totalPence, idempotencyKey)
       VALUES ('RETURN-ORDER-1', 101, 'delivered', 'GBP', 2000, 0, 400, 2400, 'return-order-key-1')`,
    );
    await connection.execute(
      `INSERT INTO commerceOrderItems
        (orderId, variantId, titleSnapshot, skuSnapshot, quantity, unitPricePence, vatPence, supplierId, returnEligibility, returnWindowDays)
       VALUES (1, 1, 'Test product — Default', 'SKU-1', 2, 1000, 400, 1, 'standard', 30)`,
    );
    await connection.execute(
      `INSERT INTO commerceShipments (orderId, status, deliveredAt)
       VALUES (1, 'delivered', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY))`,
    );
    await connection.execute(
      "INSERT INTO commerceShipmentItems (shipmentId, orderItemId, quantity) VALUES (1, 1, 2)",
    );
    const caller = commerceRouter.createCaller(context(101));
    const results = await Promise.allSettled([
      caller.requestReturn({
        orderId: 1,
        reason: "First simultaneous request",
        items: [{ orderItemId: 1, quantity: 2 }],
      }),
      caller.requestReturn({
        orderId: 1,
        reason: "Second simultaneous request",
        items: [{ orderItemId: 1, quantity: 2 }],
      }),
    ]);
    expect(
      results.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(1);
    expect(
      results.filter((result) => result.status === "rejected"),
    ).toHaveLength(1);
    const [[returned]] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT COALESCE(SUM(quantity), 0) AS quantity FROM commerceReturnItems",
    );
    expect(Number(returned.quantity)).toBe(2);
  });

  it("allows two serialised partial-return requests up to the remaining quantity", async () => {
    await resetFixture(5);
    await connection.execute(
      `INSERT INTO commerceOrders
        (orderNumber, userId, status, currency, subtotalPence, shippingPence, vatPence, totalPence, idempotencyKey)
       VALUES ('RETURN-ORDER-2', 101, 'delivered', 'GBP', 2000, 0, 400, 2400, 'return-order-key-2')`,
    );
    await connection.execute(
      `INSERT INTO commerceOrderItems
        (orderId, variantId, titleSnapshot, skuSnapshot, quantity, unitPricePence, vatPence, supplierId, returnEligibility, returnWindowDays)
       VALUES (1, 1, 'Test product — Default', 'SKU-1', 2, 1000, 400, 1, 'standard', 30)`,
    );
    await connection.execute(
      `INSERT INTO commerceShipments (orderId, status, deliveredAt)
       VALUES (1, 'delivered', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY))`,
    );
    await connection.execute(
      "INSERT INTO commerceShipmentItems (shipmentId, orderItemId, quantity) VALUES (1, 1, 2)",
    );
    const caller = commerceRouter.createCaller(context(101));
    const results = await Promise.all([
      caller.requestReturn({
        orderId: 1,
        reason: "Partial return one",
        items: [{ orderItemId: 1, quantity: 1 }],
      }),
      caller.requestReturn({
        orderId: 1,
        reason: "Partial return two",
        items: [{ orderItemId: 1, quantity: 1 }],
      }),
    ]);
    expect(results).toHaveLength(2);
    const [[returned]] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS requests, COALESCE(SUM(quantity), 0) AS quantity FROM commerceReturnItems",
    );
    expect(Number(returned.requests)).toBe(2);
    expect(Number(returned.quantity)).toBe(2);
  });
});
