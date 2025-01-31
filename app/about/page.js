import React from 'react';
import Image from 'next/image';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      <div className="grid md:grid-cols-2 gap-10 pt-10 items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            About Our Company
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Founded with a passion for delivering exceptional products and unparalleled customer experience, 
            we are more than just an e-commerce platform – we are your trusted partner in quality and innovation.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To provide high-quality, innovative products that enhance our customers' lives, 
                while maintaining the highest standards of service, integrity, and sustainability.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Our Values</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Customer-First Approach</li>
                <li>Commitment to Quality</li>
                <li>Continuous Innovation</li>
                <li>Ethical and Sustainable Practices</li>
              </ul>
            </div>
          </div>
        </div>
        
    
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Why Choose Us
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Premium Quality",
              description: "We meticulously select and curate products that meet the highest standards."
            },
            {
              title: "Customer Support",
              description: "Our dedicated team is always ready to assist you with personalized support."
            },
            {
              title: "Secure Shopping",
              description: "Shop with confidence using our state-of-the-art security and privacy measures."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;