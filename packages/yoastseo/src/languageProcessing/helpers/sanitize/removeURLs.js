const urlRegex = new RegExp( "(ftp|http(s)?:\\/\\/.)(www\\\\.)?[-a-zA-Z0-9@:%._\\/+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:;%_\\/+.~#?&()=]*)" +
	"|www\\.[-a-zA-Z0-9@:%._\\/+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:;%_\\/+.~#?&()=]*)", "igm" );
/**
 * This regex is used to match URLs, whether they are embedded in tags or not.
 * It doesn't match domain names (e.g. "yoast.com" in "We got so much traffic on yoast.com after the latest release").
 *
 * @param {string} text The text to remove URLs from.
 *
 * @returns {string} The text without URLs.
 */
export default function( text ) {
	return text.replace( urlRegex, "" );
}
