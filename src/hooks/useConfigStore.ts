import create from "zustand";

export type ConfigStore = {
    unitCost: number;
    monthInterest: number;
    setUnitCost: (unitCost: number) => void;
    setMonthInterest: (monthInterest: number) => void;
};

const useConfigStore = create<ConfigStore>((set, get) => {
    const setUnitCost = (unitCost: number) => {
        set({ unitCost });
    };
    const setMonthInterest = (monthInterest: number) => {
        set({ monthInterest });
    };
    return {
        unitCost: 550,
        monthInterest: 20.5,
        setUnitCost,
        setMonthInterest,
    };
});

export default useConfigStore;
