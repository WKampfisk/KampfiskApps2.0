export const SOURCE_OPTIONS = [
  { value: 'manual', label: 'Manuell opplasting' },
  { value: 'gmail', label: 'Gmail' },
  { value: 'outlook', label: 'Outlook' },
  { value: 'kampfiskapps_mail', label: 'post@kampfiskapps.com' },
]

export const STATUS = {
  REVIEW: 'Til kontroll',
  APPROVED: 'Godkjent',
  REJECTED: 'Avvist',
}

export const VAT_RATES = [0, 12, 15, 25]

export function money(value) {
  const number = Number(value || 0)
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    maximumFractionDigits: 2,
  }).format(number)
}

export function calculateVat(gross, vatRate) {
  const grossNumber = Number(gross || 0)
  const rate = Number(vatRate || 0)
  if (!grossNumber || !rate) return { net: grossNumber, vat: 0, gross: grossNumber }

  const divisor = 1 + rate / 100
  const net = grossNumber / divisor
  return {
    net: round2(net),
    vat: round2(grossNumber - net),
    gross: round2(grossNumber),
  }
}

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

export function createVoucher(input) {
  const vat = calculateVat(input.amountGross, input.vatRate)
  return {
    id: crypto.randomUUID(),
    supplier: input.supplier.trim(),
    invoiceNumber: input.invoiceNumber.trim(),
    documentDate: input.documentDate,
    dueDate: input.dueDate || null,
    amountGross: vat.gross,
    amountNet: vat.net,
    vatAmount: vat.vat,
    vatRate: Number(input.vatRate || 0),
    source: input.source,
    suggestedAccount: input.suggestedAccount.trim() || 'Uavklart',
    note: input.note.trim(),
    attachmentName: input.attachmentName || null,
    status: STATUS.REVIEW,
    confidence: Number(input.confidence || 0.8),
    createdAt: new Date().toISOString(),
    approvedAt: null,
  }
}

export function voucherFingerprint(voucher) {
  return [
    String(voucher.supplier || '').trim().toLowerCase(),
    String(voucher.invoiceNumber || '').trim().toLowerCase(),
    String(Number(voucher.amountGross || 0).toFixed(2)),
  ].join('|')
}

export function isDuplicate(candidate, vouchers) {
  const fingerprint = voucherFingerprint(candidate)
  return vouchers.some((voucher) => voucherFingerprint(voucher) === fingerprint)
}

export function approveVoucher(voucher) {
  return {
    ...voucher,
    status: STATUS.APPROVED,
    approvedAt: new Date().toISOString(),
  }
}

export function rejectVoucher(voucher) {
  return {
    ...voucher,
    status: STATUS.REJECTED,
    approvedAt: null,
  }
}

export function buildLedgerPreview(voucher) {
  if (!voucher) return []
  const lines = [
    {
      account: voucher.suggestedAccount || 'Uavklart',
      text: `${voucher.supplier}${voucher.invoiceNumber ? ` – ${voucher.invoiceNumber}` : ''}`,
      debit: voucher.amountNet,
      credit: 0,
    },
  ]

  if (voucher.vatAmount > 0) {
    lines.push({
      account: 'Inngående MVA',
      text: `MVA ${voucher.vatRate}%`,
      debit: voucher.vatAmount,
      credit: 0,
    })
  }

  lines.push({
    account: 'Leverandørgjeld / bank',
    text: 'Motpost',
    debit: 0,
    credit: voucher.amountGross,
  })

  return lines
}

export function summarize(vouchers) {
  return vouchers.reduce(
    (acc, voucher) => {
      acc.count += 1
      acc.gross += voucher.amountGross || 0
      acc.vat += voucher.vatAmount || 0
      if (voucher.status === STATUS.REVIEW) acc.review += 1
      if (voucher.status === STATUS.APPROVED) acc.approved += 1
      return acc
    },
    { count: 0, gross: 0, vat: 0, review: 0, approved: 0 },
  )
}
