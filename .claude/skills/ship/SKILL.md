---
name: ship
description: Revisa git status, ejecuta los tests, crea un commit estructurado (Conventional Commits) y gestiona las ramas de Git. Úsala para cerrar una unidad de trabajo o cuando el usuario pida hacer commit, crear o cambiar de rama, o hacer merge.
argument-hint: '[mensaje o alcance opcional]'
disable-model-invocation: true
---

# /ship

Modelo de ramas completo: `vault/git-branches.md` ([[git-branches]]). Resumen: `main` = estable, `develop` = desarrollo, y las ramas de trabajo salen de `develop` y vuelven a `develop`.

## 1. Revisar

- `git status`, `git diff` y `git diff --staged`.
- Detén el proceso y avisa si aparecen secretos o archivos que no deben ir al repo: `.env*`, `*.db`, `node_modules`, credenciales, archivos grandes o binarios.
- Si hay cambios mezclados de temas distintos, propón dividirlos en varios commits.

## 2. Tests

- Ejecuta la skill `test` (suite completa) y `npm run lint && npm run typecheck`.
- **Si algo falla, no hagas commit.** Informa y corrige primero.

## 3. Rama

- Rama actual: `git branch --show-current`.
- Si es `main` o `develop`, **no hagas commit ahí**: crea una rama desde `develop` con `git switch -c <tipo>/<slug-kebab> develop`, con tipo `feat | fix | chore | docs | refactor | test` (`hotfix/` sale de `main`). Los cambios sin commit se mueven con la rama.
- Si ya estás en una rama de trabajo cuyo tema coincide, úsala.

## 4. Commit

- Haz `git add` de archivos concretos (no `git add -A` a ciegas).
- Mensaje con Conventional Commits:

```
<tipo>(<scope>): <resumen imperativo, ≤72 caracteres>

<qué cambia y por qué; reglas o ADRs afectados (R1, ADR-0004)>

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

- Scopes: `shared`, `api`, `web`, `db`, `tasks`, `projects`, `tags`, `vault`, `config`.
- Usa un heredoc para pasar el mensaje. Nunca uses `--no-verify` ni `--amend` sobre commits ajenos.

## 5. Integrar (siempre con confirmación)

Muestra el resumen (rama, hash y mensaje, archivos) y **pregunta** antes de cualquiera de estas acciones:

- Merge a `develop` (lo normal): `git switch develop && git merge --no-ff <rama>`.
- Release a `main` (solo desde `develop`, con `npm run check` en verde): `git switch main && git merge --no-ff develop` y, opcionalmente, `git tag vX.Y.Z`.
- `hotfix/*`: merge a `main` **y** a `develop`.
- Push: `git push -u origin <rama>`. El remoto `origin` es `https://github.com/CamiloValenzuelaH/task-manager` (**público**). Antes de cada push:
  1. `git remote -v` para confirmar que `origin` es ese repo y `git status` limpio.
  2. Revisa los commits que se van a publicar (`git log @{u}..` o `git log origin/develop..HEAD`) y busca secretos en el diff (claves, tokens, `.env`, `*.db`); si hay alguno, detente.
  3. Nunca `--force`. Publica solo las ramas que el usuario indique (`main`, `develop`, la rama de trabajo).
  4. Con CI o protección de ramas activas se prefiere abrir un PR contra `develop` (`gh` no está instalado: se abre desde la web de GitHub).
- Borrar la rama ya integrada: `git branch -d <rama>` (y en el remoto, `git push origin --delete <rama>`, solo con confirmación).

Nunca hagas `push --force`, `reset --hard` ni rebase sobre `main`/`develop` sin petición explícita. Si el modelo de ramas cambia, actualiza `vault/git-branches.md`.
