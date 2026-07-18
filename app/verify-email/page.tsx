import Loading from '@/components/Loading'
import VerifyEmailContent from '@/components/VerifyEmailContent'
import React, { Suspense } from 'react'

const page = () => {
  return (
   <Suspense fallback={<Loading />}>
    <VerifyEmailContent />
   </Suspense>
  )
}

export default page
