import { Metadata } from 'next';
import React from 'react'
import HeaderPage from '../header-page/page';
import FormPurchaseMembership from '@/components/form/form-elements/FormPurchaseMembership';

export const metadata: Metadata = {
  title: "Membership | SKY Membership",
  description:
    "Aplikasi membership SKY Parking",
  // other metadata
};

export default function Membership() {
  return (
    <div className='bg-white w-full min-h-screen relative'>
        <HeaderPage title="Purcahase Product"/>
        <FormPurchaseMembership/>
    </div>
  )
}
