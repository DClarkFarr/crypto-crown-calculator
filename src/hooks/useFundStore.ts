import create from "zustand";

type FundStore = {
    units: number;
    savings: number;
    cash: number;
    setUnits: (units: number) => void;
    setSavings: (savings: number) => void;
    setCash: (cash: number) => void;
    reset: () => void;
};

const useFundStore = create<FundStore>((set, get) => {
    const setUnits = (units: number) => {
        set({ units });
    };

    const setSavings = (savings: number) => {
        set({ savings });
    };

    const setCash = (cash: number) => {
        set({ cash });
    };

    const reset = () => {
        set({ units: 1, savings: 0, cash: 0 });
    };

    return {
        units: 1,
        savings: 0,
        cash: 0,
        setUnits,
        setSavings,
        setCash,
        reset,
    };
});

export default useFundStore;
