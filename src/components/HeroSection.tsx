export default function HeroSection() {
  return (
    <div className="bg-white pt-32 white-pattern-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
          {/* Staking Rewards Banner - Overlapping */}
          <div className="absolute -top-2 lg:-top-4 left-1/2 transform -translate-x-1/2 bg-[#FCFA9C] text-black px-3 lg:px-6 py-1 lg:py-2 rounded-lg font-bold text-sm lg:text-2xl shadow-lg z-30">
            164% STAKING REWARDS
          </div>

          {/* Character Image - Bottom Left */}
          <div className="absolute -bottom-10 lg:-bottom-20 -left-5 lg:-left-10 z-20">
            <img 
              src="/Group1.png" 
              alt="ZUG Character" 
              className="w-32 h-32 lg:w-64 lg:h-64 object-contain" 
              style={{ 
                animation: 'swing 3s ease-in-out infinite',
                transformOrigin: 'center'
              }}
            />
          </div>

          <div className="text-center relative z-10 pt-4">
            <h1 className="text-3xl font-bold tracking-tight text-black sm:text-5xl ">
              THE FASTEST ETHEREUM LAYER 2 CHAIN
            </h1>
            <p className="text-lg text-black font-medium ">
              SCALABILITY AND SPEED FOR ETHEREUM ARE FINALLY HERE
            </p>
            <div className="flex justify-center pt-4">
              <button className="bg-[#132a13] text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-800 transition-colors animate-pulse">
                PRESALE IS LIVE
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes swing {
            0%, 100% { transform: rotate(-6deg); }
            50% { transform: rotate(6deg); }
          }
        `}</style>
      </div>
    </div>
  )
} 