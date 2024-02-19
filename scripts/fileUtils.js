import sass from 'node-sass';
import mkdirp from 'mkdirp';

export function buildSassFile(fileName) {
	console.log("buildSassFile:"+fileName);
  const srcIndex = fileName.indexOf('src');
  console.log("buildSassFile_1");
  const partFile = fileName.substring(srcIndex);
  console.log("buildSassFile_2");
  return partFile.replace('.js', '.scss');
}

export function buildHtmlFile(fileName) {
  const srcIndex = fileName.indexOf('src');
  const partFile = fileName.substring(srcIndex);
  return partFile.replace('.js', '.html');
}

export function buildOutputFile(fileName) {
  const srcIndex = fileName.lastIndexOf('\\');
  console.log("src_index:"+srcIndex);
  const partFile = fileName.substring(srcIndex);
  console.log("partFile:"+partFile);
  const directory = fileName.substring(fileName.indexOf('\\')).replace(partFile, '');
  console.log("directory:"+directory);
  mkDir(`dist${directory}`);
  return `dist${directory}${partFile}`;
}

export function nodeSass(file) {
	console.log("nodeSass:"+file);
  return sass.renderSync({
    file,
    outputStyle: 'compressed',
    quiet: true
  });
}

export function mkDir(dir) {
  return mkdirp.sync(dir);
}