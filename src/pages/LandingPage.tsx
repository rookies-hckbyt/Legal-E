import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  Shield, 
  Brain, 
  ArrowRight, 
  Users,
  MessageSquare,
  Clock,
  Lock
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Legal Analysis",
      description: "Advanced machine learning algorithms provide instant legal insights and case analysis"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Document Management",
      description: "Bank-grade encryption for all your sensitive legal documents"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description: "Seamless communication between clients, lawyers, and legal staff"
    }
  ];

  const statistics = [
    { value: "98%", label: "Success Rate" },
    { value: "50K+", label: "Cases Handled" },
    { value: "24/7", label: "Support" },
    { value: "100+", label: "Legal Experts" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 pt-20 pb-32"
        >
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-primary/10 p-3 rounded-full mb-6"
            >
              <Scale className="w-10 h-10 text-primary" />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Legal Innovation Meets Artificial Intelligence
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Transform your legal practice with cutting-edge AI technology. 
              Streamline workflows, enhance decision-making, and deliver superior legal services.
            </motion.p>
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button className="btn btn-primary px-8 py-3 rounded-full flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button className="btn btn-outline px-8 py-3 rounded-full">
                Watch Demo
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight 
              }}
              animate={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight 
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Choose Legal AI?</h2>
              <div className="space-y-4">
                {[
                  { icon: <Clock />, text: "Save up to 70% of your time on legal research" },
                  { icon: <Shield />, text: "Enterprise-grade security for your data" },
                  { icon: <Users />, text: "Collaborate seamlessly with your team" },
                  { icon: <Lock />, text: "GDPR and HIPAA compliant" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-primary">{item.icon}</div>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div 
              className="relative h-[400px]"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl overflow-hidden">
                {/* Add your image or animation here */}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Legal Practice?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of legal professionals who are already using Legal AI to streamline their practice.
            </p>
            <button className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-full">
              Start Free Trial
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Scale className="w-10 h-10 text-primary mb-4" />
              <p className="text-gray-400">Empowering legal professionals with next-generation AI technology.</p>
            </div>
            {['Product', 'Company', 'Resources', 'Legal'].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{section}</h3>
                <ul className="space-y-2 text-gray-400">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className="hover:text-primary cursor-pointer">
                      {section} Link {i + 1}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            © 2024 Legal-E. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;