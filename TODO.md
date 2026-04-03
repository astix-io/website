# TODO — astix.io website

## Content Updates — Session 2026-04-02/03

Features à ajouter/mettre en avant sur le site :

### Taint Tracking (killer feature — aucun concurrent MCP ne fait ça)
- [ ] 📝 [Features] Ajouter section "Security Analysis" — source→sink vulnerability detection
- [ ] 📝 [Features] 5 built-in patterns : SQL injection, XSS, path traversal, SSRF, log injection
- [ ] 📝 [Features] Cross-function taint tracing (suit la donnée à travers les appels de fonctions)
- [ ] 📝 [Features] CFG-aware sanitizer detection (détecte les branches non-sanitizées)
- [ ] 📝 [Features] Template literal sinks, inline property access, call-based sources
- [ ] 📝 [Features] Custom patterns via config.json (extensible par l'utilisateur)
- [ ] 📝 [Tools Ref] Documenter `code_health(check='taint')` — params, output, exemples

### Code Intelligence Improvements
- [ ] 📝 [Features] Column-aware call resolution — distingue `db.query(escape(id))` inner/outer calls
- [ ] 📝 [Features] Property write classification — `data.id = value` correctement classifié comme write
- [ ] 📝 [Features] Taint result caching — optimisation performance pour CI/agent

### Project Management
- [ ] 📝 [Features] Namespace/name project naming — format `owner/repo` dérivé du git remote
- [ ] 📝 [Features] Cross-project search par namespace glob (`astix-io/*`, `oorabona/*`)
- [ ] 📝 [Features] Custom project names via `add_project(name: "custom/name")`
- [ ] 📝 [Features] Collision detection avec suggestions de noms

### Infrastructure
- [ ] 📝 [Features] Resumable indexing — reprise après restart (DB v37, reindex_sessions)
- [ ] 📝 [Features] Pre-commit hooks — nano-staged + simple-git-hooks (convention DX)

### Changelog
- [ ] 📝 [Blog/Changelog] Écrire le changelog de cette session (15+ commits, 5000+ lignes)

## Backlog

- [ ] 💡 [Pricing] Strategic review: self-hosted vs cloud axis, per-seat vs per-project, consultancy pricing, discount tiers
- [ ] 💡 [Blog] Rédiger les 3 posts de lancement (tutorial setup, benchmark agent comparison, thought leadership)
- [ ] 💡 [Tools Ref] Script de génération auto depuis les inputSchema zod dans astix/packages/mcp-server/src/tools/*.ts
- [ ] 💡 [Social Proof] Collecter témoignages design partners pour activer la section
- [ ] 💡 [Infra] Créer repo astix-io/infra avec Terraform Cloudflare (module cf-pages-site, DNS, workflows)
- [ ] 💡 [Analytics] Évaluer options : CF Web Analytics (gratuit, server-side) vs Umami/Plausible + consent banner vs aucun. Vérifier conformité ePrivacy/CNIL avant de choisir
