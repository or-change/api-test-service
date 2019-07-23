const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const config = require('./.config.json');
const { webpack: base } = require('./product');

module.exports = merge(base, {
	mode: 'development',
	devtool: '#inline-source-map',
	devServer: {
		proxy: {
			'/api': `http://localhost:${config.server.port}`
		},
		port: config.devServer.port
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, './index.html'),
			inject: 'head'
		})
	]
});