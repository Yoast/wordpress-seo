const buildOneFormFromRegex = require( "../../../js/morphology/morphoHelpers/buildFormRule" ).buildOneFormFromRegex;
const buildTwoFormsFromRegex = require( "../../../js/morphology/morphoHelpers/buildFormRule" ).buildTwoFormsFromRegex;


describe( "Test for making a form of a word based on a regex rule", function() {
	it( "returns the form of the word", function() {
		const regexRule = [
			{ reg: /(..)e$/i, repl: "$1ed" },
			{ reg: /(ae|ai|ao|au|ea|ee|eu|ie|io|oa|oe|oo|ou|oy|ua|ue|uo|uy)([bdfglmnpt])$/i, repl: "$1$2ed" },
			{ reg: /([aeiouy])([bdfglmnpt])$/i, repl: "$1$2$2ed" },
			{ reg: /(..)ed$/i, repl: "$1ed" },
			{ reg: /([bcdfghjklmnpqrstvwxz])y$/i, repl: "$1ied" },
			{ reg: /(.*)/i, repl: "$1ed" },
		];
		expect( buildOneFormFromRegex( "like", regexRule ) ).toEqual( "liked" );
		expect( buildOneFormFromRegex( "bread", regexRule ) ).toEqual( "breaded" );
		expect( buildOneFormFromRegex( "stop", regexRule ) ).toEqual( "stopped" );
		expect( buildOneFormFromRegex( "bully", regexRule ) ).toEqual( "bullied" );
		expect( buildOneFormFromRegex( "something", regexRule ) ).toEqual( "somethinged" );
	} );
} );

describe( "Test for making forms of a word based on a regex rule", function() {
	it( "returns the form of the word", function() {
		const regexRule = [
			{ reg: /(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)o$/i, repl1: "$1os", repl2: "$1oes" },
			{ reg: /(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)os$/i, repl1: "$1o", repl2: "$1oes" },
			{ reg: /(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)oes$/i, repl1: "$1o", repl2: "$1os" },
		];
		expect( buildTwoFormsFromRegex( "volcano", regexRule ) ).toEqual( [ "volcanos", "volcanoes" ] );
		expect( buildTwoFormsFromRegex( "volcanos", regexRule ) ).toEqual( [ "volcano", "volcanoes" ] );
		expect( buildTwoFormsFromRegex( "volcanoes", regexRule ) ).toEqual( [ "volcano", "volcanos" ] );
	} );
} );
