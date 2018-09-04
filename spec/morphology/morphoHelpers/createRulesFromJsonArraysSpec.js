const createRulesFromMorphologyData = require( "../../../src/morphology/morphoHelpers/createRulesFromMorphologyData" );

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
		expect( createRulesFromMorphologyData( inputArray ) ).toEqual( outputArray );
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
		expect( createRulesFromMorphologyData( inputArray ) ).toEqual( outputArray );
	} );
} );
