import { BatchResult } from "../hooks/useBatchStore";

const CalculateTable = ({ rows }: { rows: BatchResult[] }) => {
    const thClass =
        "text-sm border-b dark:border-slate-600 font-medium p-4 pl-6 pt-4 pb-3 text-slate-400 dark:text-slate-200 text-left bg-slate-800 whitespace-nowrap";

    const tdClass =
        "border-b border-slate-100 dark:border-slate-700 p-4 pl-6 text-slate-500 dark:text-slate-400 bg-slate-700";
    return (
        <table className="table-auto w-full">
            <thead>
                <tr>
                    <th className={`${thClass} rounded-tl-lg`}>Date</th>
                    <th className={thClass}>$ Income</th>
                    <th className={thClass}>$ Savings</th>
                    <th className={thClass}>$ Cash</th>
                    <th className={thClass}>Units</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((r, i) => {
                    const purchasedAmount = r.endingUnits * r.unitCost;
                    return (
                        <tr key={i}>
                            <td
                                className={`${tdClass} text-center ${
                                    i + 1 === rows.length ? "rounded-bl-lg" : ""
                                }`}
                            >
                                <div className="text-xs opacity-50">
                                    Month {r.month}
                                </div>
                                {r.date.format("MM/YY")}
                            </td>
                            <td className={tdClass}>
                                {r.incomeInvestment > 0 && (
                                    <div>
                                        <div>
                                            <span className="text-xs opacity-50">
                                                Investment
                                            </span>
                                            {r.incomeInvestment.toLocaleString(
                                                "en-US",
                                                {
                                                    style: "currency",
                                                    currency: "USD",
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <span className="text-xs opacity-50">
                                        Interest
                                    </span>
                                    {r.incomeAmount.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                                </div>
                            </td>
                            <td className={tdClass}>
                                {r.savingsAdded > 0 && (
                                    <>
                                        <div className="text-xs text-green-600 -mt-4">
                                            +
                                            {r.savingsAdded.toLocaleString(
                                                "en-US",
                                                {
                                                    style: "currency",
                                                    currency: "USD",
                                                }
                                            )}
                                        </div>
                                    </>
                                )}
                                {r.endingSavings.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </td>
                            <td className={tdClass}>
                                <div>
                                    <span className="text-xs opacity-50">
                                        Starting
                                    </span>
                                    {r.startingCash.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                                </div>
                                <div>
                                    <span className="text-xs opacity-50">
                                        Ending
                                    </span>
                                    {r.endingCash.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                                </div>
                            </td>
                            <td
                                className={`${tdClass} ${
                                    i + 1 === rows.length ? "rounded-br-lg" : ""
                                }`}
                            >
                                <div># {r.endingUnits}</div>
                                <div>
                                    {purchasedAmount.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default CalculateTable;
