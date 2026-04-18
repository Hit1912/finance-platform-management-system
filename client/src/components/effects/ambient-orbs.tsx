import { motion } from "framer-motion";

/**
 * AmbientOrbs — Slow-breathing glowing blobs placed in the background.
 * Adds depth and life to the dark background without distracting.
 */
export function AmbientOrbs() {
    return (
        <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none">
            <motion.div
                className="absolute top-[5%] left-[8%] w-[28rem] h-[28rem] rounded-full bg-accent/5 blur-[100px]"
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[10%] right-[15%] w-[32rem] h-[32rem] rounded-full bg-accent-purple/5 blur-[120px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
            <motion.div
                className="absolute top-[50%] left-[50%] w-[25rem] h-[25rem] rounded-full bg-accent-purple/3 blur-[100px] -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.3, 1], x: [-50, 50, -50], y: [-30, 30, -30] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
        </div>
    );
}
