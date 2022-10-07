import { useMemo } from "react";
import { BatchConfig } from "../hooks/useBatchStore";
import BatchForm, { BatchState } from "./BatchForm";

export type ManageBatchesProps = {
    getConfigMonthsBefore: (id: string) => number;
    update: (id: string, b: Partial<Omit<BatchConfig, "id">>) => void;
    add: () => void;
    batches: BatchConfig[];
};

const ManageBatches = ({
    add,
    batches,
    update,
    getConfigMonthsBefore,
}: ManageBatchesProps) => {
    const handleBatchSubmit = (id: string, data: BatchState) => {
        const batch: Omit<BatchConfig, "id" | "position"> = {
            savingPercent: Number(data.savingPercent),
            monthlyInvestment: Number(data.monthlyInvestment),
            initialInvestment: Number(data.initialInvestment),
            duration: data.duration,
        };

        update(id, batch);
    };

    return (
        <div className="manage-batches">
            <h3 className="font-semibold text-lg text-white mb-4">
                Investment Periods
            </h3>

            <div className="batches mb-4">
                {batches.map((batch) => {
                    const startMonth = getConfigMonthsBefore(batch.id) + 1;
                    return (
                        <div className="mb-4" key={batch.id}>
                            <BatchForm
                                submit={handleBatchSubmit}
                                batch={batch}
                                startMonth={startMonth}
                            />
                        </div>
                    );
                })}
                {!batches.length && (
                    <div className="bg-white/75 p-4 rounded-md mb-4">
                        No investment periods added
                    </div>
                )}
            </div>

            <div className="add-btn">
                <button
                    className="btn bg-indigo-800 hover:bg-indigo-900 w-full"
                    onClick={add}
                >
                    <div className="px-10 py-5">Add Period</div>
                </button>
            </div>
        </div>
    );
};

export default ManageBatches;
