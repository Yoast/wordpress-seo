var getReadingTime = require( "../../js/researches/getReadingTime.js" );
var Paper = require( "../../js/values/Paper.js" );

describe("Calculates the reading time for the paper", function(){
	it("calculates the reading time (rounded to minutes) for a paper with a short text text", function() {
		let mockPaper = new Paper( "This is a short text" );
		expect( getReadingTime( mockPaper ) ).toEqual( 0 );
	});

	it("calculates the reading time (rounded to minutes) for a paper with a long text text", function() {
		let mockPaper = new Paper( "This is a long text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor vel sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada." );
		expect( getReadingTime( mockPaper ) ).toEqual( 1 );
	});

	it("calculates the reading time (rounded to minutes) for a paper with a short text and images", function() {
		let mockPaper = new Paper( "This is a short text with images <img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' alt='2' />" );
		expect( getReadingTime( mockPaper ) ).toEqual( 0 );
	});

	it("calculates the reading time (rounded to minutes) for a paper with a long text with images", function() {
		let mockPaper = new Paper( "This is a long text with images. <img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' alt='2' /> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor vel sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada." );
		expect( getReadingTime( mockPaper ) ).toEqual( 1 );
	});
});

