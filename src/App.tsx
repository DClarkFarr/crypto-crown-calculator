import { useDeferredValue, useState } from "react";
import "./App.scss";
import CalculateTable from "./components/CalculateTable";
import useBatchStore, { BatchConfig } from "./hooks/useBatchStore";
import useFundStore from "./hooks/useFundStore";
import FundForm, { FundState } from "./components/FundForm";
import ManageBatches from "./components/ManageBatches";
import useConfigStore from "./hooks/useConfigStore";
import useSavedBatches from "./hooks/useSavedBatches";
import IconArrowRight from "~icons/fa-solid/arrow-right";
import IconArrowLeft from "~icons/fa-solid/arrow-left";

function App() {
    const batch = useBatchStore();
    const fund = useFundStore();
    const settings = useConfigStore();
    const saved = useSavedBatches();

    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

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

    const removeBatch = (id: string) => {
        batch.removeConfig(id);
        batch.clearResults();
    };

    const onGenerate = () => {
        setIsGenerating(true);

        setTimeout(() => {
            setIsGenerating(false);
        }, 1000);

        const results = batch.generateResults(
            batch.configs,
            {
                startingCash: fund.cash,
                startingSavings: fund.savings,
                startingUnits: fund.units,
            },
            {
                unitCost: settings.unitCost,
                monthInterest: settings.monthInterest,
            }
        );

        batch.setResults(results);
    };

    const onSaveBatch = () => {
        saved.addBatch(
            {
                configs: batch.configs,
                results: batch.results,
            },
            {
                startingCash: fund.cash,
                startingSavings: fund.savings,
                startingUnits: fund.units,
            },
            {
                unitCost: settings.unitCost,
                monthInterest: settings.monthInterest,
            }
        );

        setIsSaving(true);
        setTimeout(() => {
            batch.clearResults();
            setIsSaving(false);
        }, 500);
    };

    const toggleSidebar = () => {
        setSidebarIsOpen((s) => !s);
    };

    return (
        <div className="app flex min-h-screen w-full bg-indigo-500 p-10 gap-x-2">
            <div className="flex flex-col">
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
                            remove={removeBatch}
                        />
                    </div>
                </div>
                <div className="app__content max-w-full w-[750px]">
                    {deferredRows.length > 0 && (
                        <CalculateTable
                            rows={deferredRows}
                            save={onSaveBatch}
                            isSaving={isSaving}
                        />
                    )}
                    {!deferredRows.length && (
                        <button
                            className="btn bg-emerald-800 hover:bg-emerald-900 w-full"
                            onClick={onGenerate}
                            disabled={isGenerating}
                        >
                            <div className="px-10 py-5">
                                {isGenerating
                                    ? "Generating..."
                                    : "Generate Results"}
                            </div>
                        </button>
                    )}
                </div>
            </div>
            <div className="relative grow overflow-hidden">
                <button
                    className="saved-toggle btn bg-gray-500 hover:bg-gray-600 relative mt-1 ml-1"
                    onClick={toggleSidebar}
                >
                    {!sidebarIsOpen && (
                        <div className="saved-toggle__tooltip absolute bg-gray-900 text-white whitespace-nowrap px-2">
                            Saved Batches
                        </div>
                    )}
                    {sidebarIsOpen ? <IconArrowLeft /> : <IconArrowRight />}
                </button>

                <div
                    className={`absolute sidebar bg-gray-100 w-full h-full ${
                        sidebarIsOpen ? "open" : ""
                    }`}
                >
                    <div className="relative max-h-full overflow-y-auto overflow-x-visible">
                        <div className="sidebar__header bg-stone-800 mb-4 pl-[65px] pr-4 py-2">
                            <h2 className="text-lg text-white">
                                Saved Results
                            </h2>
                        </div>
                        <div className="p-4"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
