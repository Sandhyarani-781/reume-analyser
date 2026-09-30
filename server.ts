import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware for JSON and urlencoded
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check API
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Submit to n8n form or webhook endpoint
  app.post('/api/n8n/submit', async (req, res) => {
    try {
      const { targetUrl, payload, headers: customHeaders = {}, format = 'json' } = req.body;
      if (!targetUrl || typeof targetUrl !== 'string') {
        return res.status(400).json({ error: 'Valid targetUrl is required' });
      }

      const cleanUrl = targetUrl.trim();
      const startTime = Date.now();

      const fetchHeaders: Record<string, string> = {
        'Accept': 'application/json, text/html, */*',
        'User-Agent': 'n8n-Connect-Portal/1.0',
        ...customHeaders,
      };

      let bodyData: string | undefined;

      if (format === 'form-urlencoded') {
        const params = new URLSearchParams();
        Object.entries(payload || {}).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            params.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
          }
        });
        fetchHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
        bodyData = params.toString();
      } else {
        fetchHeaders['Content-Type'] = 'application/json';
        bodyData = JSON.stringify(payload || {});
      }

      const response = await fetch(cleanUrl, {
        method: 'POST',
        headers: fetchHeaders,
        body: bodyData,
      });

      const durationMs = Date.now() - startTime;
      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();

      let parsedData: any = text;
      try {
        if (contentType.includes('application/json')) {
          parsedData = JSON.parse(text);
        }
      } catch {
        // Keep as raw text
      }

      const isListeningPrompt = text.includes("Form Trigger isn't listening yet");

      return res.status(200).json({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        durationMs,
        contentType,
        data: parsedData,
        isListeningPrompt,
        rawSnippet: text.slice(0, 3000),
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to submit payload to n8n',
      });
    }
  });

  // Diagnostics check for n8n endpoint
  app.get('/api/n8n/check-status', async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
      }

      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/json,*/*',
          'User-Agent': 'n8n-Connect-Portal/1.0',
        },
      });
      const durationMs = Date.now() - startTime;
      const text = await response.text();

      const isListeningPrompt = text.includes("Form Trigger isn't listening yet");
      const titleMatch = text.match(/<title>(.*?)<\/title>/i);

      return res.json({
        status: response.status,
        statusText: response.statusText,
        durationMs,
        isListeningPrompt,
        title: titleMatch ? titleMatch[1] : null,
        isReady: response.ok && !isListeningPrompt,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure HTML proxy to bypass X-Frame-Options SAMEORIGIN for live n8n preview
  app.get('/api/n8n/proxy-view', async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) {
        return res.status(400).send('Missing target URL');
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      const html = await response.text();
      const parsedUrl = new URL(url);

      // Inject base tag for relative stylesheets and scripts
      const baseTag = `<base href="${parsedUrl.origin}/">`;
      let modifiedHtml = html;
      if (modifiedHtml.includes('<head>')) {
        modifiedHtml = modifiedHtml.replace('<head>', `<head>${baseTag}`);
      } else {
        modifiedHtml = `${baseTag}${modifiedHtml}`;
      }

      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(modifiedHtml);
    } catch (err: any) {
      return res.status(500).send(`Failed to proxy n8n: ${err.message}`);
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
