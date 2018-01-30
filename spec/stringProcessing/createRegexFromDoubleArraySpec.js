var regexToDoubleArray = require( "../../js/stringProcessing/createRegexFromDoubleArray.js" );

describe("a test creating a regex from an array with arrays.", function(){
	it("matches a sentence containing one of the word combinations", function(){
		expect( "I like both pie, cupcakes and pudding, or cake. " ).toMatch( regexToDoubleArray( [["both","and","or"], ["not", "but"]] ) );
	});
	it("matches a sentence containing two of the word combinations.", function(){
		expect( "Not only does he like pie, but also cupcakes, pudding and cake. ").toMatch( regexToDoubleArray( [["both","and","or"],
			["not", "but"]] ) );
	});
	it("does not match a sentence containing none of the word combinations.", function(){
		expect( "I like pie." ).not.toMatch( regexToDoubleArray( [["both","and","or"], ["not", "but"]] ) );
	});
	it("does not match a sentence containing only one of the parts of the word combinations.", function(){
		expect( "I like pie and cake." ).not.toMatch( regexToDoubleArray( [["both","and","or"], ["not", "but"]] ) );
	});
	it("does not match a sentence containing the pieces of on of the word combinations in the wrong order.", function(){
		expect( "I like pie and cake or pudding, they both are delicious." ).not.toMatch( regexToDoubleArray( [["both","and","or"],
			["not", "but"]] ) );
	});
});
