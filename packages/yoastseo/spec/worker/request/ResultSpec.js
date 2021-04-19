import Result from "../../../src/worker/request/Result";

describe( "Worker Request Result", () => {
	it( "constructs a result with a result object", () => {
		const resultObject = {
			one: "First",
			two: "Second",
			three: "Third",
		};
		const result = new Result( resultObject );
		expect( result ).toBeDefined();
		expect( result.result ).toBe( resultObject );
	} );

	it( "constructs a result with extra data", () => {
		const data = {
			something: "extra",
			will: "work too",
		};
		const result = new Result( {}, data );
		expect( result.data ).toBe( data );
	} );
} );
