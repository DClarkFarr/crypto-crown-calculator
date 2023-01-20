import { BatchConfig } from "../hooks/useBatchStore";
import BatchForm, { BatchState } from "./BatchForm";

export type ManageBatchesProps = {
    batches: BatchConfig[];
    getConfigMonthsBefore: (id: string) => number;
    update: (id: string, b: Partial<Omit<BatchConfig, "id">>) => void;
    add: () => void;
    remove: (id: string) => void;
};

const ManageBatches = ({
    batches,
    add,
    update,
    getConfigMonthsBefore,
    remove,
}: ManageBatchesProps) => {
    const handleBatchSubmit = (id: string, data: BatchState) => {
        const batch: Omit<BatchConfig, "id" | "position"> = {
            savingPercent: Number(data.savingPercent),
            debtsPercent: Number(data.debtsPercent),
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
                        <div className="batch-row mb-4 p-2" key={batch.id}>
                            <BatchForm
                                submit={handleBatchSubmit}
                                batch={batch}
                                startMonth={startMonth}
                                remove={remove}
                                key={batch.id}
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
