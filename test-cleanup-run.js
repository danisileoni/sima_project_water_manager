const fs = require('fs');
const path = require('path');

// Simple implementation of the cleanupTempFiles method for testing
async function cleanupTempFiles(filePath, keepLastModified = false) {
  try {
    const tempDir = path.join(process.cwd(), 'dist', 'excel', 'tempfiles');
    
    // Verify if the directory exists
    if (!fs.existsSync(tempDir)) {
      console.log('⚠️ El directorio temporal no existe, creándolo...');
      await fs.promises.mkdir(tempDir, { recursive: true });
      console.log('✅ Directorio temporal creado exitosamente');
      return;
    }
    
    // Verify if it's a directory
    if (!fs.statSync(tempDir).isDirectory()) {
      console.error('❌ La ruta existe pero no es un directorio');
      return;
    }
    
    // If a specific file path is provided, delete only that file
    if (filePath) {
      if (fs.existsSync(filePath)) {
        console.log(`🗑️ Eliminando archivo temporal: ${filePath}`);
        try {
          await fs.promises.unlink(filePath);
          console.log(`✅ Archivo eliminado: ${filePath}`);
        } catch (unlinkError) {
          console.error(`❌ Error al eliminar archivo ${filePath}:`, unlinkError);
        }
      } else {
        console.log(`⚠️ El archivo especificado no existe: ${filePath}`);
      }
      return;
    }
    
    // Read files in the temporary directory
    let files;
    try {
      files = fs.readdirSync(tempDir);
    } catch (readError) {
      console.error('❌ Error al leer el directorio temporal:', readError);
      return;
    }
    
    if (files.length === 0) {
      console.log('📂 No hay archivos temporales para eliminar');
      return;
    }
    
    // Filter only files (not directories)
    const fileStats = [];
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          fileStats.push({
            name: file,
            path: filePath,
            mtime: stat.mtime
          });
        }
      } catch (statError) {
        console.error(`❌ Error al obtener información del archivo ${file}:`, statError);
      }
    }
    
    if (fileStats.length === 0) {
      console.log('📂 No hay archivos temporales para eliminar (solo directorios)');
      return;
    }
    
    // If keepLastModified is true, keep the most recently modified file
    if (keepLastModified && fileStats.length > 0) {
      // Sort by modification date (most recent first)
      fileStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      
      // Keep the most recent file and delete the rest
      const mostRecentFile = fileStats[0];
      console.log(`🔒 Manteniendo el archivo más reciente: ${mostRecentFile.name}`);
      
      let deletedCount = 0;
      for (let i = 1; i < fileStats.length; i++) {
        console.log(`🗑️ Eliminando archivo temporal: ${fileStats[i].name}`);
        try {
          await fs.promises.unlink(fileStats[i].path);
          deletedCount++;
        } catch (unlinkError) {
          console.error(`❌ Error al eliminar archivo ${fileStats[i].name}:`, unlinkError);
        }
      }
      
      console.log(`✅ Limpieza completada: ${deletedCount} archivos eliminados, 1 archivo mantenido`);
    } else {
      // Delete all files
      let deletedCount = 0;
      for (const fileStat of fileStats) {
        console.log(`🗑️ Eliminando archivo temporal: ${fileStat.name}`);
        try {
          await fs.promises.unlink(fileStat.path);
          deletedCount++;
        } catch (unlinkError) {
          console.error(`❌ Error al eliminar archivo ${fileStat.name}:`, unlinkError);
        }
      }
      
      console.log(`✅ Limpieza completada: ${deletedCount} archivos eliminados`);
    }
  } catch (error) {
    console.error('❌ Error al limpiar archivos temporales:', error);
  }
}

// Test 1: Keep the most recent file
async function testKeepMostRecent() {
  console.log('\n=== TEST 1: Keep most recent file ===');
  await cleanupTempFiles(null, true);
}

// Test 2: Delete all files
async function testDeleteAll() {
  console.log('\n=== TEST 2: Delete all files ===');
  await cleanupTempFiles();
}

// Test 3: Delete a specific file
async function testDeleteSpecific() {
  console.log('\n=== TEST 3: Delete specific file ===');
  const filePath = path.join(process.cwd(), 'dist', 'excel', 'tempfiles', 'test-file-1.txt');
  await cleanupTempFiles(filePath);
}

// Test 4: Try to delete a non-existent file
async function testDeleteNonExistent() {
  console.log('\n=== TEST 4: Delete non-existent file ===');
  const filePath = path.join(process.cwd(), 'dist', 'excel', 'tempfiles', 'non-existent-file.txt');
  await cleanupTempFiles(filePath);
}

// Run the tests
async function runTests() {
  // First, check what files we have
  const tempDir = path.join(process.cwd(), 'dist', 'excel', 'tempfiles');
  console.log('Current files in tempfiles directory:');
  const files = fs.readdirSync(tempDir);
  files.forEach(file => console.log(`- ${file}`));
  
  // Run Test 1
  await testKeepMostRecent();
  
  // Check files after Test 1
  console.log('\nFiles after Test 1:');
  const filesAfterTest1 = fs.readdirSync(tempDir);
  filesAfterTest1.forEach(file => console.log(`- ${file}`));
  
  // If we need to recreate files for Test 2, do it here
  if (filesAfterTest1.length < 2) {
    console.log('\nRecreating test files for Test 2...');
    for (let i = 1; i <= 3; i++) {
      const filePath = path.join(tempDir, `test-file-${i}.txt`);
      await fs.promises.writeFile(filePath, `Test content ${i}`);
    }
  }
  
  // Run Test 2
  await testDeleteAll();
  
  // Check files after Test 2
  console.log('\nFiles after Test 2:');
  try {
    const filesAfterTest2 = fs.readdirSync(tempDir);
    filesAfterTest2.forEach(file => console.log(`- ${file}`));
  } catch (err) {
    console.log('No files found or directory does not exist');
  }
  
  // Recreate files for Test 3
  console.log('\nRecreating test files for Test 3...');
  for (let i = 1; i <= 3; i++) {
    const filePath = path.join(tempDir, `test-file-${i}.txt`);
    await fs.promises.writeFile(filePath, `Test content ${i}`);
  }
  
  // Run Test 3
  await testDeleteSpecific();
  
  // Check files after Test 3
  console.log('\nFiles after Test 3:');
  const filesAfterTest3 = fs.readdirSync(tempDir);
  filesAfterTest3.forEach(file => console.log(`- ${file}`));
  
  // Run Test 4
  await testDeleteNonExistent();
  
  console.log('\nAll tests completed!');
}

// Run all tests
runTests()
  .then(() => console.log('Test script completed successfully'))
  .catch(err => console.error('Error during tests:', err));
