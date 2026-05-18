const fs = require('fs');
const path = '.';

function generateExports() {
  const files = fs.readdirSync(path).filter(file =>
    file.endsWith('.js') && file !== 'index.js' && file !== 'generateIndex.js'
  );

  const lines = files.map(file => {
    const name = file.replace('.js', '');
    return `export { default as ${name} } from './${name}';`;
  });

  fs.writeFileSync(`${path}/index.js`, lines.join('\n') + '\n');
  console.log('index.js generated with exports for:', files);
}

// Run the function if this script is executed directly
if (require.main === module) {
  generateExports();
}