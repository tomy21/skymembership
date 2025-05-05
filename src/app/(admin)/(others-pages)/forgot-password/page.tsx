import { Metadata } from 'next';
import React from 'react'
import ForgotePassword from '../../(customer)/(ui-elements)/ForgotePassword/page';

export const metadata: Metadata = {
  title: "Reset Password | SKY Membership",
  description:
    "Membership Parking SKY PARKING",
  // other metadata
};
export default function page() {
  return (
    <div>
      <ForgotePassword />
    </div>
  );
}
