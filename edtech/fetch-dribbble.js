// fetch-dribbble.js
const https = require('https');

https.get('https://dribbble.com/shots/20668969-Edtech-Landing-Page', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https:\/\/cdn\.dribbble\.com\/userupload\/[^"&?]+/g);
    if (matches) {
      console.log('Found images:');
      const unique = [...new Set(matches)];
      unique.forEach(url => console.log(url));
    } else {
      console.log('No matches found');
    }
  });
}).on('error', (err) => {
  console.error(err);
});
