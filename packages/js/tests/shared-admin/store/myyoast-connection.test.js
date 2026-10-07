import { getMyyoastConnectionState } from "../../../src/shared-admin/store";

describe( "getMyyoastConnectionState", () => {
	it( "returns all-false defaults when payload is null", () => {
		expect( getMyyoastConnectionState( null ) ).toEqual( {
			isAvailable: false,
			canConnect: false,
			connectUrl: null,
			learnMoreUrl: "",
		} );
	} );

	it( "returns isAvailable true when payload has isProvisioned true", () => {
		expect( getMyyoastConnectionState( { isProvisioned: true } ) ).toMatchObject( {
			isAvailable: true,
		} );
	} );

	it( "returns isAvailable false when payload has isProvisioned false", () => {
		expect( getMyyoastConnectionState( { isProvisioned: false } ) ).toMatchObject( {
			isAvailable: false,
		} );
	} );

	it( "maps all fields from the payload", () => {
		const payload = {
			isProvisioned: true,
			canConnect: true,
			connectUrl: "https://yoa.st/connect",
			learnMoreUrl: "https://yoa.st/learn-more",
		};
		expect( getMyyoastConnectionState( payload ) ).toEqual( {
			isAvailable: true,
			canConnect: true,
			connectUrl: "https://yoa.st/connect",
			learnMoreUrl: "https://yoa.st/learn-more",
		} );
	} );
} );
