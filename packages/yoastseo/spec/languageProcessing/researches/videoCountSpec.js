import countVideoInText from "../../../src/languageProcessing/researches/videoCount.js";
import Paper from "../../../src/values/Paper";

describe( "Counts videos in an text", function() {
	it( "runs a check on a paper without a video present", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='' />" );

		expect( countVideoInText( paper ) ).toBe( 0 );
	} );

	it( "runs a check on a paper with a video", function() {
		const paper = new Paper( "string <video width=\"320\" height=\"240\" autoplay>\n" +
			"  <source src=\"movie.mp4\" type=\"video/mp4\">\n" +
			"  <source src=\"movie.ogg\" type=\"video/ogg\">\n" +
			"Your browser does not support the video tag.\n" +
			"</video>" );

		expect( countVideoInText( paper ) ).toBe( 1 );
	} );
} );
