import AcceptInviteForm from '@/components/AcceptInviteForm'
import Loading from '@/components/Loading'
import React, { Suspense } from 'react'

const page = () => {
  return (
   <Suspense fallback={<Loading />}>
    <AcceptInviteForm />
   </Suspense>
  )
}

export default page
