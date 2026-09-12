import React, { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  FilePlus2,
  Inbox,
  Landmark,
  Mail,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
  XCircle,
} from 'lucide-react'
import {
  SOURCE_OPTIONS,
  STATUS,
  VAT_RATES,
  approveVoucher,
  buildLedgerPreview,
  createVoucher,
  isDuplicate,
  money,
  rejectVoucher,
  summarize,
} from './lib/accounting.js'
import { audit, loadState, saveState } from './lib/store.js'

const blankVoucher = () => ({
  supplier: '',
  invoiceNumber: '',
  documentDate: new Date().toISOString().slice(0, 10),
  dueDate: '',
  amountGross: '',
  vatRate: '25',
  source: 'manual',
  suggestedAccount: '',
  note: '',
  attachmentName: '',
  confidence: 0.8,
})

function App() {
  const [state, setState] = useState(loadState)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [draft, setDraft] = useState(blankVoucher)
  const [selectedId, setSelectedId] = useState(null)
  const [error, setError] = useState('')
  const [deadlineDraft, setDeadlineDraft] = useState({ title: '', dueDate: '' })

  useEffect(() => saveState(state), [state])

  const stats = useMemo(() => summarize(state.vouchers), [state.vouchers])
  const selectedVoucher = state.vouchers.find((voucher) => voucher.id === selectedId) || null
  const ledgerPreview = useMemo(() => buildLedgerPreview(selectedVoucher), [selectedVoucher])

  const updateDraft = (field, value) => setDraft((current) => ({ ...current, [field]: value }))

  const addVoucher = (event) => {
    event.preventDefault()
    setError('')
    if (!draft.supplier.trim() || !draft.amountGross || !draft.documentDate) {
      setError('Leverandør, bilagsdato og beløp er påkrevd.')
      return
    }

    const voucher = createVoucher(draft)
    if (isDuplicate(voucher, state.vouchers)) {
      setError('Mulig duplikat: samme leverandør, fakturanummer og beløp finnes allerede.')
      return
    }

    setState((current) => ({
      ...current,
      vouchers: [voucher, ...current.vouchers],
      auditLog: [audit('voucher.created', { voucherId: voucher.id, source: voucher.source }), ...current.auditLog],
    }))
    setDraft(blankVoucher())
    setSelectedId(voucher.id)
    setActiveTab('inbox')
  }

  const setVoucherStatus = (id, action) => {
    setState((current) => ({
      ...current,
      vouchers: current.vouchers.map((voucher) => {
        if (voucher.id !== id) return voucher
        return action === 'approve' ? approveVoucher(voucher) : rejectVoucher(voucher)
      }),
      auditLog: [audit(`voucher.${action}d`, { voucherId: id }), ...current.auditLog],
    }))
  }

  const addDeadline = (event) => {
    event.preventDefault()
    if (!deadlineDraft.title.trim() || !deadlineDraft.dueDate) return
    const deadline = {
      id: crypto.randomUUID(),
      title: deadlineDraft.title.trim(),
      dueDate: deadlineDraft.dueDate,
      source: 'manual',
      verified: false,
      completed: false,
    }
    setState((current) => ({
      ...current,
      deadlines: [...current.deadlines, deadline].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
      auditLog: [audit('deadline.created', { deadlineId: deadline.id }), ...current.auditLog],
    }))
    setDeadlineDraft({ title: '', dueDate: '' })
  }

  const toggleDeadline = (id) => {
    setState((current) => ({
      ...current,
      deadlines: current.deadlines.map((item) => item.id === id ? { ...item, completed: !item.completed } : item),
      auditLog: [audit('deadline.toggled', { deadlineId: id }), ...current.auditLog],
    }))
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">K</div>
          <div>
            <strong>KampfiskAccounting</strong>
            <span>ENK kontrollsenter</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Hovedmeny">
          <NavButton icon={Landmark} label="Oversikt" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavButton icon={Inbox} label="Bilagsinnboks" badge={stats.review || null} active={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} />
          <NavButton icon={BookOpen} label="Bokføring" active={activeTab === 'ledger'} onClick={() => setActiveTab('ledger')} />
          <NavButton icon={CalendarClock} label="Frister" active={activeTab === 'deadlines'} onClick={() => setActiveTab('deadlines')} />
          <NavButton icon={RefreshCw} label="Integrasjoner" active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} />
        </nav>

        <div className="sidebar-foot">
          <ShieldCheck size={18} />
          <span>Ingen automatisk innsending eller betaling i MVP.</span>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">KampfiskApps · regnskap</p>
            <h1>{pageTitle(activeTab)}</h1>
          </div>
          <button className="primary compact" onClick={() => setActiveTab('new')}>
            <FilePlus2 size={17} /> Nytt bilag
          </button>
        </header>

        {activeTab === 'dashboard' && (
          <section className="stack">
            <div className="notice safe">
              <ShieldCheck size={20} />
              <div><strong>Kontrollmodus er aktiv.</strong><span>Alle bilag må godkjennes før de regnes som bokført.</span></div>
            </div>
            <div className="metric-grid">
              <Metric label="Bilag" value={stats.count} sub={`${stats.review} til kontroll`} />
              <Metric label="Registrert brutto" value={money(stats.gross)} sub="MVP-grunnlag" />
              <Metric label="Beregnet inngående MVA" value={money(stats.vat)} sub="Må verifiseres mot bilag" />
              <Metric label="Godkjent" value={stats.approved} sub="kontrollerte bilag" />
            </div>
            <div className="two-col">
              <Panel title="Neste handlinger" icon={BadgeCheck}>
                <ActionRow done={stats.review === 0} title="Kontroller bilagsinnboksen" text={stats.review ? `${stats.review} bilag venter på kontroll.` : 'Ingen bilag venter.'} />
                <ActionRow done={state.deadlines.length > 0} title="Legg inn foretaksfrister" text="Offisielle frister aktiveres først når foretaksdata og regler er verifisert." />
                <ActionRow done={false} title="Koble dokumentkilder" text="Gmail, Outlook og post@kampfiskapps.com er neste integrasjonstrinn." />
              </Panel>
              <Panel title="Datakilder" icon={Mail}>
                <SourceLine name="Manuell opplasting" status="Aktiv" tone="ok" />
                <SourceLine name="Gmail" status="Adapter klar for neste steg" />
                <SourceLine name="Outlook" status="Adapter klar for neste steg" />
                <SourceLine name="post@kampfiskapps.com" status="Import/videresending først" />
              </Panel>
            </div>
          </section>
        )}

        {activeTab === 'new' && (
          <Panel title="Registrer bilag" icon={UploadCloud} wide>
            <form className="voucher-form" onSubmit={addVoucher}>
              <Field label="Leverandør *"><input value={draft.supplier} onChange={(e) => updateDraft('supplier', e.target.value)} placeholder="F.eks. IONOS" /></Field>
              <Field label="Fakturanummer"><input value={draft.invoiceNumber} onChange={(e) => updateDraft('invoiceNumber', e.target.value)} placeholder="INV-12345" /></Field>
              <Field label="Bilagsdato *"><input type="date" value={draft.documentDate} onChange={(e) => updateDraft('documentDate', e.target.value)} /></Field>
              <Field label="Forfallsdato"><input type="date" value={draft.dueDate} onChange={(e) => updateDraft('dueDate', e.target.value)} /></Field>
              <Field label="Beløp inkl. MVA *"><input type="number" min="0" step="0.01" value={draft.amountGross} onChange={(e) => updateDraft('amountGross', e.target.value)} placeholder="0,00" /></Field>
              <Field label="MVA-sats"><select value={draft.vatRate} onChange={(e) => updateDraft('vatRate', e.target.value)}>{VAT_RATES.map((rate) => <option key={rate} value={rate}>{rate}%</option>)}</select></Field>
              <Field label="Kilde"><select value={draft.source} onChange={(e) => updateDraft('source', e.target.value)}>{SOURCE_OPTIONS.map((source) => <option key={source.value} value={source.value}>{source.label}</option>)}</select></Field>
              <Field label="Foreslått konto"><input value={draft.suggestedAccount} onChange={(e) => updateDraft('suggestedAccount', e.target.value)} placeholder="F.eks. Programvare / abonnement" /></Field>
              <Field label="Bilagsfil" full>
                <input type="file" accept="application/pdf,image/*" onChange={(e) => updateDraft('attachmentName', e.target.files?.[0]?.name || '')} />
                <small>MVP lagrer foreløpig filnavn/metadata lokalt. Sikker dokumentlagring kobles på i neste backend-steg.</small>
              </Field>
              <Field label="Notat" full><textarea rows="3" value={draft.note} onChange={(e) => updateDraft('note', e.target.value)} placeholder="Valgfri forklaring" /></Field>
              {error && <div className="form-error"><AlertTriangle size={18} /> {error}</div>}
              <div className="form-actions"><button type="button" className="secondary" onClick={() => setActiveTab('inbox')}>Avbryt</button><button className="primary" type="submit"><ReceiptText size={17} /> Legg til for kontroll</button></div>
            </form>
          </Panel>
        )}

        {activeTab === 'inbox' && (
          <section className="two-col inbox-layout">
            <Panel title={`Bilag (${state.vouchers.length})`} icon={Inbox}>
              {state.vouchers.length === 0 ? <Empty text="Ingen bilag er registrert ennå." /> : (
                <div className="voucher-list">
                  {state.vouchers.map((voucher) => (
                    <button key={voucher.id} className={`voucher-row ${selectedId === voucher.id ? 'selected' : ''}`} onClick={() => setSelectedId(voucher.id)}>
                      <div><strong>{voucher.supplier}</strong><span>{voucher.invoiceNumber || 'Uten fakturanr.'} · {voucher.documentDate}</span></div>
                      <div className="row-end"><strong>{money(voucher.amountGross)}</strong><StatusPill status={voucher.status} /></div>
                    </button>
                  ))}
                </div>
              )}
            </Panel>
            <Panel title="Kontroll" icon={ShieldCheck}>
              {!selectedVoucher ? <Empty text="Velg et bilag for å kontrollere det." /> : (
                <div className="review-card">
                  <div className="review-head"><div><p className="eyebrow">{sourceLabel(selectedVoucher.source)}</p><h2>{selectedVoucher.supplier}</h2></div><StatusPill status={selectedVoucher.status} /></div>
                  <dl className="detail-grid">
                    <Detail label="Faktura" value={selectedVoucher.invoiceNumber || '—'} />
                    <Detail label="Bilagsdato" value={selectedVoucher.documentDate} />
                    <Detail label="Netto" value={money(selectedVoucher.amountNet)} />
                    <Detail label={`MVA ${selectedVoucher.vatRate}%`} value={money(selectedVoucher.vatAmount)} />
                    <Detail label="Brutto" value={money(selectedVoucher.amountGross)} />
                    <Detail label="Konto" value={selectedVoucher.suggestedAccount} />
                    <Detail label="Fil" value={selectedVoucher.attachmentName || 'Ingen fil lagret'} />
                    <Detail label="AI-confidence" value={`${Math.round(selectedVoucher.confidence * 100)}%`} />
                  </dl>
                  <div className="review-warning"><AlertTriangle size={18} /> Kontroller originalbilag, konto og MVA før godkjenning.</div>
                  <div className="form-actions"><button className="danger" onClick={() => setVoucherStatus(selectedVoucher.id, 'reject')}><XCircle size={17} /> Avvis</button><button className="primary" onClick={() => setVoucherStatus(selectedVoucher.id, 'approve')}><CheckCircle2 size={17} /> Godkjenn</button></div>
                </div>
              )}
            </Panel>
          </section>
        )}

        {activeTab === 'ledger' && (
          <Panel title="Bokføringspreview" icon={BookOpen} wide>
            <p className="panel-intro">Velg et bilag i bilagsinnboksen. Posteringen under er bare et kontrollgrunnlag; endelig kontoplan, MVA-kode og motkonto skal valideres før produksjonsbokføring.</p>
            {!selectedVoucher ? <Empty text="Ingen bilag valgt." /> : (
              <div className="ledger-wrap">
                <div className="ledger-meta"><strong>{selectedVoucher.supplier}</strong><span>{selectedVoucher.invoiceNumber || 'Uten fakturanr.'} · {selectedVoucher.documentDate}</span></div>
                <table><thead><tr><th>Konto</th><th>Tekst</th><th>Debet</th><th>Kredit</th></tr></thead><tbody>{ledgerPreview.map((line, index) => <tr key={`${line.account}-${index}`}><td>{line.account}</td><td>{line.text}</td><td>{line.debit ? money(line.debit) : '—'}</td><td>{line.credit ? money(line.credit) : '—'}</td></tr>)}</tbody></table>
              </div>
            )}
          </Panel>
        )}

        {activeTab === 'deadlines' && (
          <section className="stack">
            <div className="notice warning"><AlertTriangle size={20} /><div><strong>Offisiell fristmotor er ikke aktivert ennå.</strong><span>Før automatiske MVA-/skattefrister legges inn skal foretaksstatus og gjeldende regler verifiseres mot offisielle norske kilder.</span></div></div>
            <Panel title="Manuelle frister" icon={CalendarClock} wide>
              <form className="deadline-form" onSubmit={addDeadline}><input placeholder="F.eks. send dokumentasjon til regnskapsfører" value={deadlineDraft.title} onChange={(e) => setDeadlineDraft((d) => ({ ...d, title: e.target.value }))} /><input type="date" value={deadlineDraft.dueDate} onChange={(e) => setDeadlineDraft((d) => ({ ...d, dueDate: e.target.value }))} /><button className="primary" type="submit">Legg til</button></form>
              {state.deadlines.length === 0 ? <Empty text="Ingen frister registrert." /> : <div className="deadline-list">{state.deadlines.map((item) => <label key={item.id} className={`deadline-row ${item.completed ? 'complete' : ''}`}><input type="checkbox" checked={item.completed} onChange={() => toggleDeadline(item.id)} /><span><strong>{item.title}</strong><small>{item.dueDate} · {item.verified ? 'verifisert' : 'manuell/ikke regelverifisert'}</small></span></label>)}</div>}
            </Panel>
          </section>
        )}

        {activeTab === 'integrations' && (
          <div className="integration-grid">
            <Integration name="Gmail" icon={Mail} description="Hent fakturaer og kvitteringer fra valgt postboks." status="Neste byggesteg" />
            <Integration name="Outlook" icon={Mail} description="Importer fakturaer, krav og vedlegg." status="Neste byggesteg" />
            <Integration name="post@kampfiskapps.com" icon={Inbox} description="Egen kilde. Start med videresending/importadapter, deretter direkte mailbox-kobling." status="Planlagt" />
            <Integration name="Google Drive" icon={UploadCloud} description="Dedikert bilagsarkiv med sporbar lenke til originaldokument." status="Planlagt" />
            <Integration name="Bank / avstemming" icon={Landmark} description="CSV/CAMT først, direkte bankintegrasjon senere." status="Planlagt" />
            <Integration name="Altinn / Skatteetaten / BankID" icon={ShieldCheck} description="Kun med eksplisitt brukerbekreftelse før innsending, signering eller betaling." status="Låst i MVP" />
          </div>
        )}
      </main>
    </div>
  )
}

