import { Metadata } from 'next';
import React, { Suspense } from 'react'
import ChangePassword from '../../(customer)/(ui-elements)/ChangePassword/page';

export const metadata: Metadata = {
  title: "Change Password | SKY Membership",
  description:
    "Membership Parking SKY PARKING",
};
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePassword />
    </Suspense>
  );
}
