import { isShallowEqual } from "../src/analysis/data.js";

describe( 'isShallowEqual', () => {
	it( 'returns true if two objects contain the same key value pairs', () => {
		const object1 = {
			key1: "value1",
			key2: "value2",
		};
		const object2 = {
			key2: "value2",
			key1: "value1",
		};
		const actual = isShallowEqual( object1, object2 );
		expect( actual ).toBe( true );
	} );
	it( 'returns false if two objects contain the same keys but 1 value differs', () => {
		const object1 = {
			key1: "value1",
			key2: "value2",
		};
		const object2 = {
			key2: "value2b",
			key1: "value1",
		};
		const actual = isShallowEqual( object1, object2 );
		expect( actual ).toBe( false );
	} );
	it( 'returns false if two objects don\'t contain the same keys value pairs', () => {
		const object1 = {
			key1: "value1",
			key2: "value2",
		};
		const object2 = {
			key3: "value2",
			key1: "value1",
		};
		const actual = isShallowEqual( object1, object2 );
		expect( actual ).toBe( false );
	} );
} );
