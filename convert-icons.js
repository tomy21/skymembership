const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'src/icons'); // Sesuaikan path folder icon kamu

fs.readdirSync(iconsDir).forEach(file => {
    if (path.extname(file) === '.svg') {
        const filePath = path.join(iconsDir, file);
        const fileName = path.basename(file, '.svg');
        const componentName = fileName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Icon';

        const svgContent = fs.readFileSync(filePath, 'utf8');
        // Bersihkan SVG agar kompatibel dengan JSX
        const jsxSvg = svgContent
            .replace(/class=/g, 'className=')
            .replace(/for=/g, 'htmlFor=')
            .replace(/stroke-width=/g, 'strokeWidth=')
            .replace(/stroke-linecap=/g, 'strokeLinecap=')
            .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
            .replace(/fill-rule=/g, 'fillRule=')
            .replace(/clip-rule=/g, 'clipRule=');

        const template = `
import React from "react";

export default function ${componentName}({ className = "" }: { className?: string }) {
  return (
    ${jsxSvg.replace('<svg', `<svg className={className}`)}
  );
}
    `;

        fs.writeFileSync(path.join(iconsDir, `${componentName}.tsx`), template.trim());
        console.log(`Converted: ${file} -> ${componentName}.tsx`);
    }
});