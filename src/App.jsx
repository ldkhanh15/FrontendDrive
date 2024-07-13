import { useEffect, useState } from 'react'
import Header from './components/layout/Header'
import { Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './components/context/auth.context'
import { getAccount } from './services/loginService'
import { Spin } from 'antd'

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);
  useEffect(() => {
    const getData = async () => {
      setAppLoading(true)
      const res = await getAccount();
      if (res && res.data && res.data.user) {
        setAuth({
          isAuthenticated: true,
          user: {
            email: res?.data?.user?.email,
            name: res?.data?.user?.name
          }
        })
      }
      setAppLoading(false)
    }
    getData();
  }, [])
  return (
    <div>
      {
        appLoading == true ? <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}><Spin /></div> :
          <>
            <Header />
            <Outlet />
          </>
      }
    </div>
  )
}

export default App
