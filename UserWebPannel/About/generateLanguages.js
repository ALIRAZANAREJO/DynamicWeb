const fs = require('fs');
const csv = require('csv-parser');

const languages = [];

fs.createReadStream('iso-639-3.csv') // Make sure the CSV file is in the same folder
  .pipe(csv())
  .on('data', (row) => {
    // Add only the language name in quotes
    languages.push(`"${row.Ref_Name}"`);
  })
  .on('end', () => {
    const languagesText = languages.join(',');
    
    // Save to a JS file
    fs.writeFileSync('languages_list.js', `const languages = [${languagesText}];\nexport default languages;`);
    
    console.log('Languages list saved to languages_list.js');
  });
