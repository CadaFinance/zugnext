export default function FeaturedIn() {
    const platforms = [
      {
        name: "Ecosystem 1",
        logo: "ECOSYSTEM 1",
        logoImage: "/ecosystem_1.svg"
      },
      {
        name: "Ecosystem 2",
        logo: "ECOSYSTEM 2",
        logoImage: "/ecosystem_2.svg"
      },
      {
        name: "Ecosystem 4",
        logo: "ECOSYSTEM 4",
        logoImage: "/ecosystem_4.svg"
      },
      {
        name: "Ecosystem 5",
        logo: "ECOSYSTEM 5",
        logoImage: "/ecosystem_5.svg"
      },
      {
        name: "Ecosystem 6",
        logo: "ECOSYSTEM 6",
        logoImage: "/ecosystem_6.svg"
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
         <div className="absolute inset-0 opacity-80">
          <div className="absolute inset-0" style={{
            backgroundColor: '#000',
            backgroundImage: 'repeating-linear-gradient(45deg, #1f1f1f 0, #1f1f1f 1px, #000 0, #000 50%)',
            backgroundSize: '10px 10px'
          }}></div>
        </div>
  
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          {/* Title */}
          <div className="text-center my-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              POWERED BY
            </h2>
          </div>
  
                   {/* Platform Names */}
           <div className="hidden lg:flex flex-wrap justify-center items-center mb-4 gap-8 lg:gap-12">
             {platforms.map((platform, index) => (
               <div key={platform.name} className="flex flex-col items-center text-white">
                 {/* Platform Name */}
                                <div className="text-center">
                   {platform.logoImage ? (
                     <img 
                       src={platform.logoImage} 
                       alt={platform.name}
                       className="h-16 lg:h-20 object-contain"
                     />
                   ) : (
                     <div className="text-sm lg:text-base font-semibold text-white">
                       {platform.logo}
                     </div>
                   )}
                   
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
                       {platform.logoImage ? (
                         <img 
                           src={platform.logoImage} 
                           alt={platform.name}
                           className="h-14 object-contain"
                         />
                       ) : (
                         <div className="text-sm font-semibold text-white">
                           {platform.logo}
                         </div>
                       )}
                       
                     </div>
                   </div>
                 ))}
               </div>
             </div>
        </div>
      </div>
    );
  } 