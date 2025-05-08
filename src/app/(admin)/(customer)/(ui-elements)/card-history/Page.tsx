import React from 'react';
import { cn } from '../../../../../../libs/utils';
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
 // opsional jika pakai clsx atau cn helper

type CardHistoryProps = {
  type: 'payment' | 'parking';
  date: string;
  product: string;
  location: string;
  productName: string;
  amount: number;
  status: 'paid' | 'failed' | 'pending' | 'masuk' | 'keluar';
  isMember?: boolean;
  onClick?: () => void;
};

export default function CardHistory({
  type,
  date,
  product,
  location,
  productName,
  amount,
  status,
  isMember,
  onClick,
}: CardHistoryProps) {
  const statusColorMap: Record<string, string> = {
    paid: 'text-green-600 bg-green-100',
    failed: 'text-red-600 bg-red-100',
    pending: 'text-yellow-600 bg-yellow-100',
    masuk: 'text-green-600 bg-green-100',
    keluar: 'text-red-600 bg-red-100',
  };

  const statusLabelMap: Record<string, string> = {
    paid: 'Paid',
    failed: 'Failed',
    pending: 'Pending',
    masuk: 'Masuk Area',
    keluar: 'Keluar Area',
  };

  return (
    <div onClick={onClick} className="relative w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md p-4 space-y-3">
        <div className="border border-dashed border-slate-300 w-full absolute left-0 top-14"></div>
        <div className="border border-dashed border-slate-300 w-full absolute left-0 bottom-10"></div>
        <div className="w-8 h-8 rounded-full bg-white absolute top-10 -left-4 border-r border-slate-300"></div>
        <div className="w-8 h-8 rounded-full bg-white absolute top-10 -right-4 border-l border-slate-300"></div>
      {/* Header */}
      <div className="flex justify-between items-start mb-7">
        <span className="text-xs text-gray-500">{format(new Date(date), "dd MMMM yyyy, HH:mm", {
            locale: id,
          })}</span>
        <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-600 capitalize">
          {product}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-1 py-3">
        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{location}</p>
        <div className="flex justify-between items-center w-full">
            <p className="text-base font-semibold text-gray-800 dark:text-white">{productName}</p>
        <p className="text-md font-bold text-emerald-600 dark:text-emerald-400">
          {amount.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
        </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-5 space-y-2">
        <span
          className={cn(
            'text-xs font-semibold px-2 py-1 rounded',
            statusColorMap[status]
          )}
        >
          {statusLabelMap[status]}
        </span>
        {type === 'parking' && (
          <span
            className={cn(
              'text-xs px-2 py-1 rounded-full border',
              isMember
                ? 'text-green-700 border-green-400 bg-green-100'
                : 'text-gray-600 border-gray-300 bg-gray-100'
            )}
          >
            {isMember ? 'Member' : 'Non Member'}
          </span>
        )}
      </div>
    </div>
  );
}
