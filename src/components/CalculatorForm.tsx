import { Formik, Field, Form, FormikHelpers, FormikProps } from "formik";

export interface CalculateFormState {
    cashPool: number;
    unitAmount: number;
    monthlyInterest: number;
    savingsPercent: number;
    savingsMin: number;
    targetAmount: number;
    initialUnits: number;
    adtPaymentQty: number;
    adtPaymentAmt: number;
}

export type CalculateFormProps = {
    submit: (data: CalculateFormState) => void;
};
const CalculatorForm = ({ submit }: CalculateFormProps) => {
    return (
        <div className="calculator-form">
            <h3 className="font-semibold text-lg text-slate-800 mb-4">
                Calculate Settings
            </h3>

            <Formik
                initialValues={{
                    cashPool: 550,
                    unitAmount: 550,
                    monthlyInterest: 20,
                    savingsPercent: 0,
                    savingsMin: 0,
                    targetAmount: 500000,
                    initialUnits: 1,
                    adtPaymentQty: 0,
                    adtPaymentAmt: 0,
                }}
                onSubmit={(
                    values: CalculateFormState,
                    { setSubmitting }: FormikHelpers<CalculateFormState>
                ) => {
                    submit(values);
                    setTimeout(() => {
                        setSubmitting(false);
                    }, 1000);
                }}
            >
                {({ isSubmitting }: FormikProps<CalculateFormState>) => {
                    return (
                        <Form>
                            <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                                <div className="form-group">
                                    <label htmlFor="unitAmount">
                                        Unit Amount $
                                    </label>
                                    <Field
                                        id="unitAmount"
                                        name="unitAmount"
                                        className="form-control"
                                        placeholder="550"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cashPool">
                                        Cash Safety Pool $
                                    </label>
                                    <Field
                                        id="cashPool"
                                        name="cashPool"
                                        placeholder="1000"
                                        className="form-control"
                                        min="0"
                                        type="number"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="monthlyInterest">
                                        Monthly Interest %
                                    </label>
                                    <Field
                                        id="monthlyInterest"
                                        name="monthlyInterest"
                                        className="form-control"
                                        placeholder="10-50"
                                        type="number"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="savingsPercent">
                                        Savings Percent %
                                    </label>
                                    <Field
                                        id="savingsPercent"
                                        name="savingsPercent"
                                        className="form-control"
                                        placeholder="10-50"
                                        type="number"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="savingsMin">
                                        Min Take Savings
                                    </label>
                                    <Field
                                        id="savingsMin"
                                        name="savingsMin"
                                        className="form-control"
                                        placeholder="5000"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="targetAmount">
                                        Target Amount $
                                    </label>
                                    <Field
                                        id="targetAmount"
                                        name="targetAmount"
                                        className="form-control"
                                        placeholder="500000"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="initialUnits">
                                        Initial Units $
                                    </label>
                                    <Field
                                        id="initialUnits"
                                        name="initialUnits"
                                        className="form-control"
                                        placeholder="1-50"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="adtPaymentQty">
                                        Adt. Purchase Qty
                                    </label>
                                    <Field
                                        id="adtPaymentQty"
                                        name="adtPaymentQty"
                                        className="form-control"
                                        placeholder="1-50"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="adtPaymentAmt">
                                        Adt. Purchase Amount $
                                    </label>
                                    <Field
                                        id="adtPaymentAmt"
                                        name="adtPaymentAmt"
                                        className="form-control"
                                        placeholder="1-50"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                                <div className="form-group text-left self-end">
                                    <button
                                        disabled={isSubmitting}
                                        className="btn bg-indigo-800 hover:bg-indigo-900"
                                        type="submit"
                                    >
                                        {isSubmitting ? "Calculating..." : "Go"}
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

export default CalculatorForm;
