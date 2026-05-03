import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const STATUS_COLORS = {
  planejamento: { bg: '#26215C', color: '#AFA9EC' },
  andamento: { bg: '#0F3D2E', color: '#5DCAA5' },
  pausada: { bg: '#3D3000', color: '#FAC775' },
  concluida: { bg: '#1A0A0A', color: '#F09595' },
}

const STATUS_LABELS = {
  planejamento: 'Planejamento',
  andamento: 'Em andamento',
  pausada: 'Pausada',
  concluida: 'Concluída',
}

const TIPOS = ['Residencial', 'Comercial', 'Industrial', 'Reforma', 'Outro']

const emptyForm = {
  nome: '', tipo: '', status: 'planejamento', data_inicio: '',
  data_prevista_fim: '', endereco: '', descricao: '',
  valor_orcado: '', responsavel_tecnico: '',
  nome_cliente: '', contato_cliente: ''
}

const lbl = { display: 'block', fontSize: 12, color: '#888780', marginBottom: 5 }
const inp = { width: '100%', background: '#16161A', border: '0.5px solid #2E2E38', borderRadius: 8, padding: '8px 11px', fontSize: 13, color: '#D3D1C7', outline: 'none' }

export default function Obras({ session }) {
  const [obras, setObras] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [obraAberta, setObraAberta] = useState(null)

  useEffect(() => { fetchObras() }, [])

  const fetchObras = async () => {
    setLoading(true)
    const { data } = await supabase.from('obras').select('*').order('created_at', { ascending: false })
    setObras(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!form.nome.trim()) return alert('Nome da obra é obrigatório')
    setSaving(true)
    const payload = {
      ...form,
      valor_orcado: form.valor_orcado ? parseFloat(form.valor_orcado) : null,
      user_id: session.user.id
    }
    const { error } = await supabase.from('obras').insert([payload])
    if (error) alert('Erro ao salvar: ' + error.message)
    else { setShowForm(false); setForm(emptyForm); fetchObras() }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta obra?')) return
    await supabase.from('obras').delete().eq('id', id)
    fetchObras()
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const formatCurrency = (v) => v ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) : '—'
  const formatDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—'

  if (obraAberta) return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => setObraAberta(null)} style={{ background: '#1E1E24', border: '0.5px solid #2E2E38', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#888780', cursor: 'pointer' }}>← Voltar</button>
        <h2 style={{ fontSize: 16, fontWeight: 500, color: '#fff', margin: 0 }}>{obraAberta.nome}</h2>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: STATUS_COLORS[obraAberta.status]?.bg, color: STATUS_COLORS[obraAberta.status]?.color }}>
          {STATUS_LABELS[obraAberta.status]}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
        {[
          ['Cliente', obraAberta.nome_cliente || '—'],
          ['Tipo', obraAberta.tipo || '—'],
          ['Início', formatDate(obraAberta.data_inicio)],
          ['Previsão fim', formatDate(obraAberta.data_prevista_fim)],
          ['Orçamento', formatCurrency(obraAberta.valor_orcado)],
          ['Responsável', obraAberta.responsavel_tecnico || '—'],
        ].map(([label, value]) => (
          <div key={label} style={{ background: '#1E1E24', border: '0.5px solid #2E2E38', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#5F5E5A', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#D3D1C7' }}>{value}</div>
          </div>
        ))}
      </div>
      {obraAberta.endereco && (
        <div style={{ background: '#1E1E24', border: '0.5px solid #2E2E38', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#5F5E5A', marginBottom: 4 }}>Endereço</div>
          <div style={{ fontSize: 13, color: '#D3D1C7' }}>{obraAberta.endereco}</div>
        </div>
      )}
      {obraAberta.descricao && (
        <div style={{ background: '#1E1E24', border: '0.5px solid #2E2E38', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#5F5E5A', marginBottom: 4 }}>Descrição</div>
          <div style={{ fontSize: 13, color: '#D3D1C7' }}>{obraAberta.descricao}</div>
        </div>
      )}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 500, color: '#fff', margin: 0 }}>Obras</h1>
          <p style={{ fontSize: 12, color: '#5F5E5A', margin: '4px 0 0' }}>{obras.length} obra{obras.length !== 1 ? 's' : ''} cadastrada{obras.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, cursor: 'pointer' }}>
          + Nova obra
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#1E1E24', border: '0.5px solid #2E2E38', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: 0 }}>Nova obra</h3>
            <button onClick={() => { setShowForm(false); setForm(emptyForm) }} style={{ background: 'transparent', border: 'none', color: '#5F5E5A', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={lbl}>Nome da obra *</label>
              <input value={form.nome} onChange={e => f('nome', e.target.value)} placeholder="Ex: Residência Silva — Moema" style={inp} />
            </div>
            <div>
              <label style={lbl}>Tipo</label>
              <select value={form.tipo} onChange={e => f('tipo', e.target.value)} style={inp}>
                <option value="">Selecionar</option>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select value={form.status} onChange={e => f('status', e.target.value)} style={inp}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Data de início</label>
              <input type="date" value={form.data_inicio} onChange={e => f('data_inicio', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>Previsão de término</label>
              <input type="date" value={form.data_prevista_fim} onChange={e => f('data_prevista_fim', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>Nome do cliente</label>
              <input value={form.nome_cliente} onChange={e => f('nome_cliente', e.target.value)} placeholder="Nome completo" style={inp} />
            </div>
            <div>
              <label style={lbl}>Contato do cliente</label>
              <input value={form.contato_cliente} onChange={e => f('contato_cliente', e.target.value)} placeholder="(11) 99999-9999" style={inp} />
            </div>
            <div>
              <label style={lbl}>Valor orçado (R$)</label>
              <input type="number" value={form.valor_orcado} onChange={e => f('valor_orcado', e.target.value)} placeholder="0,00" style={inp} />
            </div>
            <div>
              <label style={lbl}>Responsável técnico</label>
              <input value={form.responsavel_tecnico} onChange={e => f('responsavel_tecnico', e.target.value)} placeholder="Nome do responsável" style={inp} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={lbl}>Endereço</label>
              <input value={form.endereco} onChange={e => f('endereco', e.target.value)} placeholder="Rua, número, bairro, cidade — UF" style={inp} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={lbl}>Descrição / observações</label>
              <textarea value={form.descricao} onChange={e => f('descricao', e.target.value)} placeholder="Descrição da obra..." style={{ ...inp, height: 72, resize: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
            <button onClick={() => { setShowForm(false); setForm(emptyForm) }} style={{ background: 'transparent', border: '0.5px solid #2E2E38', borderRadius: 8, padding: '9px 18px', fontSize: 13, color: '#888780', cursor: 'pointer' }}>Cancelar</button>
            <button onClick={handleSave} disabled={saving} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Salvando...' : 'Salvar obra'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#5F5E5A', fontSize: 13 }}>Carregando...</p>
      ) : obras.length === 0 ? (
        <div style={{ background: '#1E1E24', border: '0.5px solid #2E2E38', borderRadius: 12, padding: 48, textAlign: 'center' }}>
          <p style={{ color: '#444441', fontSize: 14, margin: 0 }}>Nenhuma obra cadastrada ainda</p>
          <p style={{ color: '#333', fontSize: 12, marginTop: 6 }}>Clique em "+ Nova obra" para começar</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {obras.map(obra => (
            <div key={obra.id} style={{ background: '#1E1E24', border: '0.5px solid #2E2E38', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{obra.nome}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: STATUS_COLORS[obra.status]?.bg, color: STATUS_COLORS[obra.status]?.color }}>
                    {STATUS_LABELS[obra.status]}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {obra.nome_cliente && <span style={{ fontSize: 12, color: '#5F5E5A' }}>Cliente: {obra.nome_cliente}</span>}
                  {obra.tipo && <span style={{ fontSize: 12, color: '#5F5E5A' }}>{obra.tipo}</span>}
                  {obra.data_prevista_fim && <span style={{ fontSize: 12, color: '#5F5E5A' }}>Término: {formatDate(obra.data_prevista_fim)}</span>}
                  {obra.valor_orcado && <span style={{ fontSize: 12, color: '#5F5E5A' }}>{formatCurrency(obra.valor_orcado)}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => setObraAberta(obra)} style={{ background: '#26215C', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 12, color: '#AFA9EC', cursor: 'pointer' }}>Ver</button>
                <button onClick={() => handleDelete(obra.id)} style={{ background: 'transparent', border: '0.5px solid #2E2E38', borderRadius: 7, padding: '7px 14px', fontSize: 12, color: '#5F5E5A', cursor: 'pointer' }}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}