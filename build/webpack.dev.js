const merge = require('webpack-merge');
const Product = require('../');
const http = require('http');

const { webpack: base, callback } = Product.create();

const port = http.createServer(callback).listen();

module.exports = merge(base, {
	mode: 'development',
	devServer: {
		proxy: {
			'^/api': 'http://localhost:3000'
		}
	}
});