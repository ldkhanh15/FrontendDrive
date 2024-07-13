import React from 'react'
import { useEffect } from 'react'
import { getActivity } from '../services/userService'
import NotFound from './NotFound'

const Activity = () => {

  useEffect(() => {
    const getData = async () => {
      const res = await getActivity();

    }
    getData();
  }, [])
  return (
    <div>
      <NotFound />
    </div>
  )
}

export default Activity