import { Metadata } from 'next';
import React, { Suspense } from 'react';
import FormPurchaseMembership from '@/components/form/form-elements/FormPurchaseMembership';
import HeaderPage from '@/components/header-page/page';
import Loading from '@/components/Loading/Loading';

export const metadata: Metadata = {
  title: "Membership | SKY Membership",
  description:
    "Aplikasi membership SKY Parking",
  // other metadata
};

export default function Membership() {
  return (
    <Suspense fallback={<Loading/>}>
      <div className='bg-white w-full min-h-screen relative'>
        <HeaderPage title="Purchase Product"/>
        <FormPurchaseMembership/>
      </div>
    </Suspense>
  )
}
