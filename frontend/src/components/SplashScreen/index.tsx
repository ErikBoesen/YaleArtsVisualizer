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
import { Transition } from "transition-hook";

const SPLASH_SCREEN_STORAGE_KEY = "yam-splash-done";

export default function SplashScreen() {
  const [showSplash, dispatch] = useReducer(
    (prev: boolean, newState: boolean) => {
      localStorage.setItem(SPLASH_SCREEN_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    },
    typeof window !== "undefined",
    () => !localStorage.getItem(SPLASH_SCREEN_STORAGE_KEY)
  );

  return (
    <Transition state={showSplash} timeout={300}>
      {(stage, shouldMount) =>
        shouldMount && (
          <section className={s.container} suppressHydrationWarning>
            <YAMLogo className={s.logo} />
            <div className={s.sublogo}>
              <p>Yale Arts Map</p>
              <p>SWE F23</p>
            </div>
          </section>
        )
      }
    </Transition>
  );
}
