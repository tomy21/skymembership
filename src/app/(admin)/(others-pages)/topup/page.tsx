import { Metadata } from 'next';
import React from 'react'
import TopupPage from '../../(customer)/(ui-elements)/topup-point/page';

export const metadata: Metadata = {
  title: "Topup point | SKY Parking",
  description:
    "Parking Membership SKY PARKING",
};

export default function page() {
  return (
    <div>
      <TopupPage/>
    </div>
  )
}
