import Image from 'next/image';

export default function FAQ() {
  const faqData = [
    {
      id: 1,
      question: "WHAT IS $ZUG?",
      answer: "$ZUG is the native token of the fastest Layer 2 solution on Ethereum, enabling lightning-fast transactions, staking, and DeFi applications. It's the key to unlocking Ethereum's true potential."
    },
    {
      id: 2,
      question: "WHY IS $ZUG IMPORTANT?",
      answer: "$ZUG solves Ethereum's scalability issues by providing near-instant transactions with minimal fees while maintaining Ethereum-grade security. It enables the future of decentralized finance."
    },
    {
      id: 3,
      question: "HOW DO I BUY $ZUG?",
      answer: "Connect your wallet to our platform, select your preferred payment method (crypto or card), choose your $ZUG amount, and complete the transaction. It's that simple."
    },
    {
      id: 4,
      question: "WHEN DOES THE PRESALE END?",
      answer: "The $ZUG presale is limited and may end early based on demand. Follow our official channels for real-time updates on availability and pricing."
    },
    {
      id: 5,
      question: "WHAT MAKES $ZUG DIFFERENT?",
      answer: "$ZUG is built on cutting-edge Layer 2 technology that processes thousands of transactions per second while maintaining full Ethereum security and compatibility."
    },
    {
      id: 6,
      question: "CAN I STAKE $ZUG?",
      answer: "Yes! $ZUG holders can stake their tokens to earn rewards and participate in network governance. Staking helps secure the network and provides passive income."
    },
    {
      id: 7,
      question: "IS $ZUG SECURE?",
      answer: "Absolutely. $ZUG leverages Ethereum's battle-tested security while adding Layer 2 speed. All transactions are cryptographically verified and secured by the Ethereum network."
    },
    {
      id: 8,
      question: "WHAT'S THE TOKENOMICS?",
      answer: "$ZUG has a carefully designed tokenomics structure with allocations for development, marketing, community rewards, and ecosystem growth. See our whitepaper for full details."
    }
  ];

  return (
    <div className="bg-white py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #132a13 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #132a13 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      

      <div className="relative z-10 mx-auto max-w-7xl px-2 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4" style={{ fontFamily: 'baumans' }}>
            $ZUG FAQ
          </h2>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Character Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <Image 
                src="/Group 4.png" 
                alt="$ZUG Character" 
                width={400} 
                height={400}
                className="rounded-lg"
                style={{ 
                  animation: 'float 3s ease-in-out infinite',
                  transformOrigin: 'center'
                }}
              />
            </div>
          </div>

          {/* Right Side - FAQ Cards */}
          <div className="space-y-4">
            {faqData.map((item) => (
              <div key={item.id} className="bg-[#D6E14E] rounded-lg p-6 border-4 border-[#132a13] relative">
                {/* Decorative Circle */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#132a13] text-sm font-bold">?</span>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-black mb-3" style={{ fontFamily: 'baumans' }}>
                    {item.question}
                  </h3>
                  <p className="text-sm text-black leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* FAQ Cards */}
          <div className="space-y-4 mb-8">
            {faqData.map((item) => (
              <div key={item.id} className="bg-[#D6E14E] rounded-lg p-6 border-4 border-[#132a13] relative">
                {/* Decorative Circle */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#132a13] text-sm font-bold">?</span>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-black mb-3" style={{ fontFamily: 'baumans' }}>
                    {item.question}
                  </h3>
                  <p className="text-sm text-black leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Character Image at bottom */}
          <div className="flex justify-center">
            <Image 
              src="/Group 4.png" 
              alt="$ZUG Character" 
              width={300} 
              height={300}
              className="rounded-lg"
              style={{ 
                animation: 'float 3s ease-in-out infinite',
                transformOrigin: 'center'
              }}
            />
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(-6px); }
            50% { transform: translateY(6px); }
          }
          @keyframes swing {
            0%, 100% { transform: rotate(-6deg); }
            50% { transform: rotate(6deg); }
          }
        `}</style>
      </div>
    </div>
  );
} 