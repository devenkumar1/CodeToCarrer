import React from 'react'
import LearningMethod from '@/components/LearningMethod/LearningMethod'
import LanguagePopup  from '@/components/LanguagePopUp/LanguagePopUp'
import ExperiencePopUp from '@/components/ExperiencePopUp/ExperiencePopUp'
function LearningPath() {
  return (
    <div className='min-h-screen dark:bg-black bg-white flex flex-col justify-center items-center'>LearningPath
    <div className='flex flex-col'>
   
   <LearningMethod/>
  
  {/* <LanguagePopup/>

  <ExperiencePopUp/> */}


    </div>
    
    </div>
  )
}

export default LearningPath