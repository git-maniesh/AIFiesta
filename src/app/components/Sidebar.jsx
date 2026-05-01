"use client";

import Image from "next/image";
import React, { useState } from "react";
import PlusIcon from "../../../public/plus.svg";
import ProIcon from "../../../public/pro.svg";
import UserIcon from "../../../public/user2.svg";
import HideIcon from "../../../public/drawer1.png";
import { Progress } from "./ui/Progress";

const Sidebar = ({ userPrompts, onNewChat }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Collapsed state — show only icons
  if (collapsed) {
    return (
      <div className="bg-cod-gray w-16 h-screen flex flex-col items-center justify-between py-4 flex-shrink-0 border-r border-mine-shaft transition-all duration-300">
        <div className="flex flex-col items-center gap-4">
          <img
            src="https://chat.aifiesta.ai/static/images/logo/icon.png"
            alt="logo"
            className="w-8 h-8 cursor-pointer"
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
          />
          <button
            onClick={onNewChat}
            className="bg-white hover:bg-white/90 text-black w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer text-lg font-bold"
            title="New Chat"
          >
            +
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Image src={UserIcon} width={18} height={18} alt="Settings" className="opacity-70" />
          <Image
            src={HideIcon}
            width={20}
            height={20}
            alt="Expand"
            className="cursor-pointer opacity-70 hover:opacity-100 transition"
            onClick={() => setCollapsed(false)}
          />
        </div>
      </div>
    );
  }

  // Expanded state — full sidebar
  return (
    <div className="bg-cod-gray max-w-64 min-w-64 h-screen flex flex-col justify-between flex-shrink-0 border-r border-mine-shaft transition-all duration-300">
      <div>
        {/* logo and header + new chat button */}
        <div className="flex flex-col items-start justify-center p-6 gap-6">
          <div className="flex items-center justify-between w-full text-white">
            <div className="flex items-center gap-4">
              <img
                src="https://chat.aifiesta.ai/static/images/logo/icon.png"
                alt="logo"
                className="w-10 h-10"
              />
              <span className="text-alto text-xl font-bold">AI Fiesta</span>
            </div>
            {/* Collapse button */}
            <button
              onClick={() => setCollapsed(true)}
              className="text-gray-400 hover:text-white transition cursor-pointer p-1"
              title="Collapse sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 17l-5-5 5-5" />
                <path d="M18 17l-5-5 5-5" />
              </svg>
            </button>
          </div>
          {/* new chat button */}
          <button
            onClick={onNewChat}
            className="bg-white hover:bg-white/90 w-full text-black text-sm flex items-center justify-center gap-2 py-2 px-4 rounded-lg cursor-pointer"
          >
            + New Chat
          </button>
        </div>
        {/* line to divide */}
        <div className="w-full h-0.5 bg-mine-shaft mt-3"></div>
        <div className="py-4 px-6 flex items-center justify-between">
          <span className="text-sm text-nobel font-medium">Projects</span>
          <button className="rounded-full bg-white text-black p-1 w-6 h-6 flex items-center justify-center">
            <Image src={PlusIcon} width={20} height={20} alt="Pluslogo" />
          </button>
        </div>
        <div className="flex flex-col items-start justify-center py-4 px-6">
          <span className="text-nobel text-xs font-medium">Chats</span>
          <div className="no-scrollbar mt-2 flex justify-start flex-col gap-4 h-[15rem] overflow-y-scroll">
            {userPrompts.map((prompt, index) => {
              return (
                <span key={index} className="text-alto text-sm font-medium truncate">
                  {prompt}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      {/* free card */}
      <div className="p-4">
        <div className="rounded-lg bg-ebony-clay flex items-start py-3 px-4 flex-col border border-nobel/50">
          <span className="text-sm text-white">Free Plan</span>
          <span className="text-xs text-nobel">1/3 messages used</span>
          {/* progress bar */}
          <Progress value={50} className="bg-oxford-blue mt-3" />
        </div>
        <button className="w-full bg-white flex items-center justify-center gap-4 rounded-md py-2.5 px-4 mt-4">
          <Image src={ProIcon} width={20} height={20} alt="ThunderLogo" />
          <span className="text-sm font-medium">Upgrade Plan</span>
        </button>
        <div className="p-4 flex items-center justify-between px-4 py-3">
          <div className="flex items-center justify-center gap-4">
            {/* user Icon */}
            <Image src={UserIcon} width={18} height={18} alt="UserLogo" />
            <span className="text-white text-sm">Settings</span>
          </div>
          {/* drawer Icon — now collapses sidebar */}
          <Image
            src={HideIcon}
            width={20}
            height={20}
            className="cursor-pointer"
            alt="HideLogo"
            onClick={() => setCollapsed(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
