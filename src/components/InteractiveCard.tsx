"use client";
import React from "react";

export default function InteractiveCard({
  children,
}: {
  children: React.ReactNode;
}) {

  function onCardMouseAction(event: React.SyntheticEvent) {
    if (event.type == 'mouseover') {
        event.currentTarget.classList.remove('shadow-lg')
        event.currentTarget.classList.add('shadow-xl')
        event.currentTarget.classList.remove('bg-white')
        event.currentTarget.classList.add('bg-neutral-100')
    } else {
        event.currentTarget.classList.remove('shadow-xl')
        event.currentTarget.classList.add('shadow-lg')
        event.currentTarget.classList.remove('bg-neutral-100')
        event.currentTarget.classList.add('bg-white')
    }
  }

  return (
    <div
      className="w-full h-[300px] rounded-lg shadow-lg bg-white"
      onMouseOver={(e) => onCardMouseAction(e)}
      onMouseOut={(e) => onCardMouseAction(e)}
    >
        {children}
    </div>
  );
}
