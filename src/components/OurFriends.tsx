import Image from 'next/image';

export default function OurFriends() {
  const friendsData = [
    {
      id: 1,
      name: "HALO",
      handle: "@haloETH",
      avatar: "Avatar 1",
      content: "Bitcoin Hyper is here to supercharge Bitcoin. Built on the Solana Virtual Machine, it brings lightning-fast, low-cost transactions to Bitcoin's ecosystem perfect for payments, meme coins, and powerful dApps.",
      verified: true,
      specialIcon: null
    },
    {
      id: 2,
      name: "JOHN",
      handle: "@johncoin_",
      avatar: "Avatar 2",
      content: "The first ever bitcoin layer 2, bringing scalability and speed. Bitcoin Hyper presale is live, this is a great time to get in early and reap awesome benefits with $HYPER it's now or never, don't miss out.",
      verified: true,
      specialIcon: null
    },
    {
      id: 3,
      name: "FISHER",
      handle: "@worldoffisher",
      avatar: "Avatar 3",
      content: "This isn't just another token — it's a game-changer in the Bitcoin ecosystem. Built for speed, scalability, and massive growth potential, $HYPER is engineered to outperform.",
      verified: true,
      specialIcon: "⭐"
    },
    {
      id: 4,
      name: "CREED",
      handle: "@creed_web3",
      avatar: "Avatar 4",
      content: "Get ready to revolutionize your crypto portfolio. Bitcoin Hyper is a game-changing new project.",
      verified: true,
      specialIcon: "🥊🥊"
    },
    {
      id: 5,
      name: "SNULET",
      handle: "@0xSnulet",
      avatar: "Avatar 5",
      content: "Bitcoin's FIRST true Layer 2 is having a presale—and it's flying. Bitcoin Hyper is unlocking what Bitcoin was always meant to be: Fast. Cheap. Scalable.",
      verified: true,
      specialIcon: "🔴"
    },
    {
      id: 6,
      name: "KEVLAR",
      handle: "@0xKevlar",
      avatar: "Avatar 6",
      content: "This isn't just a presale—it's a Bitcoin revolution. Bitcoin Hyper is launching the first-ever Layer 2 for Bitcoin and it's live right now.",
      verified: true,
      specialIcon: null
    }
  ];

  return (
    <div className="bg-white py-16 relative overflow-hidden">

                 {/* Desktop Graphic */}
         <div className="hidden lg:block absolute bottom-0 right-0 opacity-120 w-48 h-48 transform -translate-x-16 -translate-y-16">
           <Image 
             src="/Group 22.png" 
             alt="Decorative Graphic" 
             width={192} 
             height={192}
             className="w-full h-full object-contain"
             style={{ 
               animation: 'swing 3s ease-in-out infinite',
               transformOrigin: 'center'
             }}
           />
         </div>

         {/* Mobile Graphic */}
         <div className="lg:hidden absolute bottom-0 right-0 opacity-120 w-32 h-32 transform -translate-x-16 -translate-y-16 z-50">
           <Image 
             src="/Group 22.png" 
             alt="Decorative Graphic" 
             width={128} 
             height={128}
             className="w-full h-full object-contain"
             style={{ 
               animation: 'swing 3s ease-in-out infinite',
               transformOrigin: 'center'
             }}
           />
         </div>

         <style jsx>{`
           @keyframes swing {
             0%, 100% { transform: rotate(-6deg); }
             50% { transform: rotate(6deg); }
           }
         `}</style>
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

             {/* Bottom Right Graphic */}
    

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4" style={{ fontFamily: 'baumans' }}>
            OUR FRIENDS
          </h2>
        </div>

        {/* Desktop Layout - 2x3 Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {friendsData.map((friend) => (
            <div key={friend.id} className="bg-[#D6E14E] rounded-lg p-6 border-4 border-[#132a13] relative">
              {/* Close Button */}
              <div className="absolute top-4 right-4 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-white text-sm font-bold">×</span>
              </div>

              {/* Star Pattern Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
                    radial-gradient(circle at 80% 80%, white 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px'
                }}></div>
              </div>

              <div className="relative z-10">
                {/* Avatar and Info */}
                <div className="flex items-center mb-4">
                  {/* Avatar Placeholder */}
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <div className="text-gray-600 text-xs text-center">
                      <div className="font-semibold">AVATAR</div>
                      <div className="text-xs">{friend.avatar}</div>
                    </div>
                  </div>

                  {/* Name and Handle */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black" style={{ fontFamily: 'baumans' }}>
                        {friend.name}
                      </span>
                      {friend.specialIcon && (
                        <span className="text-sm">{friend.specialIcon}</span>
                      )}
                      {friend.verified && (
                        <span className="text-blue-600 text-sm">✓</span>
                      )}
                    </div>
                    <div className="text-gray-700 text-sm">
                      {friend.handle}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-black text-sm leading-relaxed">
                  {friend.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Scrollable Cards */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {friendsData.map((friend) => (
                <div key={friend.id} className="bg-[#D6E14E] rounded-lg p-6 border-4 border-[#132a13] relative w-80 flex-shrink-0">
                  {/* Close Button */}
                  <div className="absolute top-4 right-4 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer">
                    <span className="text-white text-sm font-bold">×</span>
                  </div>

                  {/* Star Pattern Background */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
                        radial-gradient(circle at 80% 80%, white 1px, transparent 1px)
                      `,
                      backgroundSize: '30px 30px'
                    }}></div>
                  </div>

                  <div className="relative z-10">
                    {/* Avatar and Info */}
                    <div className="flex items-center mb-4">
                      {/* Avatar Placeholder */}
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <div className="text-gray-600 text-xs text-center">
                          <div className="font-semibold">AVATAR</div>
                          <div className="text-xs">{friend.avatar}</div>
                        </div>
                      </div>

                      {/* Name and Handle */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black" style={{ fontFamily: 'baumans' }}>
                            {friend.name}
                          </span>
                          {friend.specialIcon && (
                            <span className="text-sm">{friend.specialIcon}</span>
                          )}
                          {friend.verified && (
                            <span className="text-blue-600 text-sm">✓</span>
                          )}
                        </div>
                        <div className="text-gray-700 text-sm">
                          {friend.handle}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-black text-sm leading-relaxed">
                      {friend.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 