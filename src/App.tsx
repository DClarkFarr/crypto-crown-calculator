import { useDeferredValue, useState } from "react";
import "./App.css";
import moment, { Moment } from "moment";
import CalculateTable from "./components/CalculateTable";
import useBatchStore, { BatchConfig } from "./hooks/useBatchStore";
import useFundStore from "./hooks/useFundStore";
import FundForm, { FundState } from "./components/FundForm";
import ManageBatches from "./components/ManageBatches";

function App() {
    const batch = useBatchStore();
    const fund = useFundStore();

    const deferredRows = useDeferredValue(batch.results);

    const handleFundSubmit = (data: FundState) => {
        fund.setCash(parseFloat(data.cash));
        fund.setSavings(parseFloat(data.savings));
        fund.setUnits(parseFloat(data.units));

        batch.clearResults();
    };

    const addBatch = () => {
        let lastBatch: BatchConfig | undefined;
        if (batch.configs.length) {
            lastBatch = batch.configs[batch.configs.length - 1];
        }
        batch.addConfig({
            savingPercent: lastBatch?.savingPercent || 0,
            monthlyInvestment: lastBatch?.monthlyInvestment || 0,
            initialInvestment: lastBatch?.initialInvestment || 0,
            duration: lastBatch?.duration || 12,
        });

        batch.clearResults();
    };

    const updateBatch = (id: string, b: Partial<Omit<BatchConfig, "id">>) => {
        batch.updateConfig(id, b);
        batch.clearResults();
    };

    return (
        <div className="app flex flex-col justify-center items-center min-h-screen w-full bg-indigo-500 p-10">
            <div className="app__fund p-10 mb-4 rounded-lg bg-gray-800 max-w-full w-[750px]">
                <div className="mb-8">
                    <FundForm submit={handleFundSubmit} />
                </div>
                <div>
                    <ManageBatches
                        getConfigMonthsBefore={batch.getConfigMonthsBefore}
                        batches={batch.configs}
                        update={updateBatch}
                        add={addBatch}
                    />
                </div>
            </div>
            <div className="app__content p-10 rounded-lg bg-white max-w-full w-[750px]">
                {fund.savings} and {fund.units}
                {deferredRows.length > 0 && (
                    <CalculateTable rows={deferredRows} />
                )}
            </div>
        </div>
    );
}

export default App;
