# KampfiskAccounting MVP

Første byggesteg for et norsk ENK-regnskapssystem under KampfiskApps.

## Inkludert i MVP-01

- Bilagsinnboks med manuell registrering og filmetadata
- Kilder: manuell, Gmail, Outlook og `post@kampfiskapps.com`
- Duplikatkontroll på leverandør + fakturanummer + beløp
- Beregning av netto/MVA/brutto
- Statusflyt: `Til kontroll` → `Godkjent` / `Avvist`
- Bokføringspreview med debet/kredit
- Lokal audit-logg
- Manuelle frister
- Integrasjonsoversikt og eksplisitte sikkerhetsgrenser

## Sikkerhetsgrenser

Denne versjonen sender ikke MVA-melding, skattemelding, betalinger eller andre offentlige handlinger. Altinn, Skatteetaten, bank og BankID skal kreve eksplisitt brukerbekreftelse i senere byggesteg.

Bilagsfilen lagres ikke permanent i denne frontend-MVP-en; kun filnavn/metadata registreres lokalt. Produksjonsversjonen skal bruke sikker dokumentlagring og koble originaldokumentet til transaksjon/journalpost.

## Kjør lokalt

```bash
cd apps/kampfisk-accounting
npm install
npm run dev
```

Bygg:

```bash
npm run build
```

## Neste byggesteg

1. Backend/database med virksomhet, bilag, journal, journal-linjer, MVA-koder/-perioder, frister, integrasjoner og audit-logg.
2. Gmail/Outlook-ingest med vedleggsimport og egen adapter for `post@kampfiskapps.com`.
3. Verifisert norsk kontoplan/MVA-/fristmotor mot offisielle kilder før automatikk aktiveres.
4. Bankimport via CSV/CAMT og avstemming før direkte bankkobling vurderes.
5. Sikker dokumentlagring og kobling til Google Drive/dedikert bilagsarkiv.

## Repo-strategi

MVP-en ligger isolert i `KampfiskApps2.0/apps/kampfisk-accounting` fordi GitHub-koblingen i denne arbeidsøkten ikke kan opprette nye repositories. Mappen er laget for å kunne flyttes direkte til et eget `WKampfisk/KampfiskAccounting`-repo senere.
