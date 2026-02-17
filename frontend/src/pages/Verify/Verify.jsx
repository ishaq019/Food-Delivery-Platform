import React, { useEffect } from 'react'
import './Verify.css'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";

const Verify = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Razorpay verification happens inline, so redirect to orders
        toast.info("Redirecting to your orders...");
        navigate("/myorders");
    }, [])

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify
