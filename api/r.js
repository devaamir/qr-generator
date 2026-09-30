module.exports = (req, res) => {
  const { i, a } = req.query;

  if (!i || !a) {
    return res.status(400).send('Invalid link.');
  }

  let ios, android;
  try {
    ios = Buffer.from(i, 'base64url').toString('utf-8');
    android = Buffer.from(a, 'base64url').toString('utf-8');
    new URL(ios);
    new URL(android);
  } catch {
    return res.status(400).send('Malformed link.');
  }

  const ua = req.headers['user-agent'] || '';
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  if (isIOS) return res.redirect(ios);
  if (isAndroid) return res.redirect(android);

  // Desktop fallback
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download the App</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%); display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    .card { background: white; border-radius: 24px; padding: 40px; text-align: center; max-width: 380px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    h1 { font-size: 1.4rem; color: #1a1a2e; margin-bottom: 8px; font-weight: 700; }
    p { color: #888; margin-bottom: 32px; font-size: 0.9rem; }
    .btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 16px; border-radius: 14px; text-decoration: none; font-size: 1rem; font-weight: 600; margin-bottom: 12px; transition: opacity 0.2s, transform 0.1s; }
    .btn:hover { opacity: 0.88; transform: scale(0.99); }
    .ios { background: #000; color: white; }
    .android { background: #01875f; color: white; }
    .btn-label { display: flex; flex-direction: column; align-items: flex-start; }
    .btn-sub { font-size: 0.72rem; font-weight: 400; opacity: 0.7; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Download the App</h1>
    <p>Choose your platform to get started</p>
    <a class="btn ios" href="${ios}">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
      <span class="btn-label">
        <span>App Store</span>
        <span class="btn-sub">iPhone &amp; iPad</span>
      </span>
    </a>
    <a class="btn android" href="${android}">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.341a.513.513 0 01-.513.513.513.513 0 01-.513-.513V9.949a.513.513 0 01.513-.513.513.513 0 01.513.513v5.392zm-10.046 0a.513.513 0 01-.513.513.513.513 0 01-.513-.513V9.949a.513.513 0 01.513-.513.513.513 0 01.513.513v5.392zM6.441 7.836h11.118v7.937c0 .554-.451 1.005-1.005 1.005H7.446c-.554 0-1.005-.451-1.005-1.005V7.836zM8.96 3.798l-.92-1.594a.177.177 0 00-.242-.065.177.177 0 00-.065.242l.932 1.614A6.2 6.2 0 005.5 7.324h13c-.598-1.36-1.746-2.42-3.165-3.029l.932-1.614a.177.177 0 00-.065-.242.177.177 0 00-.242.065L15.04 3.798A6.29 6.29 0 0012 3.168c-1.12 0-2.173.296-3.04.63zm2.032 1.405a.51.51 0 110-1.02.51.51 0 010 1.02zm2.016 0a.51.51 0 110-1.02.51.51 0 010 1.02z"/></svg>
      <span class="btn-label">
        <span>Google Play</span>
        <span class="btn-sub">Android</span>
      </span>
    </a>
  </div>
</body>
</html>`);
};
