import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import axiosInstance from '../utils/axiosInstance';
import { Wallet, History, Heart, DollarSign } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const FundingPage = () => {
    const [amount, setAmount] = useState(10);
    const [fundings, setFundings] = useState([]);
    const [totalFund, setTotalFund] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showCheckout, setShowCheckout] = useState(false);

    const fetchFundingData = async () => {
        try {
            setLoading(true);
            const [historyRes, totalRes] = await Promise.all([
                axiosInstance.get('/funding'),
                axiosInstance.get('/funding/total')
            ]);
            
            if (historyRes.data.success) {
                setFundings(historyRes.data.fundings);
            }
            if (totalRes.data.success) {
                setTotalFund(totalRes.data.total);
            }
        } catch (error) {
            console.error('Error fetching funding data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFundingData();
    }, []);

    const handleDonationSuccess = (newFunding) => {
        setFundings([newFunding, ...fundings]);
        setTotalFund(prev => prev + newFunding.fundAmount);
        setTimeout(() => setShowCheckout(false), 5000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Donation Section */}
                    <div className="md:w-1/2 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                                    <Heart size={24} fill="currentColor" />
                                </div>
                                <h1 className="text-2xl font-black text-gray-900">Make a Donation</h1>
                            </div>

                            {!showCheckout ? (
                                <div className="space-y-6">
                                    <p className="text-gray-600">Your contributions help us manage logistics, equipment, and outreach to save more lives.</p>
                                    
                                    <div className="grid grid-cols-3 gap-3">
                                        {[10, 20, 50, 100, 200, 500].map(val => (
                                            <button 
                                                key={val}
                                                onClick={() => setAmount(val)}
                                                className={`py-3 rounded-xl font-bold transition ${amount === val ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                ${val}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input 
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xl outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="Enter amount"
                                        />
                                    </div>

                                    <button 
                                        onClick={() => setShowCheckout(true)}
                                        disabled={amount < 1}
                                        className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-lg hover:bg-red-700 transition shadow-lg shadow-red-200"
                                    >
                                        Donate Now
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="font-bold text-gray-900">Payment Details</span>
                                        <button onClick={() => setShowCheckout(false)} className="text-sm text-red-600 font-bold hover:underline">Change Amount</button>
                                    </div>
                                    <Elements stripe={stripePromise}>
                                        <CheckoutForm amount={amount} onSuccess={handleDonationSuccess} />
                                    </Elements>
                                </div>
                            )}
                        </div>

                        {/* Stats Card */}
                        <div className="bg-gray-900 rounded-[2rem] p-8 text-white flex items-center justify-between overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-red-600/30 transition"></div>
                            <div>
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-1">Total Funds Raised</p>
                                <h2 className="text-4xl font-black tracking-tight">${totalFund.toLocaleString()}</h2>
                            </div>
                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                <Wallet size={32} className="text-red-500" />
                            </div>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="md:w-1/2">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-full flex flex-col">
                            <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                    <History size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900">Recent Contributions</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto max-h-[600px] p-6 space-y-4">
                                {loading ? (
                                    <div className="py-12 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 inline-block"></div>
                                    </div>
                                ) : fundings.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400 font-medium">
                                        No donations yet. Be the first to contribute!
                                    </div>
                                ) : (
                                    fundings.map((fund) => (
                                        <div key={fund._id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between hover:bg-gray-100 transition">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-black text-xs">
                                                    {fund.userName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{fund.userName}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                        {new Date(fund.fundingDate).toLocaleDateString()} at {new Date(fund.fundingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-gray-900">${fund.fundAmount}</p>
                                                <p className="text-[10px] text-green-600 font-black uppercase">Succeeded</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FundingPage;
