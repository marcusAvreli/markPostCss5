//import { plugins } from './rollup-config/plugins.js';
//import { getModules } from './rollup-config/getModules.js';
//https://github.com/vuetifyjs/vuetify/blob/d1251f50f2d85b34c06c65895bd2d2b82bdd412e/packages/vuetify/build/rollup.config.mjs#L8
//https://github.com/telus/tds-community/blob/master/config/styleguide.config.js#L247
const packageJson = require('./package.json')
import string from 'rollup-plugin-string'
//import scss from './rollup-plugin-scss-inline'
import babel from 'rollup-plugin-babel'
import autoprefixer from 'autoprefixer'
//import postcss from 'postcss'
import templateRollupPlugin from './scripts/templateRollupPlugin.js';
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve';
import cssimport from 'postcss-import';
import { terser } from 'rollup-plugin-terser';
import { plugins } from './rollup-config/plugins.js';
import { getModules } from './rollup-config/getModules.js';
let dev = process.env.NODE_ENV == 'local';

const modules = !dev ? getModules() : [];

const sassRender = (content, id) => new Promise((resolve, reject) => {
	console.log("id:"+id);
	const result = sass.renderSync({file: id});
	resolve({code: result.css.toString()});
});


export default [
	{
		input: './src/index.js',
		 output: {
    format: 'umd',
	 file: packageJson.main,
	name : 'testzoo'
  },
		plugins: plugins
	},
	...modules
];
//https://github.com/lipp/shell/blob/c076cd2ae4717b49fd5c8503820d34634bcf902b/src/rollup.config.js