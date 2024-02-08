import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from './CheckoutForm'

export default function Stripe({ amount }) {
    const[clientSecret, setClientSecret] = useState('')
    const total = amount * 100
    const { isLoggedIn } = useSelector(state => state.user)
    const navigate = useNavigate()
    const stripePromise = loadStripe('pk_test_51OhRsiSEj8T8KuEJ7sQ0Wo8Lr7qcgcI9rDKDc1EQ2TmIZ25uby62QJLEhBLzKjU2Z0tcitlDAQO405q0SqyCae0r00A2bkoxTC')

    useEffect(() => {
        if(!isLoggedIn) {
            navigate('/login')
        }else {
            const fetchClientSecret = async () => {
                try {
                    const response = await axios.post('http://localhost:3001/payments/pay', 
                    { 
                        amount: total
                    })
                    setClientSecret(response.data.clientSecret)
                } catch (error) {
                    console.log(error)
                }
            }
            fetchClientSecret()
        }
    }, [isLoggedIn])

    return (
        <>
            {
                stripePromise && clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm />
                    </Elements>
                )
            }
        </>
    )
}
