import fs from 'fs';
var path = require('path');
import CleanCSS from 'clean-css';
import minifyHTML from 'html-minifier';
import { buildSassFile, buildHtmlFile, buildOutputFile, nodeSass, mkDir } from './fileUtils';
export default function injectInnerHTML() {
	return {
		name: 'injectInnerHTML',

		transform(code, id) {
			
			const fileName = path.parse(id).base;
			
			if(fileName == 'index.scss'){
				console.log("fileName:"+fileName);	
				let render = nodeSass(id);				
				const cssString = render.css;
				const minifiedCss = new CleanCSS({ level: { 2: { all: true } } }).minify(cssString);
				code = minifiedCss.styles;
				console.log("code:"+code);
			}
			if (code.indexOf('@injectHTML') > -1) { 			
				console.log("start processing");
				const htmlFile = id.replace('.js', '.html');
				const scssFile = id.replace('.js', '.scss');
				let render = nodeSass(scssFile);				
				const cssString = render.css;
				const minifiedCss = new CleanCSS({ level: { 2: { all: true } } }).minify(cssString);				
				const html = fs.readFileSync(htmlFile, 'utf8');
				const minifiedHTML = minifyHTML.minify(html, {collapseWhitespace: true, collapseBooleanAttributes: true});				
				
				code = code.replace('super();', `super();this.attachShadow({mode:'open'}).innerHTML=\`<style>${minifiedCss.styles}</style>${minifiedHTML}\`;`);
				
			
			}
			console.log(typeof code);
			return {
				code: code,
				map: null
			};
		}
	};
}