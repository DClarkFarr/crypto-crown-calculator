import { Moment } from "moment";
import create from "zustand";
import { v4 as uuidv4 } from "uuid";

export type BatchConfig = {
    id: string;
    position: number;

    savingPercent: number;
    monthlyInvestment: number;
    initialInvestment: number;
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
    addConfig: (config: Omit<BatchConfig, "id" | "position">) => void;
    updateConfig: (
        id: string,
        config: Partial<Omit<BatchConfig, "id">>
    ) => void;
    clearResults: () => void;
    getConfigMonthsBefore: (id: string) => number;
};

const useBatchStore = create<BatchStore>((set, get) => {
    const setConfigs = (configs: BatchConfig[]) => {
        set({ configs });
    };

    const setResults = (results: BatchResult[]) => {
        set({ results });
    };

    const addConfig = (config: Omit<BatchConfig, "id" | "position">) => {
        const id = uuidv4();

        const batch: BatchConfig = {
            ...config,
            id,
            position: get().configs.length + 1,
        };
        set((state) => ({
            configs: [...state.configs, batch],
        }));

        return batch;
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

    const clearResults = () => {
        set({ results: [] });
    };

    const getConfigMonthsBefore = (id: string) => {
        let months = 0;
        const configs = get().configs;
        const index = configs.findIndex((c) => c.id === id);
        if (index > -1) {
            for (let i = 0; i < index; i++) {
                months += configs[i].duration;
            }
        }

        return months;
    };

    return {
        configs: [],
        results: [],
        setConfigs,
        setResults,
        addConfig,
        updateConfig,
        clearResults,
        getConfigMonthsBefore,
    };
});

export default useBatchStore;