function NavButton({ icon: Icon, label, badge, active, onClick }) {
  return <button className={`nav-button ${active ? 'active' : ''}`} onClick={onClick}><Icon size={18} /><span>{label}</span>{badge ? <b>{badge}</b> : null}</button>
}
function Metric({ label, value, sub }) { return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{sub}</small></div> }
function Panel({ title, icon: Icon, children, wide = false }) { return <section className={`panel ${wide ? 'wide' : ''}`}><div className="panel-title"><Icon size={19} /><h2>{title}</h2></div>{children}</section> }
function Field({ label, children, full = false }) { return <label className={`field ${full ? 'full' : ''}`}><span>{label}</span>{children}</label> }
function Detail({ label, value }) { return <div><dt>{label}</dt><dd>{value}</dd></div> }
function Empty({ text }) { return <div className="empty"><ReceiptText size={30} /><span>{text}</span></div> }
function ActionRow({ done, title, text }) { return <div className="action-row">{done ? <CheckCircle2 className="ok-icon" size={20} /> : <AlertTriangle className="wait-icon" size={20} />}<div><strong>{title}</strong><span>{text}</span></div></div> }
function SourceLine({ name, status, tone }) { return <div className="source-line"><span>{name}</span><b className={tone === 'ok' ? 'ok-text' : ''}>{status}</b></div> }
function Integration({ name, icon: Icon, description, status }) { return <section className="integration"><div className="integration-icon"><Icon size={22} /></div><div><h2>{name}</h2><p>{description}</p><span>{status}</span></div></section> }
function StatusPill({ status }) { const cls = status === STATUS.APPROVED ? 'approved' : status === STATUS.REJECTED ? 'rejected' : 'review'; return <span className={`status ${cls}`}>{status}</span> }
function sourceLabel(value) { return SOURCE_OPTIONS.find((source) => source.value === value)?.label || value }
function pageTitle(tab) { return ({ dashboard: 'Oversikt', inbox: 'Bilagsinnboks', ledger: 'Bokføring', deadlines: 'Frister', integrations: 'Integrasjoner', new: 'Nytt bilag' })[tab] || 'KampfiskAccounting' }

export default App
