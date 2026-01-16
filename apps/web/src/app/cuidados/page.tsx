'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CarePage() {
    return (
        <div className="bg-zinc-50 min-h-screen">
            {/* Hero Title */}
            <section className="py-20 md:py-32 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-zinc-900 mb-6"
                    >
                        Guía de Cuidados
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-sans text-zinc-600 text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        Para garantizar la longevidad de nuestros productos y el bienestar de tus compañeros de cuatro patas.
                    </motion.p>
                </div>
            </section>

            {/* Leather Care Section */}
            <section className="py-16 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-square lg:aspect-[4/5] overflow-hidden rounded-lg shadow-xl"
                    >
                        <Image
                            src="/leather-care.png"
                            alt="Textura de cuero premium"
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <h2 className="font-display text-3xl md:text-4xl text-zinc-900">Cuidados del Cuero</h2>
                        <div className="space-y-6 font-sans text-zinc-700 leading-relaxed">
                            <p>
                                El cuero genuino es un material noble y orgánico que evoluciona con el tiempo. Para mantener su belleza y resistencia, sigue estos consejos:
                            </p>

                            <div className="space-y-4">
                                <h3 className="font-display text-xl text-zinc-900">1. Hidratación</h3>
                                <p className="text-sm md:text-base">
                                    Al igual que nuestra piel, el cuero necesita hidratación. Aplica un bálsamo o crema específica para cueros cada 2-3 meses para evitar grietas y mantener su flexibilidad natural.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-display text-xl text-zinc-900">2. Limpieza</h3>
                                <p className="text-sm md:text-base">
                                    Limpia el polvo regularmente con un paño seco y suave. Si se moja, déjalo secar naturalmente a la sombra, nunca cerca de fuentes de calor directo como estufas o sol intenso, ya que esto puede endurecerlo.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-display text-xl text-zinc-900">3. Almacenamiento</h3>
                                <p className="text-sm md:text-base">
                                    Cuando no lo uses, guárdalo en un lugar fresco y seco. Evita bolsas de plástico que no permitan la ventilación; prefiere fundas de tela.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Animal Care Section */}
            <section className="py-16 px-6 bg-zinc-100 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center lg:flex-row-reverse">
                    {/* Content First on Mobile, Image Second? No, sticking to alternating logic usually looks good but let's see. 
                        User asked for split. Let's put image on right for this section to alternate. */}

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8 lg:order-1"
                    >
                        <h2 className="font-display text-3xl md:text-4xl text-zinc-900">Cuidados Animal</h2>
                        <div className="space-y-6 font-sans text-zinc-700 leading-relaxed">
                            <p>
                                El bienestar va más allá de un buen paseo. Una tenencia responsable implica comprender las necesidades físicas y emocionales de tu compañero.
                            </p>

                            <div className="space-y-4 border-l-2 border-coffee/30 pl-6">
                                <h3 className="font-display text-2xl text-coffee">Perros</h3>
                                <p className="text-sm md:text-base font-semibold">Básicos</p>
                                <p className="text-sm md:text-base">
                                    Asegura paseos diarios de calidad (olfateo, exploración) y no solo ejercicio físico. La alimentación balanceada y visitas veterinarias anuales son la base de su salud.
                                </p>
                                <p className="text-sm md:text-base font-semibold pt-2">Conducta y Refuerzo Positivo</p>
                                <p className="text-sm md:text-base">
                                    Las "malas conductas" suelen ser falta de entendimiento o necesidades no cubiertas. Usa el <strong>Refuerzo Positivo</strong>: premia las conductas deseadas en lugar de castigar las indeseadas. La paciencia, la consistencia y el tiempo de calidad son las herramientas más poderosas para construir un vínculo sano.
                                </p>
                            </div>

                            <div className="space-y-4 border-l-2 border-zinc-400 pl-6">
                                <h3 className="font-display text-2xl text-zinc-600">Gatos</h3>
                                <p className="text-sm md:text-base font-semibold">Básicos</p>
                                <p className="text-sm md:text-base">
                                    El enriquecimiento ambiental es clave ("gatificación"): rascadores, alturas y escondites. Mantén su bandeja sanitaria siempre limpia y agua fresca en varios puntos de la casa.
                                </p>
                                <p className="text-sm md:text-base font-semibold pt-2">Convivencia</p>
                                <p className="text-sm md:text-base">
                                    Respeta sus tiempos y espacio. El juego interactivo diario simula la caza y reduce el estrés. Al igual que con los perros, premia la calma y el uso correcto de sus rascadores.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-square lg:aspect-[4/5] overflow-hidden rounded-lg shadow-xl lg:order-2"
                    >
                        <Image
                            src="/animal-care.png"
                            alt="Perro y gato descansando juntos"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
