import { Metadata } from 'next';
import React, { Suspense } from 'react'
import TopupPage from '../../(customer)/(ui-elements)/topup-point/page';
import Loading from '@/components/Loading/Loading';

export const metadata: Metadata = {
  title: "Topup point | SKY Parking",
  description:
    "Parking Membership SKY PARKING",
};

export default function page() {
  return (
    <Suspense fallback={<Loading/>}><TopupPage/></Suspense>
  )
}
