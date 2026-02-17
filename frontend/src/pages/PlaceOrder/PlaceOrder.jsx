import React, { useContext, useEffect, useState, useCallback } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const totalAmount = getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40;

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  // Dynamically load Razorpay checkout script
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const placeOrder = async (event) => {
    event.preventDefault();

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load Razorpay. Check your internet connection.");
      return;
    }

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: totalAmount,
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (!response.data.success) {
        toast.error(response.data.message || "Error placing order");
        return;
      }

      const { orderId, razorpayOrderId, amount, currency, keyId } = response.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Food Delivery",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (paymentResponse) {
          // Verify payment on backend
          try {
            const verifyRes = await axios.post(url + "/api/order/verify", {
              orderId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });
            if (verifyRes.data.success) {
              setCartItems({});
              toast.success("Payment successful! Order is being processed.");
              navigate("/myorders");
            } else {
              toast.error("Payment verification failed");
              navigate("/");
            }
          } catch (err) {
            toast.error("Error verifying payment");
            navigate("/");
          }
        },
        prefill: {
          name: data.firstName + " " + data.lastName,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#ff6347",
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Try again.");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please Login first");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Please Add Items to Cart");
      navigate("/cart");
    }
  }, [token]);

  return (
    <div className="place-order-page">
      <form className="place-order" onSubmit={placeOrder}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input required name="firstName" value={data.firstName} onChange={onChangeHandler} type="text" placeholder="First name" />
            <input required name="lastName" value={data.lastName} onChange={onChangeHandler} type="text" placeholder="Last name" />
          </div>
          <input required name="email" value={data.email} onChange={onChangeHandler} type="text" placeholder="Email Address" />
          <input required name="street" value={data.street} onChange={onChangeHandler} type="text" placeholder="Street" />
          <div className="multi-fields">
            <input required name="city" value={data.city} onChange={onChangeHandler} type="text" placeholder="City" />
            <input required name="state" value={data.state} onChange={onChangeHandler} type="text" placeholder="State" />
          </div>
          <div className="multi-fields">
            <input required name="zipcode" value={data.zipcode} onChange={onChangeHandler} type="text" placeholder="Zip Code" />
            <input required name="country" value={data.country} onChange={onChangeHandler} type="text" placeholder="Country" />
          </div>
          <input required name="phone" value={data.phone} onChange={onChangeHandler} type="text" placeholder="Phone" />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotals</p>
                <p>&#8377;{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>&#8377;{getTotalCartAmount() === 0 ? 0 : 40}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>&#8377;{totalAmount}</b>
              </div>
            </div>
            <button type="submit">PROCEED TO PAYMENT</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
