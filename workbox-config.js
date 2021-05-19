module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.html'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'build/sw.js'
};