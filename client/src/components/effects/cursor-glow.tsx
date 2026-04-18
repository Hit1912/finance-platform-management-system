import { useEffect, useRef } from "react";

export function CursorGlow() {
    const glowRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: 0, y: 0 });
    const currentPos = useRef({ x: 0, y: 0 });
    const raf = useRef<number | null>(null);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            pos.current = { x: e.clientX, y: e.clientY };
        };

        const tick = () => {
            // Smooth lerp (linear interpolation) for liquid movement
            currentPos.current.x += (pos.current.x - currentPos.current.x) * 0.08;
            currentPos.current.y += (pos.current.y - currentPos.current.y) * 0.08;

            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${currentPos.current.x - 200}px, ${currentPos.current.y - 200}px)`;
            }
            raf.current = requestAnimationFrame(tick);
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        raf.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("mousemove", onMove);
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, []);

    return (
        <div
            ref={glowRef}
            className="fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-0 rounded-full"
            style={{
                background:
                    "radial-gradient(circle at center, rgba(67, 56, 202, 0.12) 0%, rgba(99, 102, 241, 0.03) 45%, transparent 70%)",
                willChange: "transform",
                filter: "blur(20px)",
            }}
        />
    );
}
