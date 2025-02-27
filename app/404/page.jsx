// pages/404.js

import Link from "next/link";
import { motion } from "framer-motion";
export default function Custom404() {
// Animation variants for container
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
    opacity: 1,
    transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.3
    }
    }
};

// Animation variants for children
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
    }
};

return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
    <motion.div 
        className="text-center p-6 bg-white shadow-lg rounded-lg"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <motion.h1 
        className="text-6xl font-bold text-red-500"
        variants={itemVariants}
        whileHover={{ 
            scale: 1.1, 
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 }
        }}
        >
        404
        </motion.h1>
        <motion.h2 
        className="text-2xl mt-2 text-gray-700"
        variants={itemVariants}
        >
        Page Not Found
        </motion.h2>
        <motion.p 
        className="mt-4 text-gray-500"
        variants={itemVariants}
        >
        Sorry, the page you're looking for doesn't exist.
        </motion.p>
        <Link href="/">
        <motion.h1 
            className="mt-6 inline-block text-blue-500"
            variants={itemVariants}
            whileHover={{ 
            scale: 1.05, 
            color: "#2563EB",
            textDecoration: "underline" 
            }}
        >
            Go back to Home
        </motion.h1>
        </Link>
    </motion.div>
    </div>
  );
}
