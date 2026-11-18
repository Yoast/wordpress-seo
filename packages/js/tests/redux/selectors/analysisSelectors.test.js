import { getSeoTitle, getDescription } from "../../../src/redux/selectors/analysis";

// This mimics parts of the yoast-seo/editor store.
const testState = {
	analysisData: {
		snippet: {
			title: "Hello World!",
			description: "I describe something?",
		},
	},
};

let windowSpy;

beforeEach(
	() => {
		windowSpy = jest.spyOn( global, "window", "get" );
	}
);

afterEach(
	() => {
		windowSpy.mockRestore();
	}
);

describe( getSeoTitle, () => {
	it( "returns the snippet title", () => {
		const actual = getSeoTitle( testState );

		const expected = "Hello World!";

		expect( actual ).toEqual( expected );
	} );
} );

describe( getDescription, () => {
	it( "returns the snippet description", () => {
		const actual = getDescription( testState );

		const expected = "I describe something?";

		expect( actual ).toEqual( expected );
	} );
} );
