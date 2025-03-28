"use client";

import SessionWrapper from "../components/SessionWrapper";



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionWrapper>
        {children}
    </SessionWrapper>
    
   
  );
}