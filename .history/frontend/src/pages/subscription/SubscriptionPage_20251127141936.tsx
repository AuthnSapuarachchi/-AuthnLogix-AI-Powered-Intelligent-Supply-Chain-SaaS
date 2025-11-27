import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { api } from "../../shared/api/axios";
import { Button } from "../../shared/ui/Button";
import { useNavigate } from "react-router-dom";

// 1. Initialize Stripe (Outside component to avoid recreating it)
const stripePromise = loadStripe("pk_test_YOUR_PUBLISHABLE_KEY_HERE"); // <--- PASTE KEY HERE

// 2. The Internal Form Component
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    // Confirm Payment
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/dashboard", // Redirect here after success
      },
    });

    if (error) {
      alert(error.message);
      setIsProcessing(false);
    }
    // If success, Stripe redirects automatically
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isProcessing} className="w-full">
        {isProcessing ? "Processing..." : "Pay $50.00"}
      </Button>
    </form>
  );
};

// 3. The Main Page Component
export const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");

  // Fetch the "Permission Slip" from Backend on load
  useState(() => {
    api.post("/payments/create-intent", { amount: 50.00 })
      .then(res => setClientSecret(res.data.clientSecret))
      .catch(err => alert("Failed to init payment"));
  });

  if (!clientSecret) return <div className="text-white p-10">Loading Payment System...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white text-black p-8 rounded-xl shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Upgrade to Pro</h1>
          <p className="text-gray-500">Unlock advanced analytics and reports.</p>
          <div className="text-4xl font-bold mt-4 text-blue-600">$50.00</div>
        </div>

        {/* Wrap form in Elements Provider */}
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
        
        <button onClick={() => navigate("/dashboard")} className="mt-4 text-sm text-gray-500 underline w-full text-center">
            Cancel
        </button>
      </div>
    </div>
  );
};