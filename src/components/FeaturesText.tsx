import { CloudArrowUpIcon, LockClosedIcon, ServerIcon, WalletIcon, ArrowPathIcon, MagnifyingGlassIcon, CurrencyDollarIcon } from '@heroicons/react/20/solid'

// Custom SVG Icons
const StakingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 lg:w-8 lg:h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
  </svg>
);

const ExplorerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 lg:w-8 lg:h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const BridgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 lg:w-8 lg:h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
  </svg>
);

const features = [
  {
    name: 'Push to deploy.',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'SSL certificates.',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: LockClosedIcon,
  },
  {
    name: 'Database backups.',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ServerIcon,
  },
]

const ecosystemItems = [
  {
    name: "WALLET",
    icon: WalletIcon,
    description: "Secure wallet integration",
    isHeroIcon: true
  },
  {
    name: "EXPLORER", 
    icon: ExplorerIcon,
    description: "Block explorer functionality",
    isCustomIcon: true
  },
  {
    name: "BRIDGE",
    icon: BridgeIcon,
    description: "Cross-chain bridging",
    isCustomIcon: true
  },
  {
    name: "STAKING",
    icon: StakingIcon,
    description: "Staking rewards system",
    isCustomIcon: true
  },
  {
    name: "MEMES",
    icon: "/Mask group.png",
    description: "Meme coin ecosystem",
    isImage: true
  }
];

export default function FeaturesText() {
  return (
    <div className="lg:pt-4 lg:pr-8">
      <div className="lg:min-w-2xl">
      
        <p className="mt-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
        Buy $ZUG before it powers the fastest layer in Ethereum history.         </p>
        <div className="mt-6 text-lg/8 text-gray-700 space-y-4">
          <p>
          $ZUG finally unlocks fast and cheap Ethereum transactions.
          </p>
          <p>
            This unleashes the true power of Ethereum. <strong>Payments. Meme Coins. dApps.</strong>
          </p>
          <p>
            2025 will be remembered as the year $ZUG changed everything.
          </p> 
          <p className="font-bold text-[#254657]  border-b-2 border-[#D6E14E]  pb-1">
            $ZUG. Building Ethereum's Future.
          </p>
        </div>
      </div>

      {/* Hyper Ecosystem Section - Full Width */}
      <div className="mt-6 lg:mt-8">
        <h3 className="text-2xl lg:text-3xl font-bold text-[#254657] mb-8 text-center" style={{
          textShadow: '2px 2px 0px #D6E14E, -2px -2px 0px #D6E14E, 2px -2px 0px #D6E14E, -2px 2px 0px #D6E14E'
        }}>
          THE $ZUG ECOSYSTEM
        </h3>
        
        {/* Ecosystem Items - Full Width Container */}
        <div className="w-full">
          <div className="flex flex-row items-center justify-center gap-4 lg:gap-8">
            {ecosystemItems.map((item, index) => (
              <div key={item.name} className="flex flex-col items-center flex-shrink-0">
                {/* Circle */}
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border-2 border-[#254657] bg-gradient-to-br from-[#FCFA9C] to-[#D6E14E] flex items-center justify-center mb-2 relative">
                  {item.isImage ? (
                    <img 
                      src={item.icon as string} 
                      alt={item.name} 
                      className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                    />
                  ) : item.isHeroIcon ? (
                    <item.icon className="w-6 h-6 lg:w-7 lg:h-7 text-[#254657]" />
                  ) : item.isCustomIcon ? (
                    <div className="text-[#254657]">
                      <item.icon />
                    </div>
                  ) : (
                    <span className="text-lg lg:text-2xl">{item.icon as string}</span>
                  )}
                  
                  {/* Dashed line connector (except for last item) */}
                  {index < ecosystemItems.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-0.5 bg-[#254657]" style={{
                      backgroundImage: 'repeating-linear-gradient(to right, #254657 0, #254657 3px, transparent 3px, transparent 6px)'
                    }}></div>
                  )}
                </div>
                
                {/* Label */}
                <span className="text-xs lg:text-sm font-bold text-[#254657] uppercase text-center">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 