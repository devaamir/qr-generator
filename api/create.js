const QRCode = require('qrcode');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { ios, android } = req.body;

  if (!ios || !android) {
    return res.status(400).json({ error: 'Both App Store and Play Store URLs are required.' });
  }

  try {
    new URL(ios);
    new URL(android);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format.' });
  }

  // Encode URLs into the redirect link — no database needed
  const i = Buffer.from(ios).toString('base64url');
  const a = Buffer.from(android).toString('base64url');

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || (req.headers.host?.startsWith('localhost') ? 'http' : 'https');
  const redirectUrl = `${proto}://${host}/api/r?i=${i}&a=${a}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(redirectUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' },
    });
    res.status(200).json({ redirectUrl, qrDataUrl });
  } catch {
    res.status(500).json({ error: 'Failed to generate QR code.' });
  }
};
