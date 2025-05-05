import { Metadata } from 'next';
import React from 'react'
import PaymentProcess from '../../(customer)/(ui-elements)/payment-process/page';

export const metadata: Metadata = {
  title: "Payment | SKY Parking",
  description:
    "Parking Membership SKY PARKING",
};

export default function page() {
  return (
    <div>
      <PaymentProcess/>
    </div>
  )
}
