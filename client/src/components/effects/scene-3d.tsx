import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ count, size, color, speed }: { count: number, size: number, color: string, speed: number }) {
    const ref = useRef<THREE.Points>(null!);
    const { viewport } = useThree();

    const sphere = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 10 * Math.pow(Math.random(), 1 / 3);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, [count]);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / (20 * speed);
            ref.current.rotation.y -= delta / (25 * speed);

            const targetX = (state.mouse.x * viewport.width) / 15;
            const targetY = (state.mouse.y * viewport.height) / 15;

            ref.current.position.x += (targetX - ref.current.position.x) * 0.02;
            ref.current.position.y += (targetY - ref.current.position.y) * 0.02;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={color}
                    size={size}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

function FloatingLight() {
    const light = useRef<THREE.PointLight>(null!);
    const { viewport } = useThree();

    useFrame((state) => {
        const x = (state.mouse.x * viewport.width) / 2;
        const y = (state.mouse.y * viewport.height) / 2;
        light.current.position.set(x, y, 2);
    });

    return <pointLight ref={light} intensity={15} color="#3b82f6" distance={10} />;
}

export function Scene3D() {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none">
            {/* Background color removed to show global mesh gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(67,56,202,0.1),transparent_70%)]" />
            <Canvas
                camera={{ position: [0, 0, 3], fov: 75 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <ParticleField count={3000} size={0.03} color="#4f46e5" speed={1} />
                <ParticleField count={1500} size={0.05} color="#7c3aed" speed={1.5} />
                <ParticleField count={800} size={0.08} color="#6366f1" speed={2} />
                <FloatingLight />
                <ambientLight intensity={0.2} />
            </Canvas>
        </div>
    );
}
