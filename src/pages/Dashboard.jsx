import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Obras from './Obras'

const NAV = [
  { key: 'dashboard', label: 'Dashboard', section: 'Principal' },
  { key: 'obras', label: 'Obras', section: 'Principal' },
  { key: 'cronograma', label: 'Cronograma', section: 'Principal' },
  { key: 'financeiro', label: 'Financeiro', section: 'Gestão' },
  { key: 'materiais', label: 'Materiais', section: 'Gestão' },
  { key: 'equipe', label: 'Equipe', section: 'Gestão' },
  { key: 'diario', label: 'Diário de obra', section: 'Registro' },
  { key: 'documentos', label: 'Documentos', section: 'Registro' },
  { key: 'operacional', label: 'Operacional', section: 'Registro' },
  { key: 'acessos', label: 'Acessos', section: 'Config' },
]

const SECTIONS = ['Principal', 'Gestão', 'Registro', 'Config']

export default function Dashboard({ session }) {
  const [active, setActive] = useState('dashboard')
  const initials = session.user.email.substring(0, 2).toUpperCase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#16161A', fontFamily: 'sans-serif', overflow: 'hidden' }}>

      <div style={{ background: '#1E1E24', borderBottom: '0.5px solid #2E2E38', padding: '0 20px', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7F77DD' }}></div>
          <span style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>ObraFácil</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#5F5E5A' }}>{session.user.email}</span>
          <div onClick={handleLogout} title="Sair" style={{ width: 28, height: 28, borderRadius: '50%', background: '#3C3089', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#CECBF6', cursor: 'pointer' }}>
            {initials}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <div style={{ width: 200, minWidth: 200, background: '#1E1E24', borderRight: '0.5px solid #2E2E38', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ padding: '8px 0' }}>
            {SECTIONS.map(section => (
              <div key={section}>
                <div style={{ fontSize: 10, color: '#5F5E5A', padding: '12px 16px 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {section}
                </div>
                {NAV.filter(n => n.section === section).map(item => (
                  <div key={item.key} onClick={() => setActive(item.key)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', fontSize: 13, color: active === item.key ? '#AFA9EC' : '#888780', background: active === item.key ? '#26215C' : 'transparent', cursor: 'pointer' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: active === item.key ? '#7F77DD' : '#333', flexShrink: 0 }}></div>
                    {item.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {active === 'obras' ? (
            <Obras session={session} />
          ) : (
            <>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 18, fontWeight: 500, color: '#fff', margin: 0 }}>
                  {NAV.find(n => n.key === active)?.label}
                </h1>
                <p style={{ fontSize: 12, color: '#5F5E5A', margin: '4px 0 0' }}>
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div style={{ background: '#1E1E24', border: '0.5px solid #2E2E38', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                <p style={{ color: '#444441', fontSize: 14, margin: 0 }}>Módulo em construção</p>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}