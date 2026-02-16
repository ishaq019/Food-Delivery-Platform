import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

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
  const [showQR, setShowQR] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const UPI_ID = "7075320283@ybl"; // UPI ID for payment
  const totalAmount = getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40;
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Food%20Delivery&am=${totalAmount}&cu=INR&tn=Order%20Payment`;

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
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
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });
      if (response.data.success) {
        setOrderId(response.data.orderId);
        setShowQR(true);
        toast.success("Order placed! Scan QR to pay");
      } else {
        toast.error(response.data.message || "Error placing order");
      }
    } catch (error) {
      // If backend is down, still show QR for demo
      setShowQR(true);
      toast.info("Scan QR code to complete payment");
    }
  };

  const confirmPayment = async () => {
    try {
      if (orderId) {
        await axios.post(url + "/api/order/verify", {
          orderId,
          success: "true",
        });
      }
      setCartItems({});
      toast.success("Payment confirmed! Order is being processed.");
      navigate("/myorders");
    } catch (error) {
      setCartItems({});
      toast.success("Payment confirmed!");
      navigate("/");
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
      {!showQR ? (
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
      ) : (
        <div className="qr-payment-section">
          <div className="qr-payment-card">
            <h2>Scan & Pay with UPI</h2>
            <p className="qr-amount">&#8377;{totalAmount}</p>
            <div className="qr-code-wrapper">
              <QRCodeSVG
                value={upiLink}
                size={220}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="qr-upi-id">UPI ID: {UPI_ID}</p>
            <p className="qr-instruction">
              Open any UPI app (GPay, PhonePe, Paytm) and scan this QR code
            </p>
            <div className="qr-actions">
              <button className="qr-confirm-btn" onClick={confirmPayment}>
                I've Completed Payment
              </button>
              <button className="qr-cancel-btn" onClick={() => setShowQR(false)}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
