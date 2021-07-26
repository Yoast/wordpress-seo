/**
 * Checks the amount of videos in the text.
 *
 * @param {Paper} paper The paper to check for videos.
 *
 * @returns {number} The amount of found videos.
 */
export default function countVideoInText( paper ) {
	const videoTag = new RegExp( "(<video).*?(</video>)", "igs" );

	// Match videos occurrences in the text and save the matches in an array.
	let videoMatches = paper.getText().match( videoTag );

	// If no matches found, assign an empty array.
	if ( videoMatches === null ) {
		videoMatches = [];
	}

	return videoMatches.length;
}
