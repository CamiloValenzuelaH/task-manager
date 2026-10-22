#!/usr/bin/env node
// Hook PostToolUse (Edit|Write): ejecuta `vitest related` sobre el archivo editado.
// Exit 0 = ok o no aplica · Exit 2 = tests fallidos (Claude recibe stderr y debe corregir).
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

let filePath = process.argv[2];
if (!filePath) {
  try {
    const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
    filePath = input.tool_input?.file_path;
  } catch {
    process.exit(0);
  }
}
if (!filePath) process.exit(0);

const rel = path.relative(root, path.resolve(filePath)).split(path.sep).join('/');
const match = rel.match(/^((?:apps|packages)\/[^/]+)\/(.+\.(?:ts|tsx))$/);
if (!match) process.exit(0); // solo código TS de los workspaces

const [, workspace, fileInWorkspace] = match;
const wsDir = path.join(root, workspace);
if (!existsSync(path.join(wsDir, 'package.json'))) process.exit(0);

const result = spawnSync(
  'npx',
  ['vitest', 'related', fileInWorkspace, '--run', '--passWithNoTests', '--reporter=dot'],
  { cwd: wsDir, encoding: 'utf8', shell: process.platform === 'win32', timeout: 120_000 },
);

if (result.status === 0) process.exit(0);

const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim().split('\n').slice(-60).join('\n');
process.stderr.write(`Tests relacionados con ${rel} fallaron (${workspace}):\n${output}\n`);
process.exit(2);
