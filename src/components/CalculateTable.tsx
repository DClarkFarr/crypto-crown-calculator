import { Row } from "../App";

const CalculateTable = ({ rows }: { rows: Row[] }) => {
    const thClass =
        "text-sm border-b dark:border-slate-600 font-medium p-4 pl-6 pt-4 pb-3 text-slate-400 dark:text-slate-200 text-left bg-slate-800 whitespace-nowrap";

    const tdClass =
        "border-b border-slate-100 dark:border-slate-700 p-4 pl-6 text-slate-500 dark:text-slate-400 bg-slate-700";
    return (
        <table className="table-auto w-full">
            <thead>
                <tr>
                    <th className={`${thClass} rounded-tl-lg`}>Date</th>
                    <th className={thClass}>$ Payment</th>
                    <th className={thClass}>$ Savings</th>
                    <th className={thClass}>$ Pool</th>
                    <th className={thClass}>Units</th>
                    <th className={`${thClass} rounded-tr-lg`}>$ Purchased</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((r, i) => {
                    let savingDiff = 0;
                    if (i > 1 && r.savedAmount > rows[i - 1].savedAmount) {
                        savingDiff = r.savedAmount - rows[i - 1].savedAmount;
                    }
                    return (
                        <tr key={i}>
                            <td
                                className={`${tdClass} text-center ${
                                    i + 1 === rows.length ? "rounded-bl-lg" : ""
                                }`}
                            >
                                {i + 1}
                                <br />
                                {r.date.format("MM/YY")}
                            </td>
                            <td className={tdClass}>
                                {r.payment.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </td>
                            <td className={tdClass}>
                                {savingDiff > 0 && (
                                    <>
                                        <div className="text-xs text-green-600 -mt-4">
                                            +
                                            {savingDiff.toLocaleString(
                                                "en-US",
                                                {
                                                    style: "currency",
                                                    currency: "USD",
                                                }
                                            )}
                                        </div>
                                    </>
                                )}
                                {r.savedAmount.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </td>
                            <td className={tdClass}>
                                {r.poolAmount.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </td>
                            <td className={tdClass}>{r.purchasedUnits}</td>
                            <td
                                className={`${tdClass} ${
                                    i + 1 === rows.length ? "rounded-br-lg" : ""
                                }`}
                            >
                                {r.purchasedAmount.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default CalculateTable;
