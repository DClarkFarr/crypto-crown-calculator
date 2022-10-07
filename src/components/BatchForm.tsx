import { Formik, Field, Form, FormikHelpers, FormikProps } from "formik";
import { BatchConfig } from "../hooks/useBatchStore";

export interface BatchState {
    savingPercent: string;
    monthlyInvestment: number;
    initialInvestment: number;
    duration: number;
}

export type BatchFormProps = {
    batch: BatchConfig;
    startMonth: number;
    submit: (id: string, data: BatchState) => void;
};
const BatchForm = ({ startMonth, batch, submit }: BatchFormProps) => {
    return (
        <div className="calculator-form">
            <h3 className="font-semibold text-lg text-white">
                Investment Period {batch.position}{" "}
                <small>
                    (Month {startMonth} - {startMonth + batch.duration - 1})
                </small>
            </h3>

            <Formik
                initialValues={{
                    savingPercent: String(batch.savingPercent),
                    monthlyInvestment: batch.monthlyInvestment,
                    duration: batch.duration,
                    initialInvestment: batch.initialInvestment,
                }}
                onSubmit={(
                    values: BatchState,
                    { setSubmitting }: FormikHelpers<BatchState>
                ) => {
                    submit(batch.id, values);
                    setTimeout(() => {
                        setSubmitting(false);
                    }, 250);
                }}
            >
                {({ isSubmitting }: FormikProps<BatchState>) => {
                    return (
                        <Form>
                            <div className="flex flex-wrap gap-x-4">
                                <div className="form-group">
                                    <label
                                        className="text-white opacity-75"
                                        htmlFor="savingPercent"
                                    >
                                        Savings %
                                    </label>
                                    <Field
                                        id="savingPercent"
                                        name="savingPercent"
                                        className="form-control"
                                        placeholder="100"
                                        type="text"
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        className="text-white opacity-75"
                                        htmlFor="monthlyInvestment"
                                    >
                                        Monthly Investment $
                                    </label>
                                    <Field
                                        id="monthlyInvestment"
                                        name="monthlyInvestment"
                                        className="form-control"
                                        placeholder="550"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        className="text-white opacity-75"
                                        htmlFor="initialInvestment"
                                    >
                                        Initial Investment $
                                    </label>
                                    <Field
                                        id="initialInvestment"
                                        name="initialInvestment"
                                        className="form-control"
                                        placeholder="550"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        className="text-white opacity-75"
                                        htmlFor="duration"
                                    >
                                        Duration (months)
                                    </label>
                                    <Field
                                        id="duration"
                                        name="duration"
                                        className="form-control"
                                        placeholder="1-10, etc"
                                        type="number"
                                        min="1"
                                    />
                                </div>
                                <div className="form-group text-left self-end">
                                    <button
                                        disabled={isSubmitting}
                                        className="btn bg-indigo-800 hover:bg-indigo-900"
                                        type="submit"
                                    >
                                        {isSubmitting ? "..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default BatchForm;
