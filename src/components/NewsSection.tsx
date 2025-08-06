export default function NewsSection() {
  const newsItems = [
    {
      id: 1,
      headline: "WHY $ZUG IS THE CRYPTO TO WATCH IN BLOCKCHAIN INTEROPERABILITY - PRESALE NOW LIVE",
      description: "Ever tried sending Ethereum only to wait forever and pay crazy fees? You're not alone. However, today, we might have an answer for all of that.",
      logo: "cryptonews",
      imagePlaceholder: "News Image 1"
    },
    {
      id: 2,
      headline: "ZUG'S VISION FOR FASTER ETH LAYER 2 TRANSACTIONS - TOP PRESALE TO INVEST IN NOW?",
      description: "Ethereum is the original smart contract platform that started it all, the one even your grandma has probably heard of. But let's be honest - it's got some issues. Try sending ETH today and you'll see.",
      logo: "the Cryptonomist",
      imagePlaceholder: "News Image 2"
    },
    {
      id: 3,
      headline: "HOW ZUG IS MAKING ETH LAYER 2 FASTER AND CHEAPER, PRESALE ONGOING",
      description: "Ethereum isn't perfect. Those slow transactions and hefty fees? Total pain points. That's where ZUG jumps in.",
      logo: "inside bitcoins",
      imagePlaceholder: "News Image 3"
    },
    {
      id: 4,
      headline: "FIDELITY CALLS IT: ETH LAYER 2 COULD FLIP GOLD'S DOMINANCE ANY DAY NOW",
      description: "Ethereum Layer 2 is gearing up to outshine gold as Fidelity's latest analysis highlights a pivotal shift in performance momentum, signaling a new era for digital store-of-value dominance.",
      logo: "Bitcoin.com",
      imagePlaceholder: "News Image 4"
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
            IN THE NEWS
          </h2>
        </div>

                 {/* News Cards */}
                   <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-xl border-4 border-[#132a13]">
                {/* Image */}
                <div className="h-48 bg-gray-200 flex items-center justify-center border-b-2 border-[#132a13] overflow-hidden">
                  <img
                    src={item.id === 1 ? "/GPT_Image_1_Place_this_uploaded_character_in_the_center_of_the_0.png" : 
                         item.id === 2 ? "/GPT_Image_1_Use_the_uploaded_PNG_character_as_the_main_focus_c_0.png" : 
                         item.id === 3 ? "/Hiring training.png" : "/Fall illustration.png"}
                    alt={item.id === 1 ? "Character illustration" : 
                         item.id === 2 ? "Main focus character" : 
                         item.id === 3 ? "Hiring training illustration" : "Fall illustration"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

               {/* Content */}
               <div className="p-6">
                 {/* Headline */}
                 <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight" style={{ fontFamily: 'baumans' }}>
                   {item.headline}
                 </h3>

                 {/* Description */}
                 <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                   {item.description}
                 </p>

                 {/* Logo */}
                 <div className="flex items-center justify-between">
                   <div className="text-xs font-semibold text-gray-800 uppercase">
                     {item.logo}
                   </div>
                  
                 </div>
               </div>
             </div>
           ))}
         </div>

         {/* Mobile Scrolling Cards */}
         <div className="md:hidden overflow-x-auto pb-4">
           <div className="flex gap-4" style={{ width: 'max-content' }}>
             {newsItems.map((item) => (
               <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-xl border-4 border-[#132a13] w-80 flex-shrink-0">
                                                                      {/* Image */}
                                   <div className="h-48 bg-gray-200 flex items-center justify-center border-b-2 border-[#132a13] overflow-hidden">
                                     <img
                                       src={item.id === 1 ? "/GPT_Image_1_Place_this_uploaded_character_in_the_center_of_the_0.png" : 
                                            item.id === 2 ? "/GPT_Image_1_Use_the_uploaded_PNG_character_as_the_main_focus_c_0.png" : 
                                            item.id === 3 ? "/Hiring training.png" : "/Fall illustration.png"}
                                       alt={item.id === 1 ? "Character illustration" : 
                                            item.id === 2 ? "Main focus character" : 
                                            item.id === 3 ? "Hiring training illustration" : "Fall illustration"}
                                       className="w-full h-full object-cover"
                                       loading="lazy"
                                       decoding="async"
                                     />
                                   </div>

                 {/* Content */}
                 <div className="p-6">
                   {/* Headline */}
                   <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight" style={{ fontFamily: 'monospace' }}>
                     {item.headline}
                   </h3>

                   {/* Description */}
                   <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                     {item.description}
                   </p>

                   {/* Logo */}
                   <div className="flex items-center justify-between">
                     <div className="text-xs font-semibold text-gray-800 uppercase">
                       {item.logo}
                     </div>
                    
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