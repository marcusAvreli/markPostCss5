import fs from 'fs';
var path = require('path');
import CleanCSS from 'clean-css';
import minifyHTML from 'html-minifier';

import replaceStream from 'replacestream';
import { buildSassFile, buildHtmlFile, buildOutputFile, nodeSass, mkDir } from './fileUtils';

export default function templateRollupPlugin() {
  return {
    name: 'template-rollup-plugin',
    transform(content, filePath) {
      mkDir('dist');
	  console.log("filePath:"+filePath);
	  //const fileName = filePath.split('\\').pop().split('/').pop();
	  const fileName = path.parse(filePath).base;;
	  console.log("fileName:"+fileName);
	  
      const srcPath = filePath.substring(filePath.indexOf('src/'));
	  console.log("checkPost_1");
      const sassFile = buildSassFile(srcPath);
	  console.log("checkPost_2");
      const htmlFile = buildHtmlFile(srcPath);
	  console.log("checkPost_3:"+srcPath);
      const outputFile = buildOutputFile(srcPath);
	  console.log("checkPost_4: "+outputFile);
      let modifiedContent = content;
	  console.log("checkPost_5");
		if (fs.existsSync(htmlFile)) {
        const htmlData = fs.readFileSync(htmlFile, 'utf-8');

        let temp = '';

        if (fs.existsSync(sassFile)) {
          let render = nodeSass(sassFile);

          if (render && render.css) {
            temp = '<style>' + render.css.toString('utf8') + '</style>';
          }
        }

        const writeStream = fs.createWriteStream(outputFile);
        const tempHtml = temp + htmlData.replace(/\r?\n|\r|\t|\s\s+/g, '');
        fs.createReadStream(srcPath)
          .pipe(replaceStream('tempHtml;', '\`' + tempHtml + '\`;'))
          .pipe(replaceStream('this.html(tempHtml);', `this.html\`${tempHtml}\`;`))
          .pipe(writeStream);

        modifiedContent = modifiedContent
          .replace('tempHtml;', '\`' + tempHtml + '\`;')
          .replace('this.html(tempHtml);', `this.html\`${tempHtml}\``);
      } else {
        const writeStream = fs.createWriteStream(outputFile);
        fs.createReadStream(srcPath)
          .pipe(writeStream);
      }

      return modifiedContent;
    }
    
  };
}