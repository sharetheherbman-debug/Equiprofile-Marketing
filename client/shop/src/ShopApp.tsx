import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  ClipboardList,
  RotateCcw,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import CommerceAdmin from "./CommerceAdmin";

const money = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    pence / 100,
  );

export default function ShopApp() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnQuantities, setReturnQuantities] = useState<
    Record<number, number>
  >({});
  const [isAdmin, setIsAdmin] = useState(
    () => window.location.hash === "#admin",
  );
  const catalogue = trpc.commerce.catalogue.useQuery({
    query: submittedQuery,
    category,
  });
  const categories = trpc.commerce.categories.useQuery();
  const detail = trpc.commerce.product.useQuery(
    { slug: selectedSlug! },
    { enabled: !!selectedSlug },
  );
  const cart = trpc.commerce.cart.get.useQuery(undefined, { retry: false });
  const orders = trpc.commerce.orders.useQuery(undefined, { retry: false });
  const orderDetail = trpc.commerce.orderDetail.useQuery(
    { orderId: selectedOrderId! },
    { enabled: selectedOrderId !== null, retry: false },
  );
  const add = trpc.commerce.cart.add.useMutation({
    onSuccess: () => cart.refetch(),
  });
  const setQuantity = trpc.commerce.cart.setQuantity.useMutation({
    onSuccess: () => cart.refetch(),
  });
  const requestReturn = trpc.commerce.requestReturn.useMutation({
    onSuccess: () => {
      setReturnReason("");
      setReturnQuantities({});
      orderDetail.refetch();
      orders.refetch();
    },
  });
  const checkout = trpc.commerce.checkout.useMutation({
    onSuccess: (result) => {
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }
      setCheckoutNotice(
        `Order ${result.orderNumber ?? result.order?.orderNumber} is prepared. Payment remains NOT CONFIGURED; no charge was made.`,
      );
    },
  });
  const cartItems = cart.data ?? [];
  const cartCount = useMemo(
    () => cartItems.reduce((total, item: any) => total + item.quantity, 0),
    [cartItems],
  );
  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (total: number, item: any) =>
          total + item.quantity * Number(item.unitPricePence ?? 0),
        0,
      ),
    [cartItems],
  );
  if (isAdmin)
    return (
      <CommerceAdmin
        onBack={() => {
          window.location.hash = "";
          setIsAdmin(false);
        }}
      />
    );

  if (selectedOrderId) {
    const order = orderDetail.data as any;
    return (
      <main className="min-h-screen bg-[#f7f5f0] text-[#0f1d2e]">
        <header className="border-b border-[#e8d08a]/35 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <button
              onClick={() => setSelectedOrderId(null)}
              className="inline-flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> Back to orders
            </button>
            <a href="#cart" className="text-sm font-medium">
              <ShoppingBag className="mr-1 inline h-4 w-4" /> Cart ({cartCount})
            </a>
          </div>
        </header>
        <section className="mx-auto max-w-5xl px-5 py-10">
          {orderDetail.isLoading ? (
            <p>Loading order…</p>
          ) : orderDetail.error ? (
            <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">
              {orderDetail.error.message}
            </p>
          ) : order ? (
            <div className="space-y-6">
              <div className="rounded-2xl bg-[#0f1d2e] p-7 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#e8d08a]">
                  Order
                </p>
                <h1 className="mt-2 font-serif text-3xl">
                  {order.orderNumber}
                </h1>
                <p className="mt-3 text-sm text-slate-300">
                  Fulfilment: {String(order.status).replace(/_/g, " ")} ·
                  Payment: {String(order.storePaymentStatus).replace(/_/g, " ")}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {money(Number(order.totalPence))}
                </p>
              </div>

              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8d08a]/35">
                <h2 className="font-serif text-2xl">Items</h2>
                <div className="mt-4 space-y-3">
                  {(order.items ?? []).map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-4 border-b pb-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{item.titleSnapshot}</p>
                        <p className="text-slate-500">
                          {item.skuSnapshot} · Qty {item.quantity} ·{" "}
                          {String(item.fulfilmentStatus).replace(/_/g, " ")}
                        </p>
                      </div>
                      <p className="font-medium">
                        {money(
                          Number(item.unitPricePence) * Number(item.quantity),
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8d08a]/35">
                <h2 className="font-serif text-2xl">Delivery and tracking</h2>
                {(order.shipments ?? []).length ? (
                  <div className="mt-4 space-y-3">
                    {order.shipments.map((shipment: any) => (
                      <div
                        key={shipment.id}
                        className="rounded-xl bg-stone-50 p-4 text-sm"
                      >
                        <p className="font-medium">
                          {String(shipment.status).replace(/_/g, " ")}
                        </p>
                        <p className="mt-1 text-slate-600">
                          {shipment.carrier ?? "Carrier pending"}
                          {shipment.trackingReference
                            ? ` · Tracking: ${shipment.trackingReference}`
                            : " · Tracking pending"}
                        </p>
                        {shipment.dispatchedAt && (
                          <p className="mt-1 text-slate-500">
                            Dispatched:{" "}
                            {new Date(shipment.dispatchedAt).toLocaleString()}
                          </p>
                        )}
                        {shipment.deliveredAt && (
                          <p className="mt-1 text-slate-500">
                            Delivered:{" "}
                            {new Date(shipment.deliveredAt).toLocaleString()}
                          </p>
                        )}
                        {shipment.estimatedDeliveryAt && (
                          <p className="mt-1 text-slate-500">
                            Estimated delivery:{" "}
                            {new Date(
                              shipment.estimatedDeliveryAt,
                            ).toLocaleDateString()}
                          </p>
                        )}
                        {(order.trackingEvents ?? []).filter(
                          (event: any) => event.shipmentId === shipment.id,
                        ).length ? (
                          <ol className="mt-3 space-y-1 border-t pt-3 text-xs text-slate-600">
                            {(order.trackingEvents ?? [])
                              .filter(
                                (event: any) =>
                                  event.shipmentId === shipment.id,
                              )
                              .map((event: any) => (
                                <li key={event.id}>
                                  {new Date(event.eventAt).toLocaleString()} ·{" "}
                                  {event.eventCode.replace(/_/g, " ")}
                                  {event.eventDescription
                                    ? ` — ${event.eventDescription}`
                                    : ""}
                                </li>
                              ))}
                          </ol>
                        ) : (
                          <p className="mt-2 text-xs text-slate-500">
                            No tracking events have been recorded yet.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-600">
                    No shipment has been allocated yet.
                  </p>
                )}
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8d08a]/35">
                <h2 className="font-serif text-2xl">Returns and refunds</h2>
                {(order.returns ?? []).length ? (
                  <div className="mt-4 space-y-2 text-sm">
                    {order.returns.map((entry: any) => (
                      <p key={entry.id}>
                        Return #{entry.id}:{" "}
                        <span className="font-medium">
                          {String(entry.status).replace(/_/g, " ")}
                        </span>{" "}
                        · requested{" "}
                        {new Date(entry.requestedAt).toLocaleDateString()}
                      </p>
                    ))}
                    {(order.refunds ?? []).map((refund: any) => (
                      <p key={refund.id}>
                        Refund #{refund.id}:{" "}
                        <span className="font-medium">
                          {String(refund.status).replace(/_/g, " ")}
                        </span>{" "}
                        · {money(Number(refund.amountPence))}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-600">
                    No returns or refunds are recorded for this order.
                  </p>
                )}

                <form
                  className="mt-6 border-t pt-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const items = Object.entries(returnQuantities)
                      .filter(([, quantity]) => Number(quantity) > 0)
                      .map(([orderItemId, quantity]) => ({
                        orderItemId: Number(orderItemId),
                        quantity: Number(quantity),
                      }));
                    if (!items.length) return;
                    requestReturn.mutate({
                      orderId: order.id,
                      reason: returnReason,
                      items,
                    });
                  }}
                >
                  <h3 className="flex items-center gap-2 font-semibold">
                    <RotateCcw className="h-4 w-4" /> Request a return
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    The recorded order policy, delivery evidence and remaining
                    quantity are revalidated by the server when this request is
                    sent.
                  </p>
                  <div className="mt-3 space-y-2">
                    {(order.items ?? []).map((item: any) => (
                      <label
                        key={item.id}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <span>
                          {item.titleSnapshot}{" "}
                          <span className="text-slate-500">
                            (
                            {item.returnEligibility?.replace(/_/g, " ") ??
                              "policy pending"}
                            )
                          </span>
                        </span>
                        <input
                          type="number"
                          min="0"
                          max={item.quantity}
                          value={returnQuantities[item.id] ?? 0}
                          onChange={(event) =>
                            setReturnQuantities((current) => ({
                              ...current,
                              [item.id]: Number(event.target.value),
                            }))
                          }
                          className="w-16 rounded border px-2 py-1"
                          aria-label={`Return quantity for ${item.titleSnapshot}`}
                        />
                      </label>
                    ))}
                  </div>
                  <textarea
                    required
                    minLength={5}
                    maxLength={2000}
                    value={returnReason}
                    onChange={(event) => setReturnReason(event.target.value)}
                    placeholder="Tell us why you wish to return the selected item(s)"
                    className="mt-3 min-h-24 w-full rounded border p-3 text-sm"
                  />
                  <button
                    disabled={requestReturn.isPending}
                    className="mt-3 rounded-full bg-[#c5a55a] px-4 py-2 text-sm font-semibold text-[#0f1d2e] disabled:bg-slate-300"
                  >
                    {requestReturn.isPending
                      ? "Submitting…"
                      : "Submit return request"}
                  </button>
                  {requestReturn.error && (
                    <p className="mt-2 text-sm text-rose-700">
                      {requestReturn.error.message}
                    </p>
                  )}
                </form>
              </section>
            </div>
          ) : null}
        </section>
      </main>
    );
  }

  if (selectedSlug && detail.data) {
    const product = detail.data as any;
    const chosen =
      product.variants.find(
        (variant: any) => variant.id === selectedVariantId,
      ) ?? product.variants[0];
    return (
      <main className="min-h-screen bg-[#f7f5f0] text-[#0f1d2e]">
        <header className="border-b border-[#e8d08a]/35 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <button
              onClick={() => {
                setSelectedSlug(null);
                setSelectedVariantId(null);
              }}
              className="inline-flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> Back to catalogue
            </button>
            <a href="#cart" className="text-sm font-medium">
              <ShoppingBag className="mr-1 inline h-4 w-4" /> Cart ({cartCount})
            </a>
          </div>
        </header>
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-2">
          <div className="flex min-h-80 items-center justify-center rounded-2xl bg-[#ece7d8] text-center text-sm text-stone-500">
            {product.images?.[0] ? (
              <img
                src={product.images[0].storageUrl}
                alt={product.images[0].altText}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              "No licensed product image is available"
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c5a55a]">
              {product.brand ?? "Equestrian essential"}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold">
              {product.title}
            </h1>
            <p className="mt-5 whitespace-pre-line text-slate-600">
              {product.description}
            </p>
            <dl className="mt-6 grid gap-2 text-sm">
              {(product.attributes ?? []).map((attribute: any) => (
                <div key={attribute.attributeName} className="flex gap-3">
                  <dt className="font-medium">{attribute.attributeName}</dt>
                  <dd className="text-slate-600">{attribute.attributeValue}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <p className="text-sm font-medium">Choose a variant</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`rounded-full border px-3 py-2 text-sm ${chosen?.id === variant.id ? "border-[#c5a55a] bg-[#f8f2df]" : "border-[#e8d08a]/35 bg-white"}`}
                  >
                    {variant.title} · {variant.sku}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-7 flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">
                  {money(
                    chosen?.salePricePence ??
                      chosen?.retailPricePence ??
                      product.salePricePence ??
                      product.retailPricePence,
                  )}
                </p>
                <p className="text-xs text-slate-300">
                  Availability is revalidated by the server when added to cart.
                </p>
              </div>
              <button
                disabled={!chosen || add.isPending}
                onClick={() =>
                  chosen && add.mutate({ variantId: chosen.id, quantity: 1 })
                }
                className="rounded-full bg-[#c5a55a] px-5 py-3 text-sm font-semibold text-[#0f1d2e] shadow-lg shadow-[#c5a55a]/25 disabled:bg-slate-300"
              >
                {add.isPending ? "Adding…" : "Add to cart"}
              </button>
            </div>
            {add.error && (
              <p className="mt-3 text-sm text-rose-700">{add.error.message}</p>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#0f1d2e]">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0f1d2e]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
          <a href="/" className="font-serif text-xl font-semibold">
            EquiProfile <span className="text-[#e8d08a]">Equestrian Store</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="#orders" className="text-xs text-slate-300">
              <ClipboardList className="mr-1 inline h-3 w-3" /> Orders
            </a>
            <button
              onClick={() => {
                window.location.hash = "admin";
                setIsAdmin(true);
              }}
              className="text-xs text-slate-300"
            >
              Admin
            </button>
            <a
              href="#cart"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <ShoppingBag className="h-4 w-4" /> Cart ({cartCount})
            </a>
          </div>
        </div>
      </header>
      <section className="border-b border-[#e8d08a]/35 bg-[#0f1d2e] text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8d08a]">
            EquiProfile · Governed commerce
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold md:text-6xl">
            A governed Store, built for clear provenance and honest
            availability.
          </h1>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedQuery(query);
            }}
            className="mt-8 flex max-w-xl overflow-hidden rounded-full bg-white p-1 shadow-xl shadow-black/10"
          >
            <input
              aria-label="Search catalogue"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products or brands"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[#0f1d2e] outline-none"
            />
            <button className="rounded-full bg-[#c5a55a] px-5 text-sm font-semibold text-[#0f1d2e]">
              <Search className="inline h-4 w-4" /> Search
            </button>
          </form>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(undefined)}
            className={`rounded-full px-4 py-2 text-sm ${!category ? "bg-[#c5a55a] text-white" : "border bg-white"}`}
          >
            All products
          </button>
          {(categories.data ?? []).map((item: any) => (
            <button
              key={item.slug}
              onClick={() => setCategory(item.slug)}
              className={`rounded-full px-4 py-2 text-sm ${category === item.slug ? "bg-[#c5a55a] text-white" : "border bg-white"}`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="mt-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#c5a55a]">
              Catalogue
            </p>
            <h2 className="mt-2 font-serif text-3xl">Available products</h2>
          </div>
          <p className="text-sm text-slate-300">
            Prices and stock are verified server-side.
          </p>
        </div>
        {catalogue.isLoading ? (
          <p className="py-16">Loading catalogue…</p>
        ) : catalogue.data?.length ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {catalogue.data.map((product: any) => (
              <article
                key={product.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex h-36 items-center justify-center rounded-xl bg-stone-100 text-xs text-stone-500">
                  Licensed imagery only
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#c5a55a]">
                  {product.brand ?? "Equestrian essential"}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{product.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {product.description}
                </p>
                <div className="mt-4 flex justify-between">
                  <span className="font-semibold">
                    {money(product.salePricePence ?? product.retailPricePence)}
                  </span>
                  <span className="text-xs text-slate-300">
                    {product.availabilityStatus.replace(/_/g, " ")}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSlug(product.slug)}
                  className="mt-5 w-full rounded-lg border border-[#c5a55a] px-4 py-2 text-sm font-medium text-[#c5a55a]"
                >
                  View product
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed bg-white p-10 text-center">
            <h3 className="font-serif text-2xl">
              No customer products are published yet.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
              Development and unapproved supplier records are deliberately
              excluded. Products appear after source facts, stock freshness,
              image rights and human approval are verified.
            </p>
          </div>
        )}
        <section
          id="orders"
          className="mt-14 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8d08a]/35"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl">Your orders</h2>
            <button
              onClick={() => orders.refetch()}
              className="text-sm font-medium text-[#a8873d]"
            >
              Refresh
            </button>
          </div>
          {orders.error ? (
            <p className="mt-3 text-sm text-slate-600">
              Sign in to view your order history.
            </p>
          ) : orders.data?.length ? (
            <div className="mt-4 space-y-3">
              {orders.data.map((order: any) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className="flex w-full items-center justify-between rounded-xl border p-4 text-left hover:border-[#c5a55a]"
                >
                  <span>
                    <span className="block font-medium">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-500">
                      {String(order.status).replace(/_/g, " ")} ·{" "}
                      {String(order.storePaymentStatus).replace(/_/g, " ")}
                    </span>
                  </span>
                  <span className="font-semibold">
                    {money(Number(order.totalPence))}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              No orders are recorded yet.
            </p>
          )}
        </section>
        <section
          id="cart"
          className="mt-14 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8d08a]/35"
        >
          <h2 className="font-serif text-2xl">Your cart</h2>
          {cartItems.length ? (
            <div className="mt-4 space-y-3">
              {cartItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 border-b pb-3"
                >
                  <div>
                    <p className="font-medium">{item.productTitle}</p>
                    <p className="text-xs text-slate-300">
                      {item.variantTitle} · {item.sku}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setQuantity.mutate({
                          itemId: item.id,
                          quantity: item.quantity - 1,
                        })
                      }
                      className="rounded border p-1"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity.mutate({
                          itemId: item.id,
                          quantity: item.quantity + 1,
                        })
                      }
                      className="rounded border p-1"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <span className="ml-3 font-medium">
                      {money(item.unitPricePence * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <span>Subtotal</span>
                <span className="font-semibold">{money(cartSubtotal)}</span>
              </div>
              <p className="text-xs text-slate-300">
                VAT, shipping and the final total are revalidated at checkout.
                No supplier delivery promise is shown until a configured profile
                exists.
              </p>
              <button
                disabled={checkout.isPending}
                onClick={() =>
                  checkout.mutate({ idempotencyKey: crypto.randomUUID() })
                }
                className="mt-3 rounded-full bg-[#c5a55a] px-4 py-2 text-sm font-semibold text-[#0f1d2e] shadow-lg shadow-[#c5a55a]/25 disabled:bg-slate-300"
              >
                {checkout.isPending ? "Preparing…" : "Prepare checkout"}
              </button>
              {checkoutNotice && (
                <p className="mt-3 text-sm text-amber-700">{checkoutNotice}</p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              Your cart is empty. Cart persistence is available for
              authenticated customers.
            </p>
          )}
        </section>
      </section>
      <footer className="mt-14 bg-[#0f1d2e] text-slate-200">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:grid-cols-3">
          <p className="flex gap-3 text-sm">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#e8d08a]" />
            No browser-supplied prices, payments, or stock decisions.
          </p>
          <p className="flex gap-3 text-sm">
            <Truck className="h-5 w-5 shrink-0 text-[#e8d08a]" />
            No delivery promises until a supplier confirms fulfilment data.
          </p>
          <p className="flex gap-3 text-sm">
            <Heart className="h-5 w-5 shrink-0 text-[#e8d08a]" />
            Academy education and commercial recommendations remain separate.
          </p>
        </div>
      </footer>
    </main>
  );
}
