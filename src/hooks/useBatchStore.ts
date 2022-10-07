import { Moment } from "moment";
import create from "zustand";
import { v4 as uuidv4 } from "uuid";

export type BatchConfig = {
    id: string;
    savingPercent: number;
    additionalPurchase: number;
    duration: number;
};

export type BatchResult = {
    configId: string;
    month: number;
    date: Moment;

    startingCash: number;
    startingUnits: number;
    startingSavings: number;

    incomeAmount: number;

    savingsAdded: number;
    unitsPurchased: number;
    unitsCost: number;

    endingCash: number;
    endingUnits: number;
    endingSavings: number;
};

export type BatchStore = {
    configs: BatchConfig[];
    results: BatchResult[];
    setConfigs: (configs: BatchConfig[]) => void;
    setResults: (results: BatchResult[]) => void;
    addConfig: (config: Omit<BatchConfig, "id">) => void;
    updateConfig: (
        id: string,
        config: Partial<Omit<BatchConfig, "id">>
    ) => void;
};

const useBatchStore = create<BatchStore>((set, get) => {
    const setConfigs = (configs: BatchConfig[]) => {
        set({ configs });
    };

    const setResults = (results: BatchResult[]) => {
        set({ results });
    };

    const addConfig = (config: Omit<BatchConfig, "id">) => {
        const id = uuidv4();
        set((state) => ({
            configs: [...state.configs, { ...config, id }],
        }));
    };

    const updateConfig = (
        id: string,
        config: Partial<Omit<BatchConfig, "id">>
    ) => {
        set((draft) => {
            const cs = [...draft.configs];
            const index = cs.findIndex((c) => c.id === id);
            if (index > -1) {
                cs[index] = { ...cs[index], ...config };
                draft.configs = cs;
            }

            return draft;
        });
    };

    return {
        configs: [],
        results: [],
        setConfigs,
        setResults,
        addConfig,
        updateConfig,
    };
});

export default useBatchStore;
