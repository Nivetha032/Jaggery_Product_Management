import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        address: '',
        phoneNumber: '',
        paymentAmount: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('COD'); 
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const payload = {
            ...values,
            paymentMethod,
        };

        
        axios.post('http://localhost:3000/payment/process', payload)
            .then(result => {
                if (result.data.paymentStatus) {
                    
                    alert('Payment successful!');
                    navigate('/thank-you');
                } else {
                    
                    setError(result.data.Error);
                }
            })
            .catch(err => {
                console.error(err);
                setError('An error occurred while processing your payment.');
            });
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 paymentPage'>
            <div className='p-3 rounded w-25 border paymentForm'>
                <div className='text-danger'>
                    {error && error}
                </div>
                <h2>Payment Page</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="name"><strong>Name:</strong></label>
                        <input type="text" name='name' autoComplete='off' placeholder='Enter Name'
                            onChange={(e) => setValues({ ...values, name: e.target.value })} className='form-control rounded-0' />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email:</strong></label>
                        <input type="email" name='email' autoComplete='off' placeholder='Enter Email'
                            onChange={(e) => setValues({ ...values, email: e.target.value })} className='form-control rounded-0' />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="address"><strong>Address:</strong></label>
                        <input type="text" name='address' autoComplete='off' placeholder='Enter Address'
                            onChange={(e) => setValues({ ...values, address: e.target.value })} className='form-control rounded-0' />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="phoneNumber"><strong>Phone Number:</strong></label>
                        <input type="tel" name='phoneNumber' autoComplete='off' placeholder='Enter Phone Number'
                            onChange={(e) => setValues({ ...values, phoneNumber: e.target.value })} className='form-control rounded-0' />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="paymentAmount"><strong>Amount:</strong></label>
                        <input type="number" name='paymentAmount' placeholder='Enter Amount'
                            onChange={(e) => setValues({ ...values, paymentAmount: e.target.value })} className='form-control rounded-0' />
                    </div>
                    
                    {/* Payment Method */}
                    <div className='mb-3'>
                        <strong>Payment Method:</strong>
                        <div>
                            <input type='radio' id='COD' name='paymentMethod' value='COD'
                                checked={paymentMethod === 'COD'}
                                onChange={(e) => setPaymentMethod(e.target.value)} />
                            <label htmlFor='COD'>Cash on Delivery (COD)</label>
                        </div>
                        {/* Add more payment methods if needed */}
                    </div>
                    
                    <button className='btn btn-success w-100 rounded-0 mb-2'>Make Payment</button>
                </form>
            </div>
        </div>
    );
};

export default PaymentPage;
