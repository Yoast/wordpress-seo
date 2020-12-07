import { createSingleRuleFromArray,
	createRulesFromArrays } from "../../../../src/languageProcessing/helpers/morphology/createRulesFromArrays";

describe( "Test for creating regex-based rules for arrays of strings", function() {
	it( "returns an array of pairs `reg` and `repl`", function() {
		const inputArray = [
			[ "(..)e$", "$1ed" ],
			[ "(ae|ai|ao|au|ea|ee|eu|ie|io|oa|oe|oo|ou|oy|ua|ue|uo|uy)([bdfglmnpt])$", "$1$2ed" ],
			[ "([aeiouy])([bdfglmnpt])$", "$1$2$2ed" ],
			[ "(..)ed$", "$1ed" ],
			[ "([bcdfghjklmnpqrstvwxz])y$", "$1ied" ],
			[ "(.*)", "$1ed" ],
		];
		const outputArray = [
			{ reg: /(..)e$/i, repl: "$1ed" },
			{ reg: /(ae|ai|ao|au|ea|ee|eu|ie|io|oa|oe|oo|ou|oy|ua|ue|uo|uy)([bdfglmnpt])$/i, repl: "$1$2ed" },
			{ reg: /([aeiouy])([bdfglmnpt])$/i, repl: "$1$2$2ed" },
			{ reg: /(..)ed$/i, repl: "$1ed" },
			{ reg: /([bcdfghjklmnpqrstvwxz])y$/i, repl: "$1ied" },
			{ reg: /(.*)/i, repl: "$1ed" },
		];
		expect( createRulesFromArrays( inputArray ) ).toEqual( outputArray );
	} );

	it( "returns an array of triplets `reg`, `repl1` and `repl2`", function() {
		const inputArray = [
			[ "(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)o$", "$1os", "$1oes" ],
			[ "(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)os$", "$1o", "$1oes" ],
			[ "(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)oes$", "$1o", "$1os" ],
		];
		const outputArray = [
			{ reg: /(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)o$/i, repl1: "$1os", repl2: "$1oes" },
			{ reg: /(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)os$/i, repl1: "$1o", repl2: "$1oes" },
			{ reg: /(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)oes$/i, repl1: "$1o", repl2: "$1os" },
		];
		expect( createRulesFromArrays( inputArray ) ).toEqual( outputArray );
	} );

	it( "returns an array of undefined if the regex doesn't contain pairs or triplets `reg` and `repl`", function() {
		const inputArray = [
			"'etje$",
			"(e)(etje)$",
		];
		expect( createRulesFromArrays( inputArray ) ).toEqual( [ undefined, undefined ] );
	} );

	it( "returns a rule of triplets `reg`, `repl1` and `repl2` from a single array", function() {
		const inputArray = [ "(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)o$", "$1os", "$1oes" ];
		const outputArray = { reg: /(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)o$/i, repl1: "$1os", repl2: "$1oes" };
		expect( createSingleRuleFromArray( inputArray ) ).toEqual( outputArray );
	} );
} );
