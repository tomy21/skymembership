import { Metadata } from 'next';
import React from 'react';
import HeaderPage from '../header-page/page';
import VehicleCard from '@/components/card/VehicleCard';
import VehicleAdd from '@/components/modal/VehicleAdd';

export const metadata: Metadata = {
  title: "Vehicle | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function Vehicle() {
  return (
    <div className='bg-white w-full min-h-screen relative'>
      {/* Header tetap di atas */}
      <HeaderPage title="Vehicle" />

      {/* Konten Card yang scrollable */}
      <div className="flex-1 overflow-y-auto"> {/* Add padding-top for header space */}
        <VehicleCard />
      </div>

      {/* Button di pojok kanan bawah */}
      <VehicleAdd/>
    </div>
  );
}
