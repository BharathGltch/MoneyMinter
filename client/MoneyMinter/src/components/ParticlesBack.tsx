import { useEffect, useState } from "react";
import ParticlesComponent, { initParticlesEngine } from "@tsparticles/react"; // Importing it as ParticlesComponent to avoid name collision with the function
import { loadSlim } from "@tsparticles/slim";
import { Engine } from "@tsparticles/engine";

const ParticlesBack = () => {
    const [init, setInit] = useState(false);

    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
            // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
            // starting from v2 you can add only the features you need reducing the bundle size
            //await loadAll(engine);
            //await loadFull(engine);
            await loadSlim(engine);
            //await loadBasic(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    return (
        <>
            {init && (
                <ParticlesComponent
                    id="tsparticles"
                    options={{
                        background: {
                            color: {
                                value: "#000000",
                            },
                        },
                        fpsLimit: 120,
                        interactivity: {
                            events: {
                                // onClick: {
                                //     enable: true,
                                //     mode: "push",
                                // },
                                onHover: {
                                    enable: true,
                                    mode: "repulse",
                                },
                                
                            },
                            modes: {
                                push: {
                                    quantity: 1,
                                },
                                repulse: {
                                    distance: 200,
                                    duration: 0.4,
                                },
                            },
                        },
                        particles: {
                            color: {
                                value: "#ffffff",
                            },
                            links: {
                                color: "#ffffff",
                                distance: 150,
                                enable: true,
                                opacity: 0.5,
                                width: 1,
                            },
                            move: {
                                direction: "none",
                                enable: true,
                                outModes: {
                                    default: "bounce",
                                },
                                random: false,
                                speed: 3,
                                straight: false,
                            },
                            number: {
                                density: {
                                    enable: true,
                                    
                                },
                                value: 80,
                            },
                            opacity: {
                                value: 0.6,
                            },
                            shape: {
                                type: "circle",
                            },
                            size: {
                                value: { min: 1, max: 5 },
                            },
                        },
                        detectRetina: true,
                    }}
                />
            )}
        </>
    );
};

export default ParticlesBack;
