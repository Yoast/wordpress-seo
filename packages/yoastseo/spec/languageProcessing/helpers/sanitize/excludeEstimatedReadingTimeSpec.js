import excludeEstimatedReadingTime from "../../../../src/languageProcessing/helpers/sanitize/excludeEstimatedReadingTime.js";

describe( "Strips the estimated reading time from the analysis text.", function() {
	it( "returns a text without the estimated reading time", function() {
		const text = "<p class='yoast-reading-time__wrapper'><span class='yoast-reading-time__icon'><svg aria-hidden='true' focusable='false' data-icon='clock' width='20' height='20' fill='none' stroke='currentColor' style='display:inline-block;vertical-align:-0.1em' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'></path></svg></span><span class='yoast-reading-time__spacer' style='display:inline-block;width:1em'></span><span class='yoast-reading-time__descriptive-text'>Estimated reading time:  </span><span class='yoast-reading-time__reading-time'>2</span><span class='yoast-reading-time__time-unit'> minutes</span></p>\n" +
			"<p>For the first time in 70 years, India’s forests will be home to cheetahs.</strong></p>\n" +
			"<p>Eight of them are set to arrive in August from Namibia, home to one of the world’s largest populations of the wild cat.</p>\n" +
			"<p>Their return comes decades after India’s indigenous population was declared officially extinct in 1952.</p>\n" +
			"<p>The world’s fastest land animal, the cheetah can reach speeds of 70 miles (113km) an hour.</p>\n";
		expect( excludeEstimatedReadingTime( text ) ).toEqual( "<p>For the first time in 70 years, India’s forests will be home to cheetahs.</strong></p>\n" +
			"<p>Eight of them are set to arrive in August from Namibia, home to one of the world’s largest populations of the wild cat.</p>\n" +
			"<p>Their return comes decades after India’s indigenous population was declared officially extinct in 1952.</p>\n" +
			"<p>The world’s fastest land animal, the cheetah can reach speeds of 70 miles (113km) an hour.</p>" );
	} );
} );
