# ComputePH — Government Rule Verification Checklist

**Type: HUMAN verification process.**

ComputePH does not automatically detect when the Philippine government changes a
rule. Every date-sensitive parameter below must be checked by a person against
the official source. When a rule changes, update the rule module, the content,
and the tests together — then update `lastUpdated` in the rule module to the
date of the actual verification.

Last formal audit: 2026-10-04 — see `COMPUTEPH-RULES-VERIFICATION-AUDIT-2026-10-04.md`.

---

## SSS Contribution — reverify every December/January

- [ ] Open the current SSS contribution table at `sss.gov.ph` and check the
      "Effective" date in the table header.
- [ ] Scan the SSS circulars index for any circular affecting contributions
      (SSS issues its schedule circular in December for January effectivity).
- [ ] Check specifically: **MSC range** (₱5,000–₱35,000), **₱500 MSC steps**,
      **EC rates** (₱10/₱30 and the ≥₱15,000 MSC boundary), and the **MPF
      threshold** (MSC above ₱20,000).
- [ ] If anything changed, update `lib/rules/sss.ts` + `lib/calculators/sss.ts`
      and the matching tests in `tests/gov.test.ts`.

Current rule: 15% of MSC (EE 5% / ER 10%), schedule effective **January 1, 2025**.

## PhilHealth Contribution — reverify each January

- [ ] Check `philhealth.gov.ph` circulars and advisories for the new calendar
      year (floor/ceiling are adjusted by periodic issuance).
- [ ] Confirm the **premium rate** (5%), **income floor** (₱10,000), and
      **income ceiling** (₱100,000).
- [ ] If anything changed, update `lib/rules/philhealth.ts` and the matching
      tests in `tests/gov.test.ts`.

Current rule: 5% (2.5% + 2.5%), floor ₱10,000 / ceiling ₱100,000, **CY 2026**.

## Pag-IBIG / HDMF — check periodically for new circulars

- [ ] Check the HDMF circulars page (pagibigfund.gov.ph — behind reCAPTCHA, so
      this is a manual check) for any circular after **Circular No. 460**.
- [ ] Confirm Circular 460 remains the governing issuance for mandatory savings.
- [ ] Pay attention to the ₱10,000 Maximum Fund Salary and the EE/ER rates.

Current rule: Circular 460 (effective February 2024), in force for 2026.

## BIR Income Tax — monitor Revenue Regulations and laws

- [ ] Watch for new Revenue Regulations and laws affecting compensation income
      taxation (watch DOF/BIR announcements each January).
- [ ] **Do not treat pending legislation as law** — only enacted laws and
      published issuances change the calculator.
- [ ] Note: the calculator's monthly figure is an **annualized ÷ 12 estimate**,
      not exact per-period withholding under Annex E of the Revenue Regulations.
      This disclosure must stay in the content.

Current rule: TRAIN (RA 10963) rates, effective from January 1, 2023 onwards.

## DOLE — reverify annual labor advisories

- [ ] Reverify **13th-month guidance in November/December** (DOLE reissues its
      Labor Advisory annually; check for Labor Advisory X-2026).
- [ ] Monitor for a newer edition of the **DOLE Handbook on Workers' Statutory
      Monetary Benefits** (current citation: 2024 Edition).
- [ ] Note: dole.gov.ph blocks automated retrieval (HTTP 403 to bots) — open
      advisory PDFs manually in a browser.

---

## After any rule change

1. Update the rule module in `lib/rules/`.
2. Update the engine in `lib/calculators/` only if computation changed.
3. Update/extend the government-rule tests in `tests/gov.test.ts`.
4. Update user-facing content in `lib/content.ts` if the rule is explained there.
5. Set `lastUpdated` in the rule module to **today's date only after you have
   actually reverified the rule against the official source** — never because
   code was edited.
6. Record the verification in the repository's audit/checklist history.
