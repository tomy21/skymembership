import React from 'react'
import { ScaleLoader } from 'react-spinners'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">
          <ScaleLoader 
            height={100}
            width={5}
            margin={2}
            color="#bbb"
            loading={true}
          />
        </div>
  )
}
