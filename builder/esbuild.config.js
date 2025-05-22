import path from 'node:path';
import { build, context } from 'esbuild'; 
import generateManifest from './generateManifest.js';
 
// Working dir
const workspace = process.cwd(); 
const isProd = process.env.NODE_ENV === "production";

// Server bundle configuration
export const serverConfig = {
  bundle: true,
  platform: 'node', 
  format: 'esm',        // Support esm packages
  packages: 'external', // Omit node packages from our node bundle
  logLevel: 'error',
  sourcemap: 'external',
  minify: isProd,
  entryPoints: {
    server: path.join(workspace, 'server', 'index.ts') // Express app
  },
  tsconfig: path.join(workspace, 'tsconfig.json'),
  outdir: path.join(workspace, 'dist')
};

// Client bundle configuration
export const clientConfig = {
  bundle: true,
  platform: 'browser',
  format: 'esm',
  sourcemap: 'external',
  logLevel: 'error',
  minify: isProd,
  tsconfig: path.join(workspace, 'tsconfig.json'),
  entryPoints: {
    index: path.join(workspace, 'client', 'entry.tsx'), // Client react app
    style: path.join(workspace, 'client', 'global.css')  // Stylesheet
  },
  outdir: path.join(workspace, 'dist', 'static'),    // Served as /static by express
}; 

// build process
async function bundle() {
  await generateManifest();
  
  if (isProd) {
    //serverContext Build server
    await build(serverConfig);
  
    // Build client
    await build(clientConfig);
  } else {
    // Build client in watch mode
    const clientContext = await context(clientConfig);
    clientContext.watch();
    console.log("watching client...")
  } 
} 

bundle();
