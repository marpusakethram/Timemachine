# Model assumptions

All sample numbers are made up. Each number has a source label:

- **Sample** means it came from the template.
- **Entered** means you typed it. That doesn't make it correct.
- **Inferred** means an AI suggested it and nobody has verified it. Reviewing it
  doesn't turn it into evidence.

Here's how the model works:

1. The baseline revenue is month zero. Growth applies in month one, then churn.
   The combined multiplier is `(1 + growth / 100) * (1 - churn / 100)`. It's not
   growth minus churn.
2. Revenue is collected in the month it's earned. COGS is revenue times (1 - margin).
   Operating expenses don't include COGS. Gross profit isn't cash and isn't ARR.
3. Funding arrives at the start of its month. Operating cash flow and one-time spend
   are combined in the end-of-month number. Cash timing inside a month isn't modeled.
4. Hiring adds a monthly cost from its start month through month 24. Hiring doesn't
   automatically boost revenue or efficiency. If a path grows faster, that's a
   separate growth setting.
5. One-time spend (capex) is a single cash hit. No depreciation or taxes.
6. Starting with zero cash counts as running out in month zero. Recovering later
   doesn't change when you first ran out. If cash stays positive for all 24 months,
   runway shows as "Beyond 24 mo". It never says infinite.
7. The funding gap is the extra day-one cash that keeps every month above zero.
   If the lowest balance is zero or below, it's `ceil(-minimumCash * 100 + 1) / 100`.
   Otherwise it's zero.
8. A priced round gives new investors `investment / (pre-money + investment)`.
   Founders keep their old share times `pre-money / post-money`. A pre-money of zero
   means "unknown", not a free round, so dilution is hidden.
9. Customers grow and shrink by the same factor as revenue and are only rounded for
   display. Revenue per customer, seats and cohorts aren't modeled.
10. Currency can be USD, EUR, GBP or INR. Switching just changes the label. Nothing
    gets converted.
11. Math uses normal floating point numbers, and inputs and imports have limits.
    Full precision is kept inside the app and in the CSV. This is a planning tool,
    not accounting software.
12. The sensitivity lab steps monthly growth from 0 to 12%, and expenses at 0.5x,
    0.75x, 1x, 1.25x and 1.5x of the selected path's expenses (using a 1,000 base if
    expenses are under 1,000). Values use real currency units and stay within limits.

A hand check you can do yourself:

- Month one revenue: 4,000 × 1.05 × 0.98 = 4,116
- Gross profit: 3,292.80
- Month one cash: 50,000 + 3,292.80 - 7,000 = 46,292.80
- Month two revenue: 4,235.364, cash: 42,681.0912

These match `fixtures/golden.json` and the unit tests.
