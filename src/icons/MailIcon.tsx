import React from "react";
export default function MailIcon({ className = "" }: { className?: string }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M2.5 5.83334C2.5 5.3731 2.8731 5 3.33333 5H16.6667C17.1269 5 17.5 5.3731 17.5 5.83334V14.1667C17.5 14.6269 17.1269 15 16.6667 15H3.33333C2.8731 15 2.5 14.6269 2.5 14.1667V5.83334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.5 5.83334L10 10.8333L17.5 5.83334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}