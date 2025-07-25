"use client";
import React, { useEffect, useState } from "react";
// import Badge from "../ui/badge/Badge";
import { DollarLineIcon, GroupIcon } from "@/icons";
import axios from "axios";
import { BiWallet } from "react-icons/bi";
import { ScaleLoader } from "react-spinners";

export const EcommerceMetrics = ({
  month,
  year,
}: {
  month: string;
  year: string;
}) => {
  const [totalMemberActive, setTotalMemberActive] = useState(0);
  // const [totalMemberInActive, setTotalMemberInActive] = useState(0);
  const [income, setIncome] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const monthYear = `${year ?? ""}-${month ?? ""}`;
      try {
        const response = await axios.get(`/api/dashboard-value`, {
          params: {
            month: monthYear,
          },
        });
        setTotalMemberActive(response.data.totalMembershipActive);
        // setTotalMemberInActive(response.data.totalMemberInActive);
        setIncome(response.data.totalPrice.totalPrice);
        setBalance(response.data.totalBalancePoint);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [month, year]);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-2">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Member Active
            </span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
              {isLoading ? (
                <div className="m-auto flex h-10 items-center justify-center text-center text-gray-400">
                  <ScaleLoader
                    height={10}
                    width={5}
                    margin={2}
                    color="#bbb"
                    loading={true}
                  />
                </div>
              ) : (
                Number(totalMemberActive).toLocaleString("id-ID")
              )}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <DollarLineIcon
            size={30}
            className="text-gray-800 dark:text-white/90"
          />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Income
            </span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
              {isLoading ? (
                <div className="m-auto flex h-10 items-center justify-center text-center text-gray-400">
                  <ScaleLoader
                    height={10}
                    width={5}
                    margin={2}
                    color="#bbb"
                    loading={true}
                  />
                </div>
              ) : (
                Number(income).toLocaleString("id-ID")
              )}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <BiWallet size={30} className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Balance
            </span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
              {isLoading ? (
                <div className="m-auto flex h-10 items-center justify-center text-center text-gray-400">
                  <ScaleLoader
                    height={10}
                    width={5}
                    margin={2}
                    color="#bbb"
                    loading={true}
                  />
                </div>
              ) : (
                Number(balance).toLocaleString("id-ID")
              )}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
