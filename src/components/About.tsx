import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, Award } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Precision Engineering',
      description: 'Converting your sketches with engineering precision and attention to detail.',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Professional designers and engineers with years of 3D modeling experience.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation Focus',
      description: 'Bringing innovative ideas to life through cutting-edge technology.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Rigorous quality checks ensure your prototypes meet industry standards.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Transforming Ideas into Reality
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-mono">
            We specialize in bridging the gap between imagination and creation, 
            transforming your 2D concepts into tangible 3D prototypes with 
            precision and innovation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors duration-200">
                <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-mono">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;