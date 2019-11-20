const path = require('path')

module.exports = {
	entry: './src/main.ts',
	output: {
		filename: 'commercelayer.min.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: 'dist/'
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
		modules: ['node_modules', path.resolve(__dirname, 'src')],
		symlinks: false
	},
	module: {
		rules: [
			{
				test: /\.m?(js|ts)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: ['@babel/plugin-proposal-object-rest-spread']
						}
					},
					{
						loader: 'ts-loader'
					}
				]
			}
		]
	}
}
