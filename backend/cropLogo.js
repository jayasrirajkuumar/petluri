const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../client/public/logo.jpg');
const outputPath = path.join(__dirname, '../client/public/logo-cropped.png'); // Save as PNG for potential transparency if needed later, though input is jpg

async function cropImage() {
    try {
        console.log(`Processing image: ${inputPath}`);

        if (!fs.existsSync(inputPath)) {
            console.error('Error: Input file not found!');
            return;
        }

        // Trim whitespace automatically
        await sharp(inputPath)
            .trim() // This trims pixels with similar color from the borders
            .toFile(outputPath);

        console.log(`Successfully cropped image to: ${outputPath}`);

        // Backup original
        fs.renameSync(inputPath, path.join(__dirname, '../client/public/logo-original.jpg'));

        // Replace original with cropped (renaming cropped to original name to avoid code changes)
        fs.renameSync(outputPath, inputPath);
        console.log(`Replaced original logo.jpg with cropped version.`);

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

cropImage();
