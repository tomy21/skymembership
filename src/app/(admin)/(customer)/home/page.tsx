
import React from 'react'
import HeaderHome from '../(ui-elements)/header-home/page';
import CardHome from '../(ui-elements)/card-home/Page';
import HistoryHome from '../(ui-elements)/history-home/Page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Home | SKY Membership",
  description:
    "Aplikasi membership SKY Parking",
  // other metadata
};

export default function Home() {
   
  return (
    <div className='bg-white w-full min-h-screen'>
      <HeaderHome/>
      <CardHome/>
      <HistoryHome/>
    </div>
  )
}
