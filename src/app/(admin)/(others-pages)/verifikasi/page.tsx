import { Metadata } from 'next';
import React from 'react'
import PinVerify from '../../(customer)/(ui-elements)/pin-verifikasi/page';

export const metadata: Metadata = {
  title: "Verifikasi | SKY Parking",
  description:
    "Parking Membership SKY PARKING",
};

export default function page() {
  return (
    <div>
      <PinVerify/>
    </div>
  )
}
