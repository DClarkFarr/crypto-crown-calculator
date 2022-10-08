import { SavedBatch } from "../hooks/useSavedBatches";

import EyeIcon from "~icons/fa-solid/eye";
import TrashIcon from "~icons/fa-solid/trash";

export type ManageSavedProps = {
    rows: SavedBatch[];
    remove: (id: string) => void;
    show: (id: string) => void;
};

const ManageSaved = ({ rows, remove, show }: ManageSavedProps) => {
    return (
        <div className="manage-saved">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th className="text-center"># Rows</th>
                        <th className="text-left">$ Total Value</th>
                        <th className="text-left">$ Savings</th>
                        <th className="text-center"># Units</th>
                        <th className="text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => {
                        return (
                            <tr className="saved-row" key={row.id}>
                                <td className="text-center">
                                    {row.rowCount.toLocaleString()}
                                </td>
                                <td className="text-left">
                                    {row.totalValue.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                                </td>
                                <td className="text-left">
                                    {row.totalSavings.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                                </td>
                                <td className="text-left">
                                    {row.totalUnits.toLocaleString()}
                                </td>
                                <td className="text-left">
                                    <div className="flex gap-x-2">
                                        <button
                                            className="btn btn-sm bg-emerald-600 hover:bg-emerald-800"
                                            onClick={() => show(row.id)}
                                        >
                                            <EyeIcon />
                                        </button>
                                        <button
                                            className="btn btn-sm bg-red-600 hover:bg-red-800"
                                            onClick={() => remove(row.id)}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ManageSaved;
