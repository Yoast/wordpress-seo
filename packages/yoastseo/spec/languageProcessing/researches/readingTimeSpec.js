import readingTime from "../../../src/languageProcessing/researches/readingTime.js";
import Paper from "../../../src/values/Paper.js";

describe( "Calculates the reading time for the paper (rounded up to the next highest full minute)", function() {
	it( "calculates the reading time for a paper with a short text", function() {
		const mockPaper = new Paper( "This is a short text" );
		expect( readingTime( mockPaper ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper in English with a long text", function() {
		const mockPaper = new Paper( "This is a long text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, " +
			"gravida consectetur metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, " +
			"tincidunt pharetra ipsum. Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel " +
			"tempus accumsan. Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, " +
			"a pretium eros interdum ac. Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. " +
			"Mauris iaculis mollis tortor vel sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. " +
			"Suspendisse potenti. Maecenas malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, " +
			"gravida consectetur metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt " +
			"pharetra ipsum. Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. " +
			"Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. " +
			"Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor vel " +
			"sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada.",
		{ locale: "en_US" } );
		expect( readingTime( mockPaper ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper with a short text with images", function() {
		const mockPaper = new Paper( "This is a short text with images <img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' alt='2' />" );
		expect( readingTime( mockPaper ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper with a long text with images", function() {
		const mockPaper = new Paper( "This is a long text with images. <img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' " +
			"alt='2' /> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. " +
			"Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. Donec aliquet " +
			"mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. Aenean non placerat arcu. " +
			"Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. Pellentesque est metus, " +
			"fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor vel sodales. Aenean " +
			"vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada. Lorem ipsum dolor " +
			"sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. Interdum et malesuada fames ac ante " +
			"ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. Donec aliquet mauris eu est accumsan, vitae finibus " +
			"purus imperdiet. Donec mollis diam vel tempus accumsan. Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. " +
			"Phasellus gravida consequat leo, a pretium eros interdum ac. Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. " +
			"Suspendisse potenti. Mauris iaculis mollis tortor vel sodales. Aenean vulputate mauris augue. In et lorem at velit " +
			"sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada." );
		expect( readingTime( mockPaper ) ).toEqual( 2 );
	} );

	it( "calculates the reading time for a paper in English with a long text with many images", function() {
		const mockPaper = new Paper( "This is a long text with many images. <img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' " +
			"alt='2' /> <img src='http://plaatje3' alt='3' /> <img src='http://plaatje4' alt='4' /> <img src='http://plaatje5' " +
			"alt='5' />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. " +
			"Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. " +
			"Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. Aenean " +
			"non placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. " +
			"Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor vel " +
			"sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada. " +
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. " +
			"Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. " +
			"Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. Aenean non " +
			"placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. " +
			"Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor " +
			"vel sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada.",
		{ locale: "en_US" } );
		expect( readingTime( mockPaper ) ).toEqual( 2 );
	} );
} );
