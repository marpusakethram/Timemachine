# Model assumptions and rules

Every sample number is made up. Here's what the source tags mean:

- **Inferred:** suggested by AI and not checked.
- **Entered:** you typed it in. That doesn't make it right.
- **Sample:** comes from the template.

Reviewing an AI suggestion doesn't turn it into evidence.

1. Baseline revenue is month zero. Growth applies first, then churn, starting in month one.
   The net multiplier is `(1 + growth / 100) * (1 - churn / 100)`, not growth minus churn.
2. Revenue is collected in the month it's earned. COGS is revenue times one minus margin.
   Recurring operating expenses don't include COGS. Gross profit isn't cash and isn't ARR.
3. Funding lands at the start of its month. Operating cash flow and capex are combined in
   the month end snapshot. We don't model cash timing inside a month.
4. Hiring adds recurring OpEx from its start month through month 24. Hiring doesn't
   automatically make you more efficient or bring in revenue. Any growth bump is a separate
   override you set.
5. Capex is a one time cash outflow. No depreciation and no tax effects.
6. Starting with zero cash counts as a shortfall at month zero. Recovering later doesn't
   erase the earliest shortfall. Staying positive for all 24 months shows as
   "Beyond 24 mo," never as infinite.
7. The funding gap is the extra month zero cash that keeps every balance above zero. If the
   lowest balance is zero or negative it's `ceil(-minimumCash * 100 + 1) / 100`, otherwise zero.
8. One priced round uses investment / (pre-money + investment) for the new investor's stake.
   The founders' existing share gets multiplied by pre-money / post-money. A pre-money of
   zero means "unknown," not a free round, so dilution is hidden.
9. Customers use the same net factor as revenue and only get rounded for display. Revenue
   per customer, seats and cohort retention aren't modeled.
10. Currency can be USD, EUR, GBP or INR. Changing it only swaps the label. Nothing gets converted.
11. All math uses normal finite doubles (IEEE-754), and imports and inputs have limits. Full
    precision is kept internally and in the CSV. This is a scenario tool, not an accounting
    ledger or a payment system.
12. Sensitivity steps gross monthly growth from 0 to 12%, and expenses at 0.5, 0.75, 1, 1.25
    and 1.5 times the selected expenses (using a 1,000 base if selected expenses are under
    1,000). Values show in real currency units and stay inside the schema limits.

Quick hand checks: 4,000 × 1.05 × 0.98 = 4,116. Gross profit = 3,292.80.
Month one cash = 50,000 + 3,292.80 − 7,000 = 46,292.80.
Month two revenue = 4,235.364 and cash = 42,681.0912.
See `fixtures/golden.json` and the unit tests.
