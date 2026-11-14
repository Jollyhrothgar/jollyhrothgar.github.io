// After `astro build`, prints the CV to two PDFs that the CV page links to:
//   /cv/Mike-Beaumier-CV.pdf      the CV page as it looks, through its print styles
//   /cv/Mike-Beaumier-CV-ATS.pdf  /cv/ats/, a plain page for applicant tracking systems
// It serves dist/ on a local port and prints with headless Chrome (set CHROME_PATH to use a
// particular binary). GitHub's ubuntu runners come with Chrome.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const PDFS = [
  { page: '/cv/', file: 'cv/Mike-Beaumier-CV.pdf' },
  { page: '/cv/ats/', file: 'cv/Mike-Beaumier-CV-ATS.pdf' },
];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
  ].filter(Boolean);
  return candidates.find((bin) =>
    bin.startsWith('/') ? existsSync(bin) : spawnSync('which', [bin]).status === 0,
  );
}

function run(bin, args) {
  return new Promise((resolve) => {
    const child = spawn(bin, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk) => (stderr += chunk));
    const timer = setTimeout(() => child.kill(), 60_000);
    child.on('close', (status) => {
      clearTimeout(timer);
      resolve({ status, stderr });
    });
  });
}

function serve(root) {
  const server = createServer((req, res) => {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    let file = join(root, path);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!file.startsWith(root) || !existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

export default function cvPdf() {
  return {
    name: 'cv-pdf',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const chrome = findChrome();
        if (!chrome) throw new Error('cv-pdf: Chrome not found; set CHROME_PATH');
        const root = fileURLToPath(dir);
        const server = await serve(root);
        const origin = `http://127.0.0.1:${server.address().port}`;
        try {
          for (const { page, file } of PDFS) {
            const out = join(root, file);
            // Async, because the server above runs in this process and needs the event loop
            const result = await run(chrome, [
              '--headless=new',
              '--disable-gpu',
              '--no-pdf-header-footer',
              // Leave the analytics tag unloaded, so printing isn't counted as a visit
              '--host-resolver-rules=MAP www.googletagmanager.com ~NOTFOUND, MAP *.google-analytics.com ~NOTFOUND',
              // Time for the web fonts to load
              '--virtual-time-budget=10000',
              `--print-to-pdf=${out}`,
              origin + page,
            ]);
            if (result.status !== 0 || !existsSync(out)) {
              throw new Error(`cv-pdf: printing ${page} failed\n${result.stderr}`);
            }
            logger.info(`${file} (${Math.round(statSync(out).size / 1024)} KB)`);
          }
        } finally {
          server.close();
        }
      },
    },
  };
}
