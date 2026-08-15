# Interfaccia di Comparazione

App React/Vite per il confronto tra psicofarmaci, costruita a partire dal componente JSX presente nel repository.

## Requisiti

- Node.js 20+
- npm

## Installazione

```bash
npm install
```

## Sviluppo locale

```bash
npm run dev
```

## Build di produzione

```bash
npm run build
```

## Deploy su GitHub Pages

1. Apri il repository su GitHub.
2. Vai in Settings → Pages.
3. Imposta la Source su GitHub Actions.
4. Esegui il push su `main`.
5. Il workflow in `.github/workflows/deploy.yml` pubblicherà l'app automaticamente.

## Nota

L'app usa `base: '/Interfaccia-Di-Comparazione/'` in Vite, coerente con il nome del repository GitHub. Se il repository avrà un nome diverso, aggiorna anche `vite.config.js`.
