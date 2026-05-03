import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  if (loading) return (
    <div style={{ background: '#16161A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888780', fontFamily: 'sans-serif' }}>Carregando...</p>
    </div>
  )

  if (!session) return (
    <div style={{ background: '#16161A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#7F77DD', margin: '0 auto 16px' }}></div>
        <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 500, marginBottom: 8 }}>ObraFácil</h1>
        <p style={{ color: '#5F5E5A', fontSize: 14, marginBottom: 32 }}>Gestão de obras e reformas</p>
        <button onClick={handleLogin} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 14, cursor: 'pointer' }}>
          Entrar com Google
        </button>
      </div>
    </div>
  )

  return <Dashboard session={session} />
}