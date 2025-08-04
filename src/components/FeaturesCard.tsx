export default function FeaturesCard() {
  return (
    <div className="relative rounded-xl shadow-xl ring-1 ring-gray-400/10 h-full min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%),
            linear-gradient(-45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-gray-400 text-lg">Empty Card</div>
    </div>
  )
} 