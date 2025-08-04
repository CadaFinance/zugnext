export default function FeaturedIn() {
    const platforms = [
      {
        name: "Cointelegraph",
        logo: "COINTELEGRAPH"
      },
      {
        name: "CoinMarketCap",
        logo: "CoinMarketCap"
      },
      {
        name: "Bitcoin.com",
        logo: "Bitcoin.com"
      },
      {
        name: "Cryptonews",
        logo: "cryptonews"
      },
      {
        name: "Binance Square",
        logo: "BINANCE SQUARE"
      },
      {
        name: "Bitcoin Magazine",
        logo: "BITCOIN"
        
      },
      {
        name: "99Bitcoins",
        logo: "99BITCOINS"
      }
    ];
  
       return (
       <div className="bg-[#132a13]  py-2 relative overflow-hidden">
         <style jsx>{`
           @keyframes scroll {
             0% { transform: translateX(0); }
             100% { transform: translateX(-50%); }
           }
         `}</style>
         {/* Geometric Pattern Background */}
         <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%),
              linear-gradient(-45deg, #333 25%, transparent 25%, transparent 75%, #333 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px'
          }}></div>
        </div>
  
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          {/* Title */}
          <div className="text-center my-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              FEATURED IN
            </h2>
          </div>
  
                   {/* Platform Names */}
           <div className="hidden lg:flex flex-wrap justify-center items-center mb-4 gap-8 lg:gap-12">
             {platforms.map((platform, index) => (
               <div key={platform.name} className="flex flex-col items-center text-white">
                 {/* Platform Name */}
                                <div className="text-center">
                   <div className="text-sm lg:text-base font-semibold text-white">
                     {platform.logo}
                   </div>
                   
                 </div>
               </div>
             ))}
           </div>
  
                                         {/* Mobile Scrolling Animation */}
             <div className="lg:hidden overflow-hidden">
               <div 
                 className="flex whitespace-nowrap"
                 style={{
                   animation: 'scroll 20s linear infinite',
                   width: 'max-content'
                 }}
               >
                 {[...platforms, ...platforms, ...platforms].map((platform, index) => (
                   <div key={`${platform.name}-${index}`} className="flex-shrink-0 mb-4 px-8 text-white">
                     <div className="text-center">
                       <div className="text-sm font-semibold text-white">
                         {platform.logo}
                       </div>
                       
                     </div>
                   </div>
                 ))}
               </div>
             </div>
        </div>
      </div>
    );
  } 