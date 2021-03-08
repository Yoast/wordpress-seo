import { buildOneFormFromRegex } from "../../../src/morphology/morphoHelpers/buildFormRule";

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
