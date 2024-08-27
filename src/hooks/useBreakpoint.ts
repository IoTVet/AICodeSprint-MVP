// hooks/useBreakpoint.ts

import { useState, useEffect } from 'react';
import throttle from 'lodash/throttle';

// Define breakpoints (you can adjust these values as needed)
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

type Breakpoint = keyof typeof breakpoints;

interface BreakpointState {
  windowWidth: number;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isXsDown: boolean;
  isSmDown: boolean;
  isMdDown: boolean;
  isLgDown: boolean;
  isXlDown: boolean;
  isXsUp: boolean;
  isSmUp: boolean;
  isMdUp: boolean;
  isLgUp: boolean;
  isXlUp: boolean;
  breakpoint: Breakpoint;
}

export function useBreakpoint() {
  const [bpState, setBpState] = useState<BreakpointState>(() => getBreakpointState(typeof window !== 'undefined' ? window.innerWidth : breakpoints.lg));

  useEffect(() => {
    const calcInnerWidth = throttle(function() {
      setBpState(getBreakpointState(window.innerWidth));
    }, 200);

    window.addEventListener('resize', calcInnerWidth);
    return () => window.removeEventListener('resize', calcInnerWidth);
  }, []);

  return bpState;
}

function getBreakpointState(windowWidth: number): BreakpointState {
  const isXs = windowWidth < breakpoints.sm;
  const isSm = windowWidth >= breakpoints.sm && windowWidth < breakpoints.md;
  const isMd = windowWidth >= breakpoints.md && windowWidth < breakpoints.lg;
  const isLg = windowWidth >= breakpoints.lg && windowWidth < breakpoints.xl;
  const isXl = windowWidth >= breakpoints.xl;

  let breakpoint: Breakpoint = 'xs';
  if (isXl) breakpoint = 'xl';
  else if (isLg) breakpoint = 'lg';
  else if (isMd) breakpoint = 'md';
  else if (isSm) breakpoint = 'sm';

  return {
    windowWidth,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXsDown: windowWidth < breakpoints.sm,
    isSmDown: windowWidth < breakpoints.md,
    isMdDown: windowWidth < breakpoints.lg,
    isLgDown: windowWidth < breakpoints.xl,
    isXlDown: true, // Always true as there's no larger breakpoint
    isXsUp: true, // Always true as there's no smaller breakpoint
    isSmUp: windowWidth >= breakpoints.sm,
    isMdUp: windowWidth >= breakpoints.md,
    isLgUp: windowWidth >= breakpoints.lg,
    isXlUp: windowWidth >= breakpoints.xl,
    breakpoint,
  };
}