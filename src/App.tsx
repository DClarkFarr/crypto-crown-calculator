import { useDeferredValue, useState } from "react";
import "./App.css";
import moment, { Moment } from "moment";
import CalculateTable from "./components/CalculateTable";
import useBatchStore from "./hooks/useBatchStore";

function App() {
    const batch = useBatchStore();

    const deferredRows = useDeferredValue(batch.results);

    return (
        <div className="app flex flex-col justify-center items-center min-h-screen w-full bg-indigo-500">
            <div className="app__content p-10 m-10 rounded-lg bg-white max-w-full w-[750px]">
                {deferredRows.length > 0 && (
                    <CalculateTable rows={deferredRows} />
                )}
            </div>
        </div>
    );
}

export default App;
