import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import emailjs from "emailjs-com";

// Stripe public key
const stripePromise = loadStripe("YOUR_STRIPE_PUBLISHABLE_KEY");

const FanRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    membership: "basic",
  });

  const stripe = useStripe();
  const elements = useElements();

  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      // Create payment method
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        console.error(error);
        return;
      }

      // Send form data and payment method ID to backend
      const response = await axios.post("/api/submit-form", {
        ...formData,
        paymentMethodId: paymentMethod?.id,
      });

      if (response.data.success) {
        // Send email notification to the owner
        emailjs
          .send(
            "YOUR_EMAILJS_SERVICE_ID",
            "YOUR_EMAILJS_TEMPLATE_ID",
            {
              name: formData.name,
              email: formData.email,
              membership: formData.membership,
            },
            "YOUR_EMAILJS_USER_ID"
          )
          .then(
            () => {
              alert("Payment Successful! The owner has been notified.");
            },
            (error) => {
              console.error("Failed to send email", error);
            }
          );
      } else {
        console.error("Payment failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error in payment processing:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 shadow-lg">
      <h1 className="text-xl font-bold mb-4">Fan Registration & Payment</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Membership Type</label>
        <select
          name="membership"
          value={formData.membership}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="vip">VIP</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Method of Payment</label>
        {/* <CardElement className="p-2 border rounded" /> */}
        <select
          name="membership"
          value={formData.membership}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="basic">Cashapp</option>
          <option value="premium">PayPal</option>
          <option value="vip">Gift Card</option>
          <option value="vip">Apple pay</option>
          <option value="vip">Bitcoins</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-800"
      >
        Submit & Pay
      </button>
    </form>
  );
};

// Stripe wrapper
const StripeWrapper: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <FanRegistrationForm />
    </Elements>
  );
};

export default StripeWrapper;
