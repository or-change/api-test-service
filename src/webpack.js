const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const BABEL_CONFIG = {

};

module.exports = function WebpackBase(entryList, publicPath) {
	return {
		entry: {
			bundle: entryList
		},
		output: {
			filename: '[name].js',
			path: path.resolve('output/.public'),
			publicPath
		},
		target: 'web',
		resolve: {
			extensions: ['.js', '.vue']
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						loaders: {
							scss: 'style-loader!css-loader!sass-loader'
						}
					}
				},
				{
					test: /\.js$/,
					exclude: /node_module/,
					loader: 'babel-loader'
				},
				{
					test: /\.js$/,
					include: /fabric-ui/,
					loader: 'babel-loader'
				},
				{
					test: /\.(eot|woff|woff2|svg|ttf)$/,
					loader: 'file-loader'
				},
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
				},
				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract(['css-loader'])
				}
			]
		},
		plugins: [
			new VueLoaderPlugin()
		],
		optimization: {
			splitChunks: {
				name: true,
				cacheGroups: {
					commons: {
						test: /node_modules/,
						name: 'vendors',
						chunks: 'all'
					}
				},
			}
		},
		node: false
	};
};