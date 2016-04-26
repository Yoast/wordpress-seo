module.exports = function( paper ) {
	var text = paper.getText();
	text = text.replace ( "|", "" );
	text = text.replace ( /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig, "|" );
	return text.split ( "|" );
};

/*
matching this in a regex is pretty hard, since we need to find a way for matching the text after a heading, and before the end of the text.
 The hard thing capturing this is with a capture, it captures the next subheading as well, so it skips the next part of the text, since the subheading is already matched.

For now we use this method to be sure we capture the right blocks of text
 */
