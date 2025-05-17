import { isPreceded, notPreceded, notFollowed, notPrecededAndNotFollowed } from "../../../../../src/scoring/assessments/inclusiveLanguage/helpers/createRuleDescriptions";

describe( "A test for creating assessment rule descriptions", function() {
	it( "should create a rule description for phrases that should be targeted only when preceded by specific words", function() {
		expect( isPreceded( [ "I am", "you are" ] ) ).toBe( "Targeted when preceded by 'I am', 'you are'." );
	} );
	it( "should create a rule description for phrases that should be targeted unless preceded by specific words", function() {
		expect( notPreceded( [ "I am", "you are" ] ) ).toBe( "Targeted unless preceded by 'I am', 'you are'." );
	} );
	it( "should create a rule description for phrases that should be targeted unless followed by specific words", function() {
		expect( notFollowed( [ "in college", "in high school" ] ) ).toBe( "Targeted unless followed by 'in college', 'in high school'." );
	} );
	it( "should create a rule description for phrases that should be targeted unless preceded and/or followed by specific words", function() {
		expect( notPrecededAndNotFollowed( [ "high school", "college" ], [ "in college", "in high school" ] ) ).toBe( "Targeted unless preceded by 'high school', 'college' and/or followed by 'in college', 'in high school'." );
	} );
} );
