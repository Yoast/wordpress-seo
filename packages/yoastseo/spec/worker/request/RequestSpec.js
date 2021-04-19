import Request from "../../../src/worker/request/Request";
import Result from "../../../src/worker/request/Result";

describe( "Worker Request", () => {
	let resolve, reject;

	beforeEach( () => {
		resolve = jest.fn();
		reject = jest.fn();
	} );

	it( "constructs a request with resolve and reject functions", () => {
		const request = new Request( resolve, reject );
		expect( request ).toBeDefined();
		expect( request._resolve ).toBe( resolve );
		expect( request._reject ).toBe( reject );
	} );

	it( "constructs a request with extra data", () => {
		const data = {};
		const request = new Request( resolve, reject, data );
		expect( request._data ).toBe( data );
	} );

	it( "resolves the request with a result", () => {
		const data = { extra: "data" };
		const request = new Request( resolve, reject, data );
		const expected = new Result( {}, data );

		request.resolve();
		expect( resolve ).toBeCalledWith( expected );
	} );

	it( "resolves the request with a result that contains the payload", () => {
		const payload = { payload: "is this object" };
		const data = { extra: "data" };
		const request = new Request( resolve, reject, data );
		const expected = new Result( payload, data );

		request.resolve( payload );
		expect( resolve ).toBeCalledWith( expected );
	} );

	it( "rejects the request with a result", () => {
		const data = { extra: "data" };
		const request = new Request( resolve, reject, data );
		const expected = new Result( {}, data );

		request.reject();
		expect( reject ).toBeCalledWith( expected );
	} );

	it( "rejects the request with a result than contains the payload", () => {
		const payload = { payload: "is this object" };
		const data = { extra: "data" };
		const request = new Request( resolve, reject, data );
		const expected = new Result( payload, data );

		request.reject( payload );
		expect( reject ).toBeCalledWith( expected );
	} );
} );
