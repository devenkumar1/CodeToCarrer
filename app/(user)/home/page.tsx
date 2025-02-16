import { HeroHome } from '@/components/User/Home/HeroHome'
import { StickyHero } from '@/components/User/Home/StickyHero'

import React from 'react'

function Home() {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center w-full'>
      <div className='w-[98vw]'>
      <HeroHome/>
      <StickyHero/>
      </div>
    </div>
  )
}

export default Home