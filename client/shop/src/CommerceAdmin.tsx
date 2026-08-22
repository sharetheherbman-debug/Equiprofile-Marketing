import { useState } from "react";
import {
  Archive,
  ArrowLeft,
  Check,
  Database,
  Eye,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const money = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    pence / 100,
  );

const readable = (value: string | null | undefined) =>
  (value ?? "not recorded").replace(/_/g, " ");

export default function CommerceAdmin({ onBack }: { onBack: () => void }) {
  const dashboard = trpc.commerce.admin.dashboard.useQuery(undefined, {
    retry: false,
  });
  const products = trpc.commerce.admin.products.useQuery(undefined, {
    retry: false,
  });
  const suppliers = trpc.commerce.admin.suppliers.useQuery(undefined, {
    retry: false,
  });
  const orders = trpc.commerce.admin.orders.useQuery(undefined, {
    retry: false,
  });
  const returns = trpc.commerce.admin.returns.useQuery(undefined, {
    retry: false,
  });
  const auditLog = trpc.commerce.admin.auditLog.useQuery(undefined, {
    retry: false,
  });
  const [candidateId, setCandidateId] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);

  const refresh = () => {
    dashboard.refetch();
    products.refetch();
    suppliers.refetch();
    orders.refetch();
    returns.refetch();
    auditLog.refetch();
  };
  const synthetic = trpc.commerce.admin.createSyntheticCandidate.useMutation({
    onSuccess: (result) => {
      setCandidateId(result.productId);
      setNotice(
        `Created development candidate #${result.productId}; it remains excluded from the public catalogue.`,
      );
      refresh();
    },
    onError: (error) => setNotice(error.message),
  });
  const proposal = trpc.commerce.admin.proposeProduct.useMutation({
    onError: (error) => setNotice(error.message),
  });
  const approveProduct = trpc.commerce.admin.approveProduct.useMutation({
    onSuccess: () => {
      setNotice("Product approval decision recorded.");
      refresh();
    },
    onError: (error) => setNotice(error.message),
  });
  const productLifecycle = trpc.commerce.admin.setProductLifecycle.useMutation({
    onSuccess: () => {
      setNotice("Product lifecycle updated.");
      refresh();
    },
    onError: (error) => setNotice(error.message),
  });
  const editProduct = trpc.commerce.admin.editProduct.useMutation({
    onSuccess: () => {
      setEditing(null);
      setNotice("Product details updated.");
      refresh();
    },
    onError: (error) => setNotice(error.message),
  });
  const supplierStatus = trpc.commerce.admin.setSupplierStatus.useMutation({
    onSuccess: () => {
      setNotice("Supplier status updated.");
      refresh();
    },
    onError: (error) => setNotice(error.message),
  });
  const supplierConnection =
    trpc.commerce.admin.testSupplierConnection.useMutation({
      onSuccess: (result) => setNotice(result.message),
      onError: (error) => setNotice(error.message),
    });
  const reviewReturn = trpc.commerce.admin.reviewReturn.useMutation({
    onSuccess: () => {
      setNotice("Return state updated.");
      refresh();
    },
    onError: (error) => setNotice(error.message),
  });

  if (dashboard.error) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] p-6 text-[#0f1d2e]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Store
        </button>
        <section className="mx-auto mt-12 max-w-xl rounded-2xl border bg-white p-8">
          <ShieldCheck className="h-8 w-8 text-[#c5a55a]" />
          <h1 className="mt-4 font-serif text-3xl">
            Commerce administration is restricted
          </h1>
          <p className="mt-3 text-slate-600">{dashboard.error.message}</p>
        </section>
      </main>
    );
  }

  const metric = dashboard.data as any;
  const cards = [
    ["Paid revenue", money(Number(metric?.realisedRevenuePence ?? 0))],
    ["Average order value", money(Number(metric?.averageOrderValuePence ?? 0))],
    ["Orders", String(metric?.orderCount ?? 0)],
    ["Pending payment", String(metric?.pendingPaymentCount ?? 0)],
    ["Fulfilment problems", String(metric?.fulfilmentProblemCount ?? 0)],
    ["Supplier sync problems", String(metric?.supplierSyncProblemCount ?? 0)],
    ["Stock issues", String(metric?.stockIssueCount ?? 0)],
    ["Margin warnings", String(metric?.marginWarningCount ?? 0)],
    ["Return/refund queue", String(metric?.returnQueueCount ?? 0)],
  ];

  return (
    <main className="min-h-screen bg-[#f7f5f0] p-6 text-[#0f1d2e]">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Store
        </button>
        <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-[#c5a55a]">
          Governed operations
        </p>
        <h1 className="mt-2 font-serif text-4xl">Commerce Admin</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          All controls are recorded in the Commerce audit log. Supplier
          activation, product publication and returns are subject to server-side
          prerequisites; this interface never activates suppliers or publishes
          development data by itself.
        </p>
        {notice && (
          <p className="mt-4 rounded-lg bg-[#f8f2df] p-3 text-sm text-[#8a6a25]">
            {notice}
          </p>
        )}

        {dashboard.isLoading ? (
          <p className="mt-8">Loading persisted Commerce records…</p>
        ) : (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {cards.map(([label, value]) => (
                <article
                  key={label}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e8d08a]/35"
                >
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                </article>
              ))}
            </section>

            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8d08a]/35">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl">
                    Products and approval controls
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Publication requires licensed imagery, a non-development
                    product and a recorded approval.
                  </p>
                </div>
                <button
                  onClick={() => products.refetch()}
                  className="text-sm font-medium text-[#a8873d]"
                >
                  Refresh products
                </button>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="border-b text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="py-2">Product</th>
                      <th>Review</th>
                      <th>Visibility</th>
                      <th>Policy</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(products.data ?? []).map((product: any) => (
                      <tr
                        key={product.id}
                        className="border-b border-[#e8d08a]/20 align-top"
                      >
                        <td className="py-3 pr-4">
                          <p className="font-medium">{product.title}</p>
                          <p className="text-xs text-slate-500">
                            {money(
                              Number(
                                product.salePricePence ??
                                  product.retailPricePence,
                              ),
                            )}{" "}
                            · {readable(product.availabilityStatus)} · rights{" "}
                            {readable(product.imageRightsStatus)}
                          </p>
                        </td>
                        <td>{readable(product.approvalStatus)}</td>
                        <td>
                          {readable(product.status)}
                          {product.developmentOnly ? " · development" : ""}
                        </td>
                        <td>{readable(product.returnEligibility)}</td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setEditing(product)}
                              className="rounded border px-2 py-1 text-xs"
                            >
                              Edit
                            </button>
                            {product.approvalStatus === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    approveProduct.mutate({
                                      productId: product.id,
                                      approve: true,
                                      reason:
                                        "Human approval recorded from Commerce Admin.",
                                    })
                                  }
                                  className="rounded bg-emerald-700 px-2 py-1 text-xs text-white"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    approveProduct.mutate({
                                      productId: product.id,
                                      approve: false,
                                      reason:
                                        "Human rejection recorded from Commerce Admin.",
                                    })
                                  }
                                  className="rounded bg-rose-700 px-2 py-1 text-xs text-white"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {product.status !== "published" && (
                              <button
                                onClick={() =>
                                  productLifecycle.mutate({
                                    productId: product.id,
                                    action: "publish",
                                  })
                                }
                                className="rounded bg-[#163563] px-2 py-1 text-xs text-white"
                              >
                                Publish
                              </button>
                            )}
                            {product.status === "published" && (
                              <button
                                onClick={() =>
                                  productLifecycle.mutate({
                                    productId: product.id,
                                    action: "unpublish",
                                  })
                                }
                                className="rounded border px-2 py-1 text-xs"
                              >
                                Unpublish
                              </button>
                            )}
                            <button
                              onClick={() =>
                                productLifecycle.mutate({
                                  productId: product.id,
                                  action: "archive",
                                })
                              }
                              className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700"
                            >
                              Archive
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!products.isLoading && !(products.data ?? []).length && (
                <p className="mt-4 text-sm text-slate-500">
                  No persisted Commerce products.
                </p>
              )}
            </section>

            {editing && (
              <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8d08a]/35">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl">Edit product</h2>
                  <button onClick={() => setEditing(null)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form
                  className="mt-4 grid gap-3 md:grid-cols-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    editProduct.mutate({
                      productId: editing.id,
                      title: editing.title,
                      description: editing.description,
                      brand: editing.brand || null,
                      retailPricePence: Number(editing.retailPricePence),
                      salePricePence:
                        editing.salePricePence === null ||
                        editing.salePricePence === ""
                          ? null
                          : Number(editing.salePricePence),
                      availabilityStatus: editing.availabilityStatus,
                      imageRightsStatus: editing.imageRightsStatus,
                      returnEligibility: editing.returnEligibility,
                    });
                  }}
                >
                  <label className="text-sm">
                    Title
                    <input
                      value={editing.title}
                      onChange={(event) =>
                        setEditing({ ...editing, title: event.target.value })
                      }
                      className="mt-1 w-full rounded border p-2"
                    />
                  </label>
                  <label className="text-sm">
                    Brand
                    <input
                      value={editing.brand ?? ""}
                      onChange={(event) =>
                        setEditing({ ...editing, brand: event.target.value })
                      }
                      className="mt-1 w-full rounded border p-2"
                    />
                  </label>
                  <label className="text-sm md:col-span-2">
                    Description
                    <textarea
                      value={editing.description}
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          description: event.target.value,
                        })
                      }
                      className="mt-1 min-h-24 w-full rounded border p-2"
                    />
                  </label>
                  <label className="text-sm">
                    Retail price (pence)
                    <input
                      type="number"
                      min="0"
                      value={editing.retailPricePence}
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          retailPricePence: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded border p-2"
                    />
                  </label>
                  <label className="text-sm">
                    Sale price (pence)
                    <input
                      type="number"
                      min="0"
                      value={editing.salePricePence ?? ""}
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          salePricePence: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded border p-2"
                    />
                  </label>
                  <label className="text-sm">
                    Availability
                    <select
                      value={editing.availabilityStatus}
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          availabilityStatus: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded border p-2"
                    >
                      {[
                        "in_stock",
                        "low_stock",
                        "on_order",
                        "stale",
                        "unavailable",
                      ].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm">
                    Image rights
                    <select
                      value={editing.imageRightsStatus}
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          imageRightsStatus: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded border p-2"
                    >
                      {["review_required", "licensed", "not_permitted"].map(
                        (value) => (
                          <option key={value}>{value}</option>
                        ),
                      )}
                    </select>
                  </label>
                  <label className="text-sm">
                    Return eligibility
                    <select
                      value={editing.returnEligibility}
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          returnEligibility: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded border p-2"
                    >
                      {["standard", "not_returnable", "review_required"].map(
                        (value) => (
                          <option key={value}>{value}</option>
                        ),
                      )}
                    </select>
                  </label>
                  <div className="flex items-end">
                    <button
                      disabled={editProduct.isPending}
                      className="rounded-full bg-[#c5a55a] px-4 py-2 text-sm font-semibold text-[#0f1d2e]"
                    >
                      {editProduct.isPending ? "Saving…" : "Save product"}
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8d08a]/35">
                <h2 className="font-serif text-2xl">
                  Supplier readiness and controls
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  A connection check records configuration readiness only;
                  activation remains blocked unless onboarding is approved and
                  image rights are licensed.
                </p>
                <div className="mt-4 space-y-3">
                  {(suppliers.data ?? []).map((supplier: any) => (
                    <div
                      key={supplier.id}
                      className="rounded-xl border p-4 text-sm"
                    >
                      <p className="font-medium">{supplier.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {readable(supplier.status)} · onboarding{" "}
                        {readable(supplier.onboardingStatus)} · rights{" "}
                        {readable(supplier.imageRightsStatus)} · sync errors{" "}
                        {supplier.syncErrorCount ?? 0}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            supplierConnection.mutate({
                              supplierId: supplier.id,
                            })
                          }
                          className="rounded border px-2 py-1 text-xs"
                        >
                          Test configuration
                        </button>
                        <button
                          onClick={() =>
                            supplierStatus.mutate({
                              supplierId: supplier.id,
                              status: "review",
                            })
                          }
                          className="rounded border px-2 py-1 text-xs"
                        >
                          Review
                        </button>
                        <button
                          onClick={() =>
                            supplierStatus.mutate({
                              supplierId: supplier.id,
                              status: "active",
                            })
                          }
                          className="rounded bg-emerald-700 px-2 py-1 text-xs text-white"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() =>
                            supplierStatus.mutate({
                              supplierId: supplier.id,
                              status: "suspended",
                            })
                          }
                          className="rounded bg-rose-700 px-2 py-1 text-xs text-white"
                        >
                          Suspend
                        </button>
                      </div>
                    </div>
                  ))}
                  {!(suppliers.data ?? []).length && (
                    <p className="text-sm text-slate-500">
                      No configured suppliers.
                    </p>
                  )}
                </div>
              </article>
              <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8d08a]/35">
                <h2 className="font-serif text-2xl">Orders and fulfilment</h2>
                <div className="mt-4 space-y-3">
                  {(orders.data ?? []).map((order: any) => (
                    <div
                      key={order.id}
                      className="rounded-xl border p-4 text-sm"
                    >
                      <p className="font-medium">
                        {order.orderNumber} · {money(Number(order.totalPence))}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Order {readable(order.status)} · payment{" "}
                        {readable(order.storePaymentStatus)} · customer #
                        {order.userId}
                      </p>
                    </div>
                  ))}
                  {!(orders.data ?? []).length && (
                    <p className="text-sm text-slate-500">No Store orders.</p>
                  )}
                </div>
              </article>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8d08a]/35">
                <h2 className="font-serif text-2xl">
                  Returns and refund queue
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Refund execution is not initiated from this control.
                  Customer-visible refund state follows recorded payment
                  processing.
                </p>
                <div className="mt-4 space-y-3">
                  {(returns.data ?? []).map((request: any) => (
                    <div
                      key={request.id}
                      className="rounded-xl border p-4 text-sm"
                    >
                      <p className="font-medium">
                        {request.orderNumber} · {readable(request.status)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {request.reason}
                      </p>
                      {request.status === "requested" && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() =>
                              reviewReturn.mutate({
                                returnId: request.id,
                                decision: "approved",
                              })
                            }
                            className="rounded bg-emerald-700 px-2 py-1 text-xs text-white"
                          >
                            <Check className="mr-1 inline h-3 w-3" /> Approve
                          </button>
                          <button
                            onClick={() =>
                              reviewReturn.mutate({
                                returnId: request.id,
                                decision: "rejected",
                              })
                            }
                            className="rounded bg-rose-700 px-2 py-1 text-xs text-white"
                          >
                            <X className="mr-1 inline h-3 w-3" /> Reject
                          </button>
                        </div>
                      )}
                      {request.status === "approved" && (
                        <button
                          onClick={() =>
                            reviewReturn.mutate({
                              returnId: request.id,
                              decision: "received",
                            })
                          }
                          className="mt-3 rounded bg-[#163563] px-2 py-1 text-xs text-white"
                        >
                          <Truck className="mr-1 inline h-3 w-3" /> Mark
                          received
                        </button>
                      )}
                    </div>
                  ))}
                  {!(returns.data ?? []).length && (
                    <p className="text-sm text-slate-500">
                      No return requests.
                    </p>
                  )}
                </div>
              </article>
              <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8d08a]/35">
                <h2 className="font-serif text-2xl">Audit log</h2>
                <div className="mt-4 max-h-80 space-y-2 overflow-auto text-xs">
                  {(auditLog.data ?? []).map((entry: any) => (
                    <div key={entry.id} className="border-b pb-2">
                      <p className="font-medium">
                        {entry.entityType} #{entry.entityId} ·{" "}
                        {readable(entry.action)}
                      </p>
                      <p className="text-slate-500">
                        {new Date(entry.createdAt).toLocaleString()} ·{" "}
                        {entry.actorType}
                      </p>
                    </div>
                  ))}
                  {!(auditLog.data ?? []).length && (
                    <p className="text-sm text-slate-500">No audit entries.</p>
                  )}
                </div>
              </article>
            </section>

            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8d08a]/35">
              <h2 className="font-serif text-2xl">AI Product Manager queue</h2>
              <p className="mt-2 text-sm text-slate-600">
                Supplier state:{" "}
                <strong>{metric?.supplierMode ?? "NOT CONFIGURED"}</strong>.
                Candidates remain non-public until human approval and verified
                supplier configuration exist.
              </p>
              <button
                disabled={synthetic.isPending}
                onClick={() => synthetic.mutate()}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#c5a55a] px-4 py-2 text-sm font-semibold text-[#0f1d2e] disabled:bg-slate-300"
              >
                <Database className="h-4 w-4" />{" "}
                {synthetic.isPending
                  ? "Creating…"
                  : "Create synthetic development candidate"}
              </button>
              {candidateId && (
                <button
                  disabled={proposal.isPending}
                  onClick={() => proposal.mutate({ productId: candidateId })}
                  className="ml-3 mt-5 rounded-lg border border-[#c5a55a] px-4 py-2 text-sm font-semibold text-[#c5a55a] disabled:opacity-50"
                >
                  {proposal.isPending
                    ? "Preparing proposal…"
                    : "Generate governed proposal"}
                </button>
              )}
              {proposal.data && (
                <div className="mt-4 rounded-lg bg-[#f7f5f0] p-4 text-sm">
                  <p>
                    <strong>Score:</strong> {proposal.data.score.total}/100
                  </p>
                  <p>
                    <strong>Duplicate risk:</strong>{" "}
                    {proposal.data.duplicate
                      ? "review required"
                      : "none detected"}
                  </p>
                  <p>
                    <strong>Human approval:</strong> required before publication
                  </p>
                  <p>
                    <strong>AI enrichment:</strong>{" "}
                    {proposal.data.enrichment.status}
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
