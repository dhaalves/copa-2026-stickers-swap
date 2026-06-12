const { createCanvas } = require('canvas');
const fs = require('fs');

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#121214'; // App dark theme background
    ctx.fillRect(0, 0, size, size);

    // Emoji or Text
    ctx.font = `${size * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('⚽', size / 2, size / 2 + size * 0.05); // slight adjustment for emoji vertical alignment

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`icon-${size}.png`, buffer);
    console.log(`Created icon-${size}.png`);
}

createIcon(192);
createIcon(512);
