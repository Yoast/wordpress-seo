import excludeEstimatedReadingTime from "../../../../src/languageProcessing/helpers/sanitize/excludeEstimatedReadingTime.js";

describe( "Strips the estimated reading time from the analysis text.", function() {
	it( "returns a text without the estimated reading time", function() {
		const text = "<p class='yoast-reading-time__wrapper'>" +
			"<span class='yoast-reading-time__icon'><svg><path></path></svg></span>" +
			"<span class='yoast-reading-time__spacer' style='display:inline-block;width:1em'></span>" +
			"<span class='yoast-reading-time__descriptive-text'>Estimated reading time:  </span>" +
			"<span class='yoast-reading-time__reading-time'>2</span><span class='yoast-reading-time__time-unit'> minutes</span></p>" +
			"<p>For the first time in 70 years, India’s forests will be home to cheetahs.</p>" +
			"<p>Eight of them are set to arrive in August from Namibia, home to one of the world’s largest populations of the wild cat.</p>" +
			"<p>Their return comes decades after India’s indigenous population was declared officially extinct in 1952.</p>" +
			"<p>The world’s fastest land animal, the cheetah can reach speeds of 70 miles (113km) an hour.</p>";
		expect( excludeEstimatedReadingTime( text ) ).toEqual(
			"<p>For the first time in 70 years, India’s forests will be home to cheetahs.</p>" +
			"<p>Eight of them are set to arrive in August from Namibia, home to one of the world’s largest populations of the wild cat.</p>" +
			"<p>Their return comes decades after India’s indigenous population was declared officially extinct in 1952.</p>" +
			"<p>The world’s fastest land animal, the cheetah can reach speeds of 70 miles (113km) an hour.</p>" );
	} );
} );
