/*
 * index.tsx
 * Author: Evan Kirkiles
 * Created on: Fri Oct 27 2023
 * 2023 Yale SWE
 */
"use client";

import YAMLogo from "@/assets/svg/YAMLogo";
import s from "./SplashScreen.module.scss";
import { useEffect, useReducer, useState } from "react";
import { Transition, useTransition } from "transition-hook";

const SPLASH_SCREEN_STORAGE_KEY = "yam-splash-done";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useReducer(
    (prev: boolean, newState: boolean) => {
      // localStorage.setItem(
      //   SPLASH_SCREEN_STORAGE_KEY,
      //   JSON.stringify(!newState)
      // );
      return newState;
    },
    typeof window !== "undefined",
    () =>
      typeof window !== "undefined"
        ? localStorage.getItem(SPLASH_SCREEN_STORAGE_KEY) !== "true"
        : false
  );
  const { shouldMount, stage } = useTransition(showSplash, 700);
  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 1000);
    return () => clearTimeout(timeout);
  }, [showSplash]);

  return (
    <section
      className={s.container}
      style={{
        opacity:
          typeof window !== "undefined" && (stage === "leave" || !shouldMount)
            ? 0
            : undefined,
        pointerEvents:
          typeof window !== "undefined" && !shouldMount ? "none" : undefined,
      }}
      suppressHydrationWarning
    >
      <YAMLogo className={s.logo} />
      <div className={s.sublogo}>
        <p>Yale Arts Map</p>
        <p>SWE F23</p>
      </div>
    </section>
  );
}
