import { Metadata } from 'next';
import React, { Suspense } from 'react'
import PinVerify from '../../(customer)/(ui-elements)/pin-verifikasi/PinVerify';
import ProgressBarProvider from '@/components/ProgressBarProvider';

export const metadata: Metadata = {
  title: "Verifikasi | SKY Parking",
  description:
    "Parking Membership SKY PARKING",
};

export default function page() {
  return (
    <Suspense>
      <ProgressBarProvider>
        <PinVerify/>
      </ProgressBarProvider>
    </Suspense>
  )
}
