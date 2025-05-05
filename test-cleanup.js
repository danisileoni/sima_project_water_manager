const fs = require('fs');
const path = require('path');

// Create test directory and files
async function setup() {
  const tempDir = path.join(process.cwd(), 'dist', 'excel', 'tempfiles');
  
  console.log('Setting up test environment...');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    console.log('Creating temp directory...');
    await fs.promises.mkdir(tempDir, { recursive: true });
  }
  
  // Create some test files
  for (let i = 1; i <= 3; i++) {
    const filePath = path.join(tempDir, `test-file-${i}.txt`);
    console.log(`Creating test file: ${filePath}`);
    await fs.promises.writeFile(filePath, `Test content ${i}`);
  }
  
  console.log('Setup complete. Files created:');
  const files = fs.readdirSync(tempDir);
  files.forEach(file => console.log(`- ${file}`));
}

// Run the setup
setup()
  .then(() => console.log('Test setup completed successfully'))
  .catch(err => console.error('Error during setup:', err));
