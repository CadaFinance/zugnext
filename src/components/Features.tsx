import FeaturesText from './FeaturesText'
import FeaturesCard from './FeaturesCard'

export default function Features() {
  return (
    <div className="bg-gradient-to-t from-[#D6E14E] to-transparent pt-8 pb-16 relative overflow-hidden">
         
      <div className="mx-auto max-w-7xl px-2 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="order-2 lg:order-1 lg:w-3/5">
            <FeaturesText />
          </div>
          <div className="order-1 lg:order-2 lg:w-2/5">
            <FeaturesCard />
          </div>
        </div>
      </div>
    </div>
  )
} 