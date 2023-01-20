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
import ManageSaved from "./components/ManageSaved";

function App() {
    const batch = useBatchStore();
    const fund = useFundStore();
    const settings = useConfigStore();
    const saved = useSavedBatches();

    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);

    const deferredRows = useDeferredValue(batch.results);

    const handleFundSubmit = (data: FundState) => {
        fund.setCash(parseFloat(data.cash));
        fund.setSavings(parseFloat(data.savings));
        fund.setUnits(parseFloat(data.units));
        fund.setDebts(parseFloat(data.debts));

        batch.clearResults();
    };

    const addBatch = () => {
        let lastBatch: BatchConfig | undefined;
        if (batch.configs.length) {
            lastBatch = batch.configs[batch.configs.length - 1];
        }
        batch.addConfig({
            savingPercent: lastBatch?.savingPercent || 0,
            debtsPercent: lastBatch?.debtsPercent || 0,
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
                startingDebts: fund.debts,
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
        if (selectedSavedId) {
            saved.updateBatch(
                selectedSavedId,
                {
                    configs: batch.configs,
                    results: batch.results,
                },
                {
                    startingCash: fund.cash,
                    startingSavings: fund.savings,
                    startingDebts: fund.debts,
                    startingUnits: fund.units,
                },
                {
                    unitCost: settings.unitCost,
                    monthInterest: settings.monthInterest,
                }
            );
        } else {
            saved.addBatch(
                {
                    configs: batch.configs,
                    results: batch.results,
                },
                {
                    startingCash: fund.cash,
                    startingSavings: fund.savings,
                    startingDebts: fund.debts,
                    startingUnits: fund.units,
                },
                {
                    unitCost: settings.unitCost,
                    monthInterest: settings.monthInterest,
                }
            );
        }

        setIsSaving(true);
        setTimeout(() => {
            batch.clearResults();
            batch.setConfigs([]);
            setSelectedSavedId(null);
            setIsSaving(false);
        }, 500);
    };

    const toggleSidebar = () => {
        setSidebarIsOpen((s) => !s);
    };

    const onRemoveSaved = (id: string) => {
        saved.removeBatch(id);
    };

    const onApplySaved = (id: string) => {
        const savedBatch = saved.batches.find((b) => b.id === id);

        if (!savedBatch) {
            return;
        }
        batch.clearResults();

        fund.setCash(savedBatch.initialFunds.startingCash);
        fund.setSavings(savedBatch.initialFunds.startingSavings);
        fund.setUnits(savedBatch.initialFunds.startingUnits);

        batch.setConfigs(savedBatch.configs);

        const results = batch.generateResults(
            savedBatch.configs,
            savedBatch.initialFunds,
            savedBatch.settings
        );

        batch.setResults(results);

        setSelectedSavedId(savedBatch.id);
    };

    const onClearSelected = () => {
        setSelectedSavedId(null);
        batch.clearResults();
        batch.setConfigs([]);
        fund.reset();
    };

    return (
        <div className="app flex min-h-screen w-full bg-indigo-500 p-10 gap-x-2">
            <div className="flex flex-col">
                <div className="app__fund p-10 mb-4 rounded-lg bg-gray-800 max-w-full w-[800px]">
                    <div className="mb-8">
                        <FundForm
                            submit={handleFundSubmit}
                            initialFunds={{
                                cash: fund.cash,
                                savings: fund.savings,
                                units: fund.units,
                                debts: fund.debts,
                            }}
                        />
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
                <div className="app__content max-w-full w-[800px]">
                    {deferredRows.length > 0 && (
                        <CalculateTable
                            rows={deferredRows}
                            save={onSaveBatch}
                            isSaving={isSaving}
                            id={selectedSavedId || undefined}
                            clear={onClearSelected}
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
                        <div className="p-4">
                            <ManageSaved
                                rows={saved.batches}
                                remove={onRemoveSaved}
                                show={onApplySaved}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
