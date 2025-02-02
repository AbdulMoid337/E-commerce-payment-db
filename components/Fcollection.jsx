import React from 'react'
import { FaTruck, FaShieldAlt, FaHeadset, FaUndo } from 'react-icons/fa'

const Fcollection = () => {
  const features = [
    {
      icon: <FaTruck className="text-4xl text-blue-600" />,
      title: 'Free Shipping',
      description: 'Free shipping on all orders over $100'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-green-600" />,
      title: 'Secure Payment',
      description: 'All transactions are secure and encrypted'
    },
    {
      icon: <FaHeadset className="text-4xl text-purple-600" />,
      title: '24/7 Support',
      description: 'Our support team is always ready to help'
    },
    {
      icon: <FaUndo className="text-4xl text-orange-600" />,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy'
    }
  ]

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Fcollection