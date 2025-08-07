export default function HeroSection() {
  return (
    <div className="bg-white pt-32 white-pattern-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
         

       
          <div className="text-center relative z-10 pt-4">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-black">
              THE FASTEST ETHEREUM LAYER 2 CHAIN
            </h1>
            <p className="text-base sm:text-lg text-black font-medium">
              SCALABILITY AND SPEED FOR ETHEREUM ARE FINALLY HERE
            </p>
            <div className="flex justify-center pt-4">
              <button className="bg-[#132a13] text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-black transition-colors duration-300 animate-scale">
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
          
          @keyframes scale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          .animate-scale {
            animation: scale 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  )
} 