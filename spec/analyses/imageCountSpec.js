var imageCountFunction = require( "../../js/analyses/getImageStatistics.js" );
var imageCount;

describe( "Counts images in an text", function(){
	it( "returns object with the imagecount", function(){
		imageCount = imageCountFunction( "string <img src='http://plaatje' alt='keyword' />", "keyword" );
		expect( imageCount.altKeyword ).toBe( 1 );
		expect( imageCount.total ).toBe( 1 );
		expect( imageCount.noAlt ).toBe( 0 );

		imageCount = imageCountFunction( "string <img src='http://plaatje' alt='keyword' />", "" );
		expect( imageCount.noAlt ).toBe( 0 );
		expect( imageCount.altNaKeyword ).toBe( 1 );

		imageCount = imageCountFunction( "<img src='http://picture.com' alt='текст' />", "текст");
		expect( imageCount.altKeyword ).toBe( 1 );

		imageCount = imageCountFunction( "<img src='http://picture.com' alt='maïs' />", "maïs");
		expect( imageCount.altKeyword ).toBe( 1 );

		imageCount = imageCountFunction( '<img src="http://picture.com" alt="Yoast\'s analyzer" />', "Yoast's analyzer" );
		expect( imageCount.altKeyword ).toBe( 1 );

		imageCount = imageCountFunction(
			"<img src='' alt='something' />" +
			"<img src='' />" +
			"<img src='' />"
		, "keyword" );
		expect( imageCount ).toEqual({
			total: 3,
			alt: 1,
			noAlt: 2,
			altKeyword: 0,
			altNaKeyword: 0
		});

		imageCount = imageCountFunction(
			"<img src='http://google.com/keyword' alt='hi' />",
			"keyword"
		);
		expect( imageCount.altKeyword ).toBe( 0 );

		imageCount = imageCountFunction( '<img src="http://picture.com" alt="key-word" />', "key-word");
		expect( imageCount.altKeyword ).toBe( 1 );

		imageCount = imageCountFunction( '<img src="http://picture.com" alt="key word" />', "key-word");
		expect( imageCount.altKeyword ).toBe( 0 );

		imageCount = imageCountFunction( '<img src="http://picture.com" alt="key_word" />', "key_word");
		expect( imageCount.altKeyword ).toBe( 1 );

		imageCount = imageCountFunction( '<img src="http://picture.com" alt="key_word" />', "key word");
		expect( imageCount.altKeyword ).toBe( 0 );
	})
});
