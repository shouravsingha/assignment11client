import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle, AlertCircle } from 'lucide-react';

const CheckoutForm = ({ amount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { mongoUser } = useAuth();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [succeeded, setSucceeded] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        if (amount > 0) {
            axiosInstance.post('/funding/create-payment-intent', { amount })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    setError('Failed to initialize payment');
                });
        }
    }, [amount]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        setProcessing(true);
        setError(null);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            setError(error.message);
            setProcessing(false);
            return;
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: mongoUser?.name || 'Anonymous',
                        email: mongoUser?.email || 'unknown',
                    },
                },
            },
        );

        if (confirmError) {
            setError(confirmError.message);
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            setTransactionId(paymentIntent.id);
            
            // Save to database
            try {
                const response = await axiosInstance.post('/funding/save-funding', {
                    fundAmount: amount,
                    transactionId: paymentIntent.id,
                    paymentMethodId: paymentMethod.id
                });

                if (response.data.success) {
                    setSucceeded(true);
                    onSuccess(response.data.funding);
                }
            } catch (err) {
                setError('Payment succeeded but failed to save record. Please contact support.');
            }
        }

        setProcessing(false);
    };

    if (succeeded) {
        return (
            <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-100">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="text-green-500" size={64} />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Thank You!</h3>
                <p className="text-green-700 mb-4">Your donation of ${amount} was successful.</p>
                <div className="bg-white p-3 rounded-lg border border-green-200 inline-block">
                    <p className="text-xs text-gray-500 font-bold uppercase">Transaction ID</p>
                    <p className="text-sm font-mono text-gray-900">{transactionId}</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-inner">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            
            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 text-sm">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-lg hover:bg-red-700 transition shadow-lg shadow-red-200 disabled:bg-gray-400 disabled:shadow-none"
            >
                {processing ? 'Processing...' : `Confirm Donation of $${amount}`}
            </button>
        </form>
    );
};

export default CheckoutForm;
