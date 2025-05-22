import chokidar from 'chokidar';
import generateRoutes from './generateManifest'; // your manifest builder
import path from 'path';

const WATCH_DIRS = [
  path.join(process.cwd(), 'client/(pages)'),
  path.join(process.cwd(), 'client/(admin)'),
];

// Regex to match only valid route files
const FILE_MATCH_REGEX = /(?:^|\/)(layout|page)\.(tsx?|jsx?)$/i;

function shouldTrack(filePath) {
  return FILE_MATCH_REGEX.test(filePath.replace(/\\/g, '/'));
}

export const watcher = chokidar.watch(WATCH_DIRS, {
  ignored: /(^|[/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 10,
  },
});

function tryRebuild(filePath, label) {
  if (!shouldTrack(filePath)) return;
  console.log(`[ROUTER] ${label}: ${filePath}`);
  generateRoutes();
}

// Watch only specific file events
watcher
  .on('add', filePath => tryRebuild(filePath, 'File added'))
  .on('unlink', filePath => tryRebuild(filePath, 'File removed'));

// Optional: watch for directory creation/removal (only if needed)
watcher
  .on('addDir', dirPath => console.log(`[ROUTER] Directory added: ${dirPath}`))
  .on('unlinkDir', dirPath => console.log(`[ROUTER] Directory removed: ${dirPath}`));

