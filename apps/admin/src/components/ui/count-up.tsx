'use client';

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export default function CountUp({
    value,
    prefix = "",
    suffix = "",
}: {
    value: number;
    prefix?: string;
    suffix?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "-10px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = prefix + Math.floor(latest).toLocaleString() + suffix;
            }
        });
    }, [springValue, prefix, suffix]);

    return <span ref={ref} className="tabular-nums" />;
}
