import { useDeferredValue, useState } from "react";
import "./App.css";
import CalculatorForm, {
    CalculateFormState,
} from "./components/CalculatorForm";
import moment, { Moment } from "moment";
import CalculateTable from "./components/CalculateTable";

export type Row = {
    date: Moment;
    poolAmount: number;
    savedAmount: number;
    purchasedUnits: number;
    purchasedAmount: number;
    payment: number;
};
function App() {
    const [rows, setRows] = useState<Row[]>([]);

    const calculateRows = ({
        cashPool,
        unitAmount,
        monthlyInterest,
        savingsPercent,
        targetAmount,
        initialUnits,
    }: CalculateFormState) => {
        const rs: Row[] = [];

        let date = moment().add(1, "month").startOf("month");
        let poolAmount = 0;
        let savedAmount = 0;
        let purchasedUnits = initialUnits;
        let purchasedAmount = initialUnits * unitAmount;
        let payment = 0;

        rs.push({
            date: date.clone(),
            poolAmount,
            savedAmount,
            purchasedAmount,
            purchasedUnits,
            payment,
        });

        while (purchasedAmount < targetAmount) {
            date.add(1, "month");

            payment = (purchasedAmount * monthlyInterest) / 100;

            let activePayment = payment;

            if (
                savingsPercent > 0 &&
                poolAmount + poolAmount * (savingsPercent / 100) > cashPool
            ) {
                const toSave = (activePayment * savingsPercent) / 100;
                savedAmount += toSave;
                activePayment -= toSave;
            }

            poolAmount += activePayment;

            if (poolAmount >= cashPool + unitAmount) {
                const extra = poolAmount - cashPool;

                const units = Math.floor(extra / unitAmount);

                poolAmount -= units * unitAmount;

                purchasedUnits += units;
                purchasedAmount += units * unitAmount;
            }

            rs.push({
                date: date.clone(),
                poolAmount,
                savedAmount,
                purchasedAmount,
                purchasedUnits,
                payment,
            });
        }

        return rs;
    };

    const onSubmit = (data: CalculateFormState) => {
        setRows([]);

        setRows(calculateRows(data));
    };

    const deferredRows = useDeferredValue(rows);

    return (
        <div className="app flex flex-col justify-center items-center min-h-screen w-full bg-indigo-500">
            <div className="app__content p-10 m-10 rounded-lg bg-white max-w-full w-[750px]">
                <CalculatorForm submit={onSubmit}></CalculatorForm>
                {deferredRows.length > 0 && (
                    <CalculateTable rows={deferredRows} />
                )}
            </div>
        </div>
    );
}

export default App;
