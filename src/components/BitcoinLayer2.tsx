import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function BitcoinLayer2() {
     const steps = [
     {
       id: 1,
       title: "BRIDGE",
       description: "Users deposit ETH to a Ethereum address monitored by $ZUG's Canonical Bridge. EthereumRelay Program (an SVM smart contract) validates Ethereumblock headers and transaction proofs. Upon successful validation, equivalent ETH is securely minted on $ZUG's Layer 2.",
       color: "bg-gray-100 border-2 border-dashed border-gray-400"
     },
     {
       id: 2,
       title: "L2 OPERATION",
       description: "Users can send and receive ETH on $ZUG's Layer 2 with near-instant finality. Complex DeFi operations like staking and decentralized exchanges are supported. Solana's Virtual Machine (SVM) is used for high throughput and scalability.",
       color: "bg-[#f2f6c9]"
     }, 
     {
       id: 3,
       title: "SETTLEMENT & SECURITY",
       description: "$ZUG batches and compresses Layer 2 transactions. Zero-knowledge (ZK) proofs are used to ensure transaction validity. Layer 2 state is periodically committed to Ethereum's Layer 1 for synchronization and security.",
       color: "bg-[#e2ea83]"
     },
     {
       id: 4,
       title: "WITHDRAWAL TO L1",
       description: "Users initiate a withdrawal request from $ZUG's Layer 2. The system validates the Layer 2 state and creates a proof for the canonical bridge. Upon validation, the corresponding ETH is sent back to the user's Layer 1 Ethereum address.",
       color: "bg-[#dae45f] "
     }
   ];

  const frameworks = [ 
    { name: "Lightning Network", logo: "⚡", description: "Speed" },
    { name: "Optimism", logo: "OPTIMISM", description: "Optimistic Rollups" },
    { name: "ZK-Rollups", logo: "zkROLLUPS", description: "ZK-Rollups" },
    { name: "Rootstock", logo: "🌳", description: "Sidechains" },
    { name: "$ZUG", logo: "$ZUG", description: "Scalability" }
  ];

  return (
    <div className="bg-white py-16 white-pattern-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
            ETHEREUM LAYER 2
          </h2>
        </div>

                 {/* Process Flow Steps */}
         <div className="mb-16">
                       {/* Desktop Layout */}
            <div className="hidden lg:flex flex-row gap-6 lg:gap-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex-1">
                                     <div className={`${step.color} rounded-xl p-6 min-h-[300px] relative`}>
                    {/* Title */}
                    <h3 className="text-xl font-bold text-black mb-4">
                      {step.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Arrow (except last step) */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-1/2 -right-7 transform -translate-y-1/2">
                        <ArrowRightIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                 </div>
               </div>
             ))}
           </div>

           {/* Mobile Scrollable Layout */}
           <div className="lg:hidden overflow-x-auto">
             <div className="flex gap-6 min-w-max px-4">
                               {steps.map((step, index) => (
                  <div key={step.id} className="w-80 flex-shrink-0">
                                         <div className={`${step.color} rounded-xl p-6 min-h-[300px] relative`}>
                      {/* Title */}
                      <h3 className="text-xl font-bold text-black mb-4">
                        {step.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {step.description}
                      </p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>

        {/* Read Whitepaper Button */}
        <div className="text-center -mb-10">
          <button className="bg-[#D6E14E]  text-black px-8 py-3 rounded-lg font-semibold transition-colors">
            READ WHITEPAPER
          </button>
          <p className="text-gray-600 mt-2 text-sm">
            Full breakdown of how $ZUG works
          </p>
        </div>

       
       

        {/* HeroSection Clone */}
        <div className="bg-white pt-24 white-pattern-bg">
          <div className="mx-auto max-w-7xl ">
            {/* Main Hero Banner */}
            <div 
              className="rounded-2xl shadow-2xl p-6 sm:p-8 relative"
              style={{
                backgroundColor: '#D6E14E',
                backgroundImage: `
                  linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%),
                  linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)
                `,
                backgroundSize: '30px 30px, 30px 30px',
                backgroundPosition: '0 0, 15px 15px'
              }}
            >
            

              {/* Character Image - Bottom Left */}
              <div className="absolute -bottom-8 lg:-bottom-20 left-0 z-20">
                <img src="/Group 3.png" alt="ZUG Character" className="w-32 h-32 lg:w-90 lg:h-90 object-contain transform   transition-transform duration-300" />
              </div>

              <div className="text-center relative z-10 pt-4">
                <h1 className="text-3xl font-bold tracking-tight text-black sm:text-5xl ">
                $ZUG Token Presale
                </h1>
                <p className="text-lg text-black font-medium ">
                A Secure and Innovative Layer 2 Solution                </p>
                <div className="flex justify-center pt-4">
                  <button className="bg-[#FCFA9C] text-black px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-800 transition-colors">
                    PRESALE IS LIVE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Buy Section */}
        <div className=" py-16 ">
          <div className="mx-auto max-w-7xl ">
            {/* Main Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
                HOW TO BUY $ZUG TOKEN
              </h2>
            </div>
 
            {/* Steps */}
            <div className="mb-12">
              {/* Desktop Layout */}
              <div className="hidden lg:grid grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="bg-[#d6e14e]  rounded-xl p-6 relative" style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,165,0,0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}>
                  <div className="absolute top-4 right-4 w-6 h-6  rounded-full"></div>
                  <h3 className="text-xl font-bold text-black mb-3">STEP 1</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Get some crypto from your preferred exchange. If you don&apos;t yet have a wallet, consider using Trust Wallet or MetaMask. Then visit the $ZUG official website.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-[#e2ea83] rounded-xl p-6 relative" style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,165,0,0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}>
                  <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full"></div>
                  <h3 className="text-xl font-bold text-black mb-3">STEP 2</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Now you&apos;re ready to participate in the $ZUG crypto presale. Click any Buy or Connect Wallet buttons on the $ZUG website to start.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-[#eef3b8] rounded-xl p-6 relative" style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,165,0,0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}>
                  <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full"></div>
                  <h3 className="text-xl font-bold text-black mb-3">STEP 3</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Choose the amount of $ZUG you want to buy and confirm the transaction in your wallet. To stake at the same time, select the Buy and Stake option.
                  </p>
                </div>
              </div>

              {/* Mobile Scrollable Layout */}
              <div className="lg:hidden overflow-x-auto">
                <div className="flex gap-4" style={{ width: 'max-content' }}>
                  {/* Step 1 */}
                  <div className="w-80 flex-shrink-0">
                    <div className="bg-[#d6e14e] rounded-xl p-6 relative h-auto min-h-[200px]" style={{
                      backgroundImage: `radial-gradient(circle, rgba(255,165,0,0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}>
                      <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full"></div>
                      <h3 className="text-xl font-bold text-black mb-3">STEP 1</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Get some crypto from your preferred exchange. If you don&apos;t yet have a wallet, consider using Trust Wallet or MetaMask. Then visit the $ZUG official website.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="w-80 flex-shrink-0">
                    <div className="bg-[#e2ea83] rounded-xl p-6 relative h-auto min-h-[200px]" style={{
                      backgroundImage: `radial-gradient(circle, rgba(255,165,0,0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}>
                      <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full"></div>
                      <h3 className="text-xl font-bold text-black mb-3">STEP 2</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Now you&apos;re ready to participate in the $ZUG crypto presale. Click any Buy or Connect Wallet buttons on the $ZUG website to start.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="w-80 flex-shrink-0">
                    <div className="bg-[#eef3b8] rounded-xl p-6 relative h-auto min-h-[200px]" style={{
                      backgroundImage: `radial-gradient(circle, rgba(255,165,0,0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}>
                      <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full"></div>
                      <h3 className="text-xl font-bold text-black mb-3">STEP 3</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Choose the amount of $ZUG you want to buy and confirm the transaction in your wallet. To stake at the same time, select the Buy and Stake option.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button className="bg-[#D6E14E] text-black px-8 py-3 rounded-lg font-bold text-base hover:bg-orange-600 transition-colors">
                BUY WITH CARD
              </button>
            
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
} 