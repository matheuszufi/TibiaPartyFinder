// API route para servir ads.txt como backup
export default function handler(req, res) {
  // Set headers
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  // Return ads.txt content
  res.status(200).send('google.com, pub-6720862201860122, DIRECT, f08c47fec0942fa0');
}
