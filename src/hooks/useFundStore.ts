import create from "zustand";

type FundStore = {
    units: number;
    savings: number;
    cash: number;
    setUnits: (units: number) => void;
    setSavings: (savings: number) => void;
    setCash: (cash: number) => void;
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
    return {
        units: 0,
        savings: 0,
        cash: 0,
        setUnits,
        setSavings,
        setCash,
    };
});

export default useFundStore;
