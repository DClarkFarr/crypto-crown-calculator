import moment, { Moment } from "moment";
import create from "zustand";
import { v4 as uuidv4 } from "uuid";
import { FundState } from "../components/FundForm";

export type BatchConfig = {
    id: string;
    position: number;
    savingPercent: number;
    debtsPercent: number;
    monthlyInvestment: number;
    initialInvestment: number;
    duration: number;
};

export type InitialFunds = {
    startingCash: number;
    startingUnits: number;
    startingSavings: number;
    startingDebts: number;
};

export type GenerateSettings = {
    unitCost: number;
    monthInterest: number;
};

export type BatchResult = {
    configId: string;
    month: number;
    date: Moment;
    unitCost: number;

    startingCash: number;
    startingUnits: number;
    startingSavings: number;
    startingDebts: number;

    incomeAmount: number;
    incomeInvestment: number;

    savingsAdded: number;
    debtsPaid: number;
    unitsPurchased: number;
    unitsCost: number;

    endingCash: number;
    endingDebts: number;
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
    generateResults: (
        configs: BatchConfig[],
        initialFunds: InitialFunds,
        settings: GenerateSettings
    ) => BatchResult[];
    removeConfig: (id: string) => void;
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

    const removeConfig = (id: string) => {
        set((draft) => {
            const cs = [...draft.configs];
            const index = cs.findIndex((c) => c.id === id);
            if (index > -1) {
                cs.splice(index, 1);
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

    const generateResults = (
        configs: BatchConfig[],
        initialFunds: InitialFunds,
        settings: GenerateSettings
    ) => {
        const results: BatchResult[] = [];

        let month = 0;
        let cash = initialFunds.startingCash;
        let units = initialFunds.startingUnits;
        let savings = initialFunds.startingSavings;
        let debts = initialFunds.startingDebts;

        configs.forEach((config) => {
            for (let i = 0; i < config.duration; i++) {
                const date = moment().add(month, "months");

                const row = {
                    configId: config.id,
                    month: month + 1,
                    date,
                    unitCost: settings.unitCost,

                    startingCash: cash,
                    startingUnits: units,
                    startingSavings: savings,
                    startingDebts: debts,
                } as Partial<BatchResult>;

                let incomeAmount =
                    (settings.unitCost * units * settings.monthInterest) / 100;

                let incomeInvestment = 0;

                if (i === 0 && config.initialInvestment > 0) {
                    // initial initial payment
                    incomeInvestment += config.initialInvestment;
                } else if (config.monthlyInvestment > 0) {
                    // add monthly payment
                    incomeInvestment += config.monthlyInvestment;
                }

                row.incomeAmount = incomeAmount;
                row.incomeInvestment = incomeInvestment;

                row.debtsPaid = 0;
                if (config.debtsPercent > 0) {
                    row.debtsPaid = Math.min(
                        (incomeAmount * config.debtsPercent) / 100,
                        debts
                    );
                    incomeAmount -= row.debtsPaid;
                }

                let savingsAdded = 0;
                if (config.savingPercent > 0) {
                    savingsAdded = (incomeAmount * config.savingPercent) / 100;
                }

                row.savingsAdded = savingsAdded;

                cash += incomeAmount + incomeInvestment - savingsAdded;

                let unitsPurchased = 0;
                if (Math.floor(cash / settings.unitCost) > 0) {
                    unitsPurchased = Math.floor(cash / settings.unitCost);
                }
                row.unitsPurchased = unitsPurchased;
                row.unitsCost = unitsPurchased * settings.unitCost;

                cash -= row.unitsCost;
                debts -= row.debtsPaid;
                units += unitsPurchased;
                savings += savingsAdded;

                row.endingCash = cash;
                row.endingUnits = units;
                row.endingSavings = savings;
                row.endingDebts = debts;

                results.push(row as BatchResult);
                month++;
            }
        });

        return results;
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
        generateResults,
        removeConfig,
    };
});

export default useBatchStore;
