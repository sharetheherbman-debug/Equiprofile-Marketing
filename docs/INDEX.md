# EquiProfile Core documentation index

This index identifies the active documentation for the four-product Core repository.

## Canonical release and architecture truth

- [Repository README](../README.md) — product/repository boundaries and current development entry point.
- [Final Core reconciliation status](FINAL_CORE_RECONCILIATION_STATUS.md) — current Management, Academy, Shop, Marketing-connector, security, and external-gate status.
- [Installation](INSTALLATION.md) — installation and runtime operations.
- [Migration baseline policy](MIGRATION_BASELINE.md) — classification-first migration rules.
- [Migration history audit](MIGRATION_HISTORY_AUDIT.md) — historical migration evidence and orphan boundaries.
- [Migration test matrix](MIGRATION_TEST_MATRIX.md) — accepted fresh, supported, legacy-adoption, drift, and unknown paths.
- [Security summary](SECURITY_SUMMARY.md) — active security boundary.
- [Production QA checklist](QA_CHECKLIST.md) — controlled acceptance checklist.

## Product acceptance

- [Academy acceptance](academy/ACADEMY_ACCEPTANCE.md)
- [Academy factual findings](academy/factual-source-findings.md)
- [Commerce acceptance](commerce/COMMERCE_ACCEPTANCE.md)

Management’s current regression status is recorded in the final-Core reconciliation status and automated authenticated browser suite.

## Specialist references

- [API reference](API_REFERENCE.md)
- [Router map](ROUTER_MAP.md)
- [Feature flags](FEATURE_FLAGS.md)
- [Admin unlock](ADMIN_UNLOCK_GUIDE.md)
- [Operations](ops/)
- [Ubuntu deployment bundle](../deployment/ubuntu24/README.md)
- [School/Academy customer collateral](school-marketing/)
- [Application knowledge](../knowledge/)

## Standalone Marketing

The Marketing platform is maintained independently in [`sharetheherbman-debug/Amarktai-MarketingV21`](https://github.com/sharetheherbman-debug/Amarktai-MarketingV21). Historical embedded-Marketing architecture, rescue, provider, and UI audit documents were removed from this active Core branch. They remain recoverable from Git history and are not current Core implementation instructions.

## Historical-document policy

The previous tree contained overlapping phase boards, implementation summaries, deployment reports, and more than one hundred milestone-specific audit snapshots. Their current release conclusions were consolidated into the documents above during final-Core acceptance. Removing them from the active branch does not rewrite history or remove source, migrations, deployment scripts, acceptance tests, backup procedures, or current product evidence.
