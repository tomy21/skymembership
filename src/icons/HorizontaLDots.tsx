import React from "react";
export default function HorizontaLDots({ className = "" }: { className?: string }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M5 10H5.00833M10 10H10.0083M15 10H15.0083" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}