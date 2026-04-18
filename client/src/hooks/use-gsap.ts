import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const usePageTransition = (selector: string, dependencies: any[] = []) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            // Kill existing animations on these elements to prevent conflicts
            gsap.killTweensOf(elements);

            gsap.fromTo(
                elements,
                {
                    opacity: 0,
                    y: 30,
                    filter: 'blur(10px)',
                    scale: 0.98,
                    transformPerspective: 1000,
                    rotationX: -5
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    scale: 1,
                    rotationX: 0,
                    duration: 1.2,
                    stagger: {
                        amount: 0.4,
                        ease: "power2.inOut"
                    },
                    ease: 'expo.out',
                    clearProps: 'filter,transform',
                }
            );
        }
    }, [selector, ...dependencies]);
};

// Scroll-triggered reveal for elements that come into viewport
export const useScrollReveal = (selector: string) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
            gsap.fromTo(
                el,
                {
                    opacity: 0,
                    y: 40,
                    filter: 'blur(8px)'
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1.1,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    }
                }
            );
        });
        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }, [selector]);
};

export const useCounterAnimation = (selector: string, dependencies: any[] = []) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
            gsap.from(el, {
                textContent: 0,
                duration: 2,
                ease: 'power4.out',
                snap: { textContent: 0.01 },
            });
        });
    }, [selector, ...dependencies]);
};

// Floating animation for cards/elements
export const useFloatingAnimation = (selector: string) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, i) => {
            gsap.to(el, {
                y: -10,
                duration: 2 + (i % 3) * 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.2
            });
        });
    }, [selector]);
};

export const useHoverPulse = (selector: string) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        const handlers: { el: Element; enter: () => void; leave: () => void }[] = [];

        elements.forEach((el) => {
            const enter = () => gsap.to(el, {
                scale: 1.04,
                duration: 0.4,
                ease: 'elastic.out(1, 0.75)',
                boxShadow: '0 10px 40px -10px rgba(99,102,241,0.3)'
            });
            const leave = () => gsap.to(el, {
                scale: 1,
                duration: 0.5,
                ease: 'power3.out',
                boxShadow: '0 0px 0px 0px rgba(0,0,0,0)'
            });
            el.addEventListener('mouseenter', enter);
            el.addEventListener('mouseleave', leave);
            handlers.push({ el, enter, leave });
        });

        return () => {
            handlers.forEach(({ el, enter, leave }) => {
                el.removeEventListener('mouseenter', enter);
                el.removeEventListener('mouseleave', leave);
            });
        };
    }, [selector]);
};
