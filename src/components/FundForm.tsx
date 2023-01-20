import { Formik, Field, Form, FormikHelpers, FormikProps } from "formik";

export interface FundState {
    units: string;
    savings: string;
    cash: string;
    debts: string;
}

export type CalculateFormProps = {
    submit: (data: FundState) => void;
    initialFunds: { [K in keyof FundState]: number };
};
const FundForm = ({ submit, initialFunds }: CalculateFormProps) => {
    const key = JSON.stringify(initialFunds);
    return (
        <div className="calculator-form" key={key}>
            <h3 className="font-semibold text-lg text-white">Initial Funds</h3>

            <Formik
                initialValues={{
                    cash: String(initialFunds.cash),
                    units: String(initialFunds.units),
                    savings: String(initialFunds.savings),
                    debts: String(initialFunds.debts),
                }}
                onSubmit={(
                    values: FundState,
                    { setSubmitting }: FormikHelpers<FundState>
                ) => {
                    submit(values);
                    setTimeout(() => {
                        setSubmitting(false);
                    }, 250);
                }}
            >
                {({ isSubmitting }: FormikProps<FundState>) => {
                    return (
                        <Form>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <div className="form-group">
                                    <label
                                        className="text-white opacity-75"
                                        htmlFor="cash"
                                    >
                                        Cash
                                    </label>
                                    <Field
                                        id="cash"
                                        name="cash"
                                        className="form-control"
                                        placeholder="100"
                                        type="text"
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        className="text-white opacity-75"
                                        htmlFor="units"
                                    >
                                        Units
                                    </label>
                                    <Field
                                        id="units"
                                        name="units"
                                        className="form-control"
                                        placeholder="550"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        className="text-white opacity-75"
                                        htmlFor="savings"
                                    >
                                        Savings
                                    </label>
                                    <Field
                                        id="savings"
                                        name="savings"
                                        className="form-control"
                                        placeholder="100"
                                        type="text"
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        className="text-white opacity-75"
                                        htmlFor="debts"
                                    >
                                        Debts
                                    </label>
                                    <Field
                                        id="debts"
                                        name="debts"
                                        className="form-control"
                                        placeholder="100"
                                        type="text"
                                    />
                                </div>
                                <div className="form-group text-left self-end">
                                    <button
                                        disabled={isSubmitting}
                                        className="btn bg-indigo-800 hover:bg-indigo-900"
                                        type="submit"
                                    >
                                        {isSubmitting ? "..." : "Go"}
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

export default FundForm;
