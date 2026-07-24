import Loading from '@/components/Loading'
import SuperAdminStaffContent from '@/components/SuperAdminStaffContent'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SuperAdminStaffContent />
    </Suspense>
  )
}

export default page
