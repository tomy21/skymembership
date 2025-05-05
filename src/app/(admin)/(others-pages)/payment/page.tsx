import { Metadata } from 'next';
import React, { Suspense } from 'react'
import PaymentProcess from '../../(customer)/(ui-elements)/payment-process/PaymentProcess';
import ProgressBarProvider from '@/components/ProgressBarProvider';

export const metadata: Metadata = {
  title: "Payment | SKY Parking",
  description:
    "Parking Membership SKY PARKING",
};

export default function page() {
  return (
    <Suspense>
      <ProgressBarProvider><PaymentProcess /></ProgressBarProvider>
    </Suspense>
  )
}
