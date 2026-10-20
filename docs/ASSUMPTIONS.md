# Model assumptions and conventions

All sample numbers are fictional. “Inferred” means proposed by AI and unverified.
“Entered” means edited by the user, not objectively correct. “Sample” means template.
User review does not turn inferred values into evidence.

1. The baseline revenue is month zero. Growth and then churn apply to month one.
   The net multiplier is `(1 + growth / 100) * (1 - churn / 100)`, not growth minus churn.
2. Revenue is collected in its recognition month. COGS is revenue times one minus margin.
   Recurring operating expenses exclude COGS. Gross profit is not cash or ARR.
3. Financing arrives at the beginning of a numbered month; operating cash flows and
   capex are combined in the month-end snapshot. Intramonth cash timing is not modeled.
4. Hiring adds recurring OpEx from its start month through month 24. No automatic
   efficiency benefit or revenue uplift follows from hiring; any growth override is separate.
5. Capex is a single cash outflow. No depreciation or tax effects are modeled.
6. Starting zero cash is recorded as a month-zero shortfall. Later recovery does not
   change the earliest shortfall. A positive balance throughout 24 months is labeled
   “Beyond 24 mo,” never infinite.
7. The funding gap is additional month-zero cash that keeps all balances strictly
   positive. For a zero or negative minimum balance it is
   `ceil(-minimumCash * 100 + 1) / 100`, otherwise zero.
8. A single priced round uses investment/(pre-money+investment) for new investor
   ownership. Founders' existing fraction is multiplied by pre-money/post-money.
   A zero pre-money input means “unknown,” not a zero-price round, so dilution is hidden.
9. Customers use the same net factor as revenue and are rounded only for display.
   Revenue per customer, seats and cohort retention are not modeled.
10. Currency uses USD, EUR, GBP or INR labels; changing labels does not convert amounts.
11. Computations use finite IEEE-754 doubles; imports and input values are bounded.
    Full precision is retained internally and in CSV. This is a scenario tool, not an
    accounting ledger or settlement system.
12. Sensitivity varies gross monthly growth 0–12% at fixed steps, and expenses at
    0.5/0.75/1/1.25/1.5 times the selected expenses (a 1,000 base if selected expenses
    are below 1,000). Values are labeled in actual currency units and capped at schema bounds.

Hand-calculated seed checks: 4,000 × 1.05 × 0.98 = 4,116; gross profit = 3,292.80;
month-one cash = 50,000 + 3,292.80 − 7,000 = 46,292.80.
Month-two revenue = 4,235.364 and cash = 42,681.0912.
See `fixtures/golden.json` and unit tests.
