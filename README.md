# Comparatore IA - Frontend

SPA React in JavaScript per consultare, filtrare, comparare e salvare tra i preferiti modelli di intelligenza artificiale.

## Tecnologie

- React
- JavaScript
- Vite
- CSS semplice

## Requisiti

- Node.js installato
- Backend del progetto avviato sulla porta `3001`

## Configurazione

Il file `.env` deve contenere:

```bash
VITE_API_URL=http://localhost:3001
```

## Installazione

```bash
npm install
```

## Avvio frontend

```bash
npm run dev
```

Il frontend viene avviato normalmente su:

```bash
http://localhost:5173
```

## Avvio backend

Entrare nella cartella del backend:

```bash
cd ../ai-comparator-back
```

Installare le dipendenze se necessario:

```bash
npm install
```

Avviare il backend:

```bash
npm run dev
```

Il backend deve essere disponibile su:

```bash
http://localhost:3001/models
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```
