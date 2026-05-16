"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const navigate = useNavigate();

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full border border-gray-500 bg-transparent p-1"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}>
      <Tab setPosition={setPosition} onClick={() => navigate('/')}>Home</Tab>
      <Tab setPosition={setPosition} onClick={() => navigate('/planner')}>Meal Planner</Tab>
      <Tab setPosition={setPosition} onClick={() => navigate('/favourites')}>Favourites</Tab>
      <Tab setPosition={setPosition} onClick={() => navigate('/shopping')}>Shopping List</Tab>
      <Tab setPosition={setPosition} onClick={() => navigate('/community')}>Community</Tab>
      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
  onClick
}) => {
  const ref = useRef(null);
  return (
    <li
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base">
      {children}
    </li>
  );
};

const Cursor = ({
  position
}) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-white md:h-12" />
  );
};

export default NavHeader;
