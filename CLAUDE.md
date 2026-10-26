# CLAUDE.md — Slicr Budget App

## Vad appen är
Enkel månadsbudget-app för privatpersoner. Användaren anger lön,
sätter kategorier med budgetar och loggar utgifter. Appen visar
hur mycket som är kvar och hur man ligger mot budgeten per kategori.

## Features (v1 — dessa och inget mer)
- Månadsöversikt: kvar av lönen, budget vs utfall per kategori
- Lägga till / redigera / ta bort transaktioner
- Kategorier med budgetar (inkl. obligatorisk "other"-kategori)
- Återkommande transaktioner som materialiseras varje ny månad
- Månadsnavigation (bakåt i historik, framåt skapar ny månad)
- Responsiv layout: tab-navigation (mobil) / tre kolumner (desktop)

## Inte i scope
- Backend, auth, konton
- Export / import
- Bankintegration
- Kvittofoton

## Stack
- React, TypeScript, Vite, Tailwind CSS
- localStorage för all datapersistens (ingen backend)

## Arkitektur
- All state i `src/context/BudgetContext.tsx` via React Context
- Enkel view-routing i App.tsx (overview / transactions / plan), vyerna ligger i `src/views/`
- Typer definierade i `src/types/index.ts`
- localStorage-logik i `src/lib/storage.ts`
- Färger via CSS-variabler i `src/index.css` (oklch, light/dark)

## Kodregler — följ alltid dessa
- Så lite kod som möjligt för att lösa problemet
- Återanvänd befintliga komponenter — skapa inte nya i onödan
- När du skriver om något, ta bort den gamla koden
- Inga nya npm-paket utan att fråga först
- Läsbarhet går före kort kod: vanliga if-satser hellre än nästlade ternaries, några extra rader är okej
- Beskrivande korta namn (`transaction`, `category`, inte `t`, `c`). Undantag — etablerade enbokstavsnamn: `e` för events, `i` för loopindex, `a`/`b` i sort, `_` för oanvända parametrar

## Viktiga detaljer
- 'other'-kategorin är obligatorisk och kan inte tas bort