"use client";
import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface TimelineContentProps {
  children?: React.ReactNode;
  as?: any;
  animationNum?: number;
  timelineRef?: React.RefObject<any>;
  customVariants?: Variants;
  className?: string;
  viewport?: {
    amount?: number;
    margin?: string;
    once?: boolean;
  };
  delay?: boolean;
  [key: string]: any;
}

export const TimelineContent = React.forwardRef<HTMLElement, TimelineContentProps>(
  (
    {
      children,
      as = "div",
      animationNum = 0,
      timelineRef,
      customVariants,
      className,
      viewport = { amount: 0.3, margin: "0px 0px -120px 0px", once: true },
      delay,
      ...props
    },
    ref
  ) => {
    const localRef = useRef<HTMLElement>(null);
    const resolvedRef = (ref as React.RefObject<any>) || localRef;

    const isInView = useInView(timelineRef || resolvedRef, {
      once: viewport.once !== undefined ? viewport.once : true,
      amount: viewport.amount !== undefined ? viewport.amount : 0.3,
      margin: viewport.margin !== undefined ? viewport.margin : "0px 0px -120px 0px",
    });

    const defaultVariants: Variants = {
      hidden: { opacity: 0, y: 20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * (delay ? 0.2 : 0.1),
          duration: 0.5,
          ease: "easeOut",
        },
      }),
    };

    const MotionComponent = motion[as as keyof typeof motion] || motion.div;

    return (
      <MotionComponent
        ref={resolvedRef}
        custom={animationNum}
        variants={customVariants || defaultVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={className}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

TimelineContent.displayName = "TimelineContent";

export const TimelineAnimation = TimelineContent;
