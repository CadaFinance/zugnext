import Image from 'next/image';

export default function Footer() {
  return (
    <div className="bg-black py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #D6E14E 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #D6E14E 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          {/* Disclaimer Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'baumans' }}>
              DISCLAIMER
            </h3>
            <p className="text-white text-sm leading-relaxed mb-4">
              ALWAYS DO YOUR OWN RESEARCH. NOTHING HERE IS FINANCIAL ADVICE. THIS IS A MEME COIN
            </p>
            <p className="text-white text-sm">
              2025 $ZUG ALL RIGHTS RESERVED.
            </p>
          </div>

          {/* Links Section */}
         

          {/* Logo Section */}
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-3">
              {/* Logo Image */}
              <Image 
                src="/Group 5195.png" 
                alt="$ZUG Logo" 
                width={48} 
                height={48}
                className="w-12 h-12 object-contain"
              />
              
              {/* Logo Text */}
              <div className="flex items-center">
                <span className="text-white font-bold text-xl" style={{ fontFamily: 'baumans' }}>
                  $ZUG
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 