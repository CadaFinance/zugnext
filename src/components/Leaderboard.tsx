'use client'

import Image from 'next/image';

interface LeaderboardEntry {
  rank: string;
  user: string;
  handle: string;
  points: string;
  usda: string;
  isCurrentUser?: boolean;
  profileImage?: string;
}

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: "#1587",
    user: "Bblip Protocol",
    handle: "@BblipProtocol",
    points: "600",
    usda: "1.5",
    isCurrentUser: true,
    profileImage: "/profile-bblip.png"
  },
  {
    rank: "#1",
    user: "小刷子",
    handle: "@Oxbrush_bots",
    points: "1,749,650",
    usda: "5,014.85",
    profileImage: "/profile-boy.png"
  },
  {
    rank: "#2",
    user: "moli (焦虑版)",
    handle: "@Oxmoernon",
    points: "1,685,200",
    usda: "4,895.45",
    profileImage: "/profile-moli.png"
  },
  {
    rank: "#3",
    user: "ADD+",
    handle: "@add_infofi",
    points: "1,530,200",
    usda: "4,605.91",
    profileImage: "/profile-add.png"
  },
  {
    rank: "#4",
    user: "Nazim",
    handle: "@shahrianazim6",
    points: "1,448,250",
    usda: "4,451.36",
    profileImage: "/profile-nazim.png"
  },
  {
    rank: "#5",
    user: "Tonys♦Tucker",
    handle: "@Baby__BTC",
    points: "1,440,450",
    usda: "4,436.6",
    profileImage: "/profile-tonys.png"
  },
  {
    rank: "#6",
    user: "Sandy",
    handle: "@sandyXBT",
    points: "1,337,400",
    usda: "4,240.57",
    profileImage: "/profile-sandy.png"
  },
  {
    rank: "#7",
    user: "HuntΞr",
    handle: "@KingsEcheeh",
    points: "1,290,650",
    usda: "4,151.03",
    profileImage: "/profile-hunter.png"
  }
];

// Function to abbreviate numbers
function abbreviateNumber(num: string): string {
  const number = parseInt(num.replace(/,/g, ''));
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return num;
}

// Function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default function Leaderboard() {
  return (
    <div className=" rounded-lg   mt-10 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg sm:text-3xl text-left font-bold text-black">Leaderboard</h2>
       
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full ">
          {/* Table Header */}
          <thead className="">
            <tr>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider sm:w-16 w-16">RANK</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider ">USER</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-20 sm:w-20">POINTS</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider sm:w-30 w-20">$USDA</th>
            </tr>
          </thead>
        </table>
        
        <div className="space-y-2">
          {leaderboardData.map((entry, index) => {
            // Determine background color based on rank
            let bgColor = 'bg-transparent';
            if (entry.isCurrentUser) {
              bgColor = 'bg-gray-800';
            } else if (entry.rank === "#1") {
              bgColor = 'bg-[#f0f8f0]';
            } else if (entry.rank === "#2") {
              bgColor = 'bg-[#e8f5e8]';
            } else if (entry.rank === "#3") {
              bgColor = 'bg-[#f0f8f0]';
            }

            // Determine if this is a top 3 entry (excluding current user)
            const isTop3 = !entry.isCurrentUser && (entry.rank === "#1" || entry.rank === "#2" || entry.rank === "#3");

            return (
              <div 
                key={entry.rank}
                className={`${bgColor} rounded-lg p-2  ${
                  entry.isCurrentUser ? 'text-white' : 'text-black'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-14 sm:w-16 text-xs sm:text-sm font-semibold flex-shrink-0 ${
                    entry.isCurrentUser ? 'text-[#D6E14E]' : 'text-gray-800'
                  }`}>
                    {entry.rank}
                  </div>
                  <div className="flex-1 flex items-center min-w-0">
                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                      <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ${
                        entry.isCurrentUser ? 'bg-gray-600' : 'bg-gray-300'
                      }`}>
                        <span className={`text-xs sm:text-sm font-medium ${
                          entry.isCurrentUser ? 'text-white' : 'text-gray-700'
                        }`}>
                          {entry.user.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                      <div className={`text-xs sm:text-sm font-semibold truncate ${
                        entry.isCurrentUser ? 'text-white' : 'text-gray-900'
                      }`}>
                        {truncateText(entry.user, 8)}
                      </div>
                      <div className={`text-xs sm:text-sm truncate ${
                        entry.isCurrentUser ? 'text-gray-200' : 'text-gray-600'
                      }`}>
                        {truncateText(entry.handle, 10)}
                      </div>
                    </div>
                  </div>
                  <div className={`w-16 sm:w-20 text-xs sm:text-sm font-semibold flex-shrink-0 flex items-center ${
                    entry.isCurrentUser ? 'text-[#D6E14E]' : 'text-gray-800'
                  }`}>
                    {isTop3 ? (
                      <span className="bg-[#D6E14E] text-black px-1 py-0.5 rounded inline-block">
                        {abbreviateNumber(entry.points)}
                      </span>
                    ) : (
                      abbreviateNumber(entry.points)
                    )}
                  </div>
                  <div className={`w-20 sm:w-24 text-xs sm:text-sm font-semibold text-right flex-shrink-0 flex items-center justify-end ${
                    entry.isCurrentUser ? 'text-[#D6E14E]' : 'text-gray-800'
                  }`}>
                    {isTop3 ? (
                      <span className="bg-[#D6E14E] text-black px-1 py-0.5 rounded inline-block">
                        ${entry.usda}
                      </span>
                    ) : (
                      <span>${entry.usda}</span>
                    )}
                    {entry.isCurrentUser && (
                      <svg className="ml-1 h-3 w-3 sm:h-4 sm:w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 