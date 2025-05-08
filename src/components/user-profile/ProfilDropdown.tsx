"use client";
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/useAuth';
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';
import { FiUser, FiLogOut } from 'react-icons/fi';
import Loading from '../Loading/Loading';
import Cookies from 'js-cookie';

export default function ProfileDropdown() {
  const router = useRouter();
  const {logout} = useAuth();
  const { mutate: logoutUser } = useLogout();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    logoutUser(undefined, {
      onSuccess: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        Cookies.remove('refreshToken');
        logout();
        router.push('/');
        setIsLoading(false);
      },
      onError: (error) => {
        console.error("Logout gagal:", error);
        setIsLoading(false);
      },
    });
    
    router.push('/');
  }

  if(isLoading){
    return <Loading/>
  }
  
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex justify-center items-center rounded-full w-10 h-10 bg-white shadow-md hover:ring-2 ring-blue-500 transition">
          <span className="font-bold text-gray-700">TS</span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 mt-2 w-44 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                onClick={() => {
                    router.push('/profile');
                }}
                  className={`${
                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <FiUser className="mr-2" />
                  Profil
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-red-100 text-red-700' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
