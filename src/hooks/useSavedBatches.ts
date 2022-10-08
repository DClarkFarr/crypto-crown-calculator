import create from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
    BatchConfig,
    BatchResult,
    GenerateSettings,
    InitialFunds,
} from "./useBatchStore";

export type CreateSavedBatch = {
    configs: BatchConfig[];
    results: BatchResult[];
};

export type SavedBatch = {
    id: string;
    configs: BatchConfig[];

    initialFunds: InitialFunds;
    settings: GenerateSettings;

    rowCount: number;
    totalSavings: number;
    totalUnits: number;
    totalCash: number;
    totalValue: number;
};

export type SavedBatchesState = {
    batches: SavedBatch[];
    addBatch: (
        batch: CreateSavedBatch,
        initialFunds: InitialFunds,
        settings: GenerateSettings
    ) => void;
    removeBatch: (id: string) => void;
};

const useSavedBatches = create<SavedBatchesState>()(
    persist(
        (set, get) => {
            const addBatch = (
                batch: CreateSavedBatch,
                initialFunds: InitialFunds,
                settings: GenerateSettings
            ) => {
                if (!batch.results.length) {
                    return;
                }

                const id = uuidv4();
                const row = batch.results[batch.results.length - 1];

                const newBatch: SavedBatch = {
                    id,
                    initialFunds,
                    settings,
                    configs: batch.configs,
                    rowCount: batch.results.length,
                    totalSavings: row.endingSavings,
                    totalUnits: row.endingUnits,
                    totalCash: row.endingCash,
                    totalValue:
                        row.endingSavings +
                        row.endingCash +
                        row.endingUnits * settings.unitCost,
                };

                set((state) => ({
                    batches: [...state.batches, newBatch],
                }));
            };

            const removeBatch = (id: string) => {
                set((state) => ({
                    batches: state.batches.filter((batch) => batch.id !== id),
                }));
            };

            return {
                batches: [],
                addBatch,
                removeBatch,
            };
        },
        {
            name: "saved-batches",
        }
    )
);

export default useSavedBatches;
