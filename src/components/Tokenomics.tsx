import Image from 'next/image';

export default function Tokenomics() {
  const tokenomicsData = [
    {
      id: 1,
      title: "TREASURY",
      percentage: "25%",
      description: "Designated token allocation for business development and community activations."
    },
    {
      id: 2,
      title: "MARKETING",
      percentage: "20%",
      description: "Viral marketing. Paid and organic media. Tier 1 geos. $ZUG is a global crypto phenomenon."
    },
    {
      id: 3,
      title: "REWARDS",
      percentage: "15%",
      description: "Community rewards allocation for staking and token giveaway promotions and events."
    },
    {
      id: 4,
      title: "LISTINGS",
      percentage: "10%",
      description: "Designated token allocation for $ZUG token listings on various exchanges."
    },
    {
      id: 5,
      title: "DEVELOPMENT",
      percentage: "30%",
      description: "Follow our regular Layer 2 development updates on the $ZUG official website."
    }
  ];

     return (
     <div className="bg-gradient-to-t from-[#D6E14E] to-white py-16 relative overflow-hidden">
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
            TOKENOMICS
          </h2>
        </div>

                          {/* Desktop Layout */}
         <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
           {/* Tokenomics Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* First Row - 2 Cards */}
             <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               {tokenomicsData.slice(0, 2).map((item) => (
                 <div key={item.id} className="bg-[#D6E14E] rounded-lg p-6 border-4 border-[#132a13] relative">
                   {/* Decorative Circle */}
                   <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
                  
                   <div className="text-center">
                     <h3 className="text-lg font-bold text-black mb-2" style={{ fontFamily: 'baumans' }}>
                       {item.title}
                     </h3>
                     <div className="text-3xl font-bold text-black mb-3">
                       {item.percentage}
                     </div>
                     <p className="text-sm text-black leading-relaxed">
                       {item.description}
                     </p>
                   </div>
                 </div>
               ))}
             </div>
             
             {/* Second Row - 3 Cards */}
             <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
               {tokenomicsData.slice(2, 5).map((item) => (
                 <div key={item.id} className="bg-[#D6E14E] rounded-lg p-6 border-4 border-[#132a13] relative">
                   {/* Decorative Circle */}
                   <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
                  
                   <div className="text-center">
                     <h3 className="text-lg font-bold text-black mb-2" style={{ fontFamily: 'baumans' }}>
                       {item.title}
                     </h3>
                     <div className="text-3xl font-bold text-black mb-3">
                       {item.percentage}
                     </div>
                     <p className="text-sm text-black leading-relaxed">
                       {item.description}
                     </p>
                   </div>
                 </div>
               ))}
             </div>
            </div>

           {/* Group 4 Image */}
           <div className="flex justify-center lg:justify-end">
             <div className="relative">
               <Image 
                 src="/Group 1.png" 
                 alt="Tokenomics Illustration" 
                 width={400} 
                 height={400}
                 className="rounded-lg"
                 style={{ 
                   animation: 'float 3s ease-in-out infinite',
                   transformOrigin: 'center'
                 }}
               />
               {/* Call to Action */}
               <div className="text-center mt-6">
                 <button className="bg-[#132a13] text-white px-8 py-3 rounded-lg font-bold text-lg mb-4  transition-colors">
                   READ WHITEPAPER
                 </button>
                 <p className="text-black text-sm">
                   Full breakdown of how $ZUG works
                 </p>
               </div>
             </div>
           </div>
         </div>

         {/* Mobile Layout */}
         <div className="lg:hidden">
           {/* Image at top */}
           <div className="flex justify-center mb-8">
             <Image 
               src="/Group 1.png" 
               alt="Tokenomics Illustration" 
               width={300} 
               height={300}
               className="rounded-lg"
               style={{ 
                 animation: 'float 3s ease-in-out infinite',
                 transformOrigin: 'center'
               }}
             />
           </div>

           {/* Scrollable Cards */}
           <div className="overflow-x-auto pb-4 mb-8">
             <div className="flex gap-4" style={{ width: 'max-content' }}>
               {tokenomicsData.map((item) => (
                 <div key={item.id} className="bg-[#D6E14E] rounded-lg p-6 border-4 border-[#132a13] relative w-80 flex-shrink-0">
                   {/* Decorative Circle */}
                   <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
                  
                   <div className="text-center">
                     <h3 className="text-lg font-bold text-black mb-2" style={{ fontFamily: 'baumans' }}>
                       {item.title}
                     </h3>
                     <div className="text-3xl font-bold text-black mb-3">
                       {item.percentage}
                     </div>
                     <p className="text-sm text-black leading-relaxed">
                       {item.description}
                     </p>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Button at bottom */}
           <div className="text-center">
             <button className="bg-[#132a13] text-white px-8 py-3 rounded-lg font-bold text-lg mb-4 ">
               READ WHITEPAPER
             </button>
             <p className="text-black text-sm">
               Full breakdown of how $ZUG works
             </p>
           </div>
         </div>

         <style jsx>{`
           @keyframes float {
             0%, 100% { transform: translateY(-6px); }
             50% { transform: translateY(6px); }
           }
         `}</style>
      </div>
    </div>
  );
} 