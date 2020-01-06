module.exports = [
	"last 1 Samsung versions",
	/*
	 * This is commented out because:
	 *
	 * The underlying library that babel uses to determine which features a
	 * browser supports doesn't have up-to-date data on default Android. Because
	 * that browser is based on Chromium it support everything Chrome supports.
	 * But the library doesn't report it like that so we need to omit this key
	 * from the browserslist.
	 *
	 * //  "last 1 Android versions",
	 */
	"last 1 ChromeAndroid versions",
	"last 2 Chrome versions",
	"last 2 Firefox versions",
	"last 2 Safari versions",
	"last 2 iOS versions",
	"last 2 Edge versions",
	"last 2 Opera versions",
];
