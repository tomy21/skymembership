import { Metadata } from 'next';
import React from 'react'
import FormValidationPurchase from '@/components/form/form-elements/FormValidationPurchase';
import HeaderPage from '@/components/header-page/page';

export const metadata: Metadata = {
  title: "Purchase | SKY Membership",
  description:
    "Purchase your membership product",
  // other metadata
};

export default function FormValidationPurchasePage() {
  return (
    <div className='bg-white w-full min-h-screen relative'>
        <HeaderPage title="Transaction"/>
        <FormValidationPurchase/>
    </div>
  )
}
