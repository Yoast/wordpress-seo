/**
 * Initially forked from Site Kit's own implementation and modified to fit our needs.
 *
 * @see https://github.com/google/site-kit-wp/blob/444fc0796e3cb30d27ed389bb0ec572b5a28b6f0/assets/js/googlesitekit/api/cache.test.js
 *
 */

import { describe, expect, it } from "@jest/globals";
import {
	getItem,
	getStorage,
	resetDefaultStorageOrder,
	setItem,
	setSelectedStorageBackend,
	setStorageOrder,
} from "../../src/services/cache";

describe( "getStorage", () => {
	it( "should return the most applicable storage driver available", () => {
		let storage = getStorage();

		// localStorage is the best storage mechanism available in the test suite
		// by default and should be returned.
		expect( storage ).toEqual( localStorage );

		setStorageOrder( [ "sessionStorage", "localStorage" ] );
		storage = getStorage();

		expect( storage ).toEqual( sessionStorage );

		// Ensure an empty order still works.
		setStorageOrder( [] );
		storage = getStorage();

		expect( storage ).toEqual( null );

		resetDefaultStorageOrder();
	} );
} );

describe.each( [ [ "localStorage" ], [ "sessionStorage" ] ] )(
	"%s backend",
	( backend ) => {
		let storageMechanism;
		beforeAll( () => {
			storageMechanism = global[ backend ];
			setSelectedStorageBackend( storageMechanism );
		} );

		afterAll( () => {
			// Reset the backend storage mechanism.
			setSelectedStorageBackend( undefined );
		} );

		describe( "get", () => {
			it( "should return undefined when the key is not found", () => {
				const result = getItem( "not-a-key" );

				expect( result.cacheHit ).toEqual( false );
				expect( result.value ).toEqual( undefined );
			} );

			it( "should return undefined when the key is found but the cached value is too old", () => {
				// Save with a timestamp ten seconds in the past.
				const didSave = setItem( "old-key", "something", {
					timestamp: Math.round( Date.now() / 1000 ) - 10,
					ttl: 5,
				} );
				expect( didSave ).toEqual( true );

				// Only return if the cache hit is less than five seconds old.
				const result = getItem( "old-key" );

				expect( result.cacheHit ).toEqual( false );
				expect( result.value ).toEqual( undefined );
			} );

			it( "should return the value when the key is found and the data is not stale", () => {
				const didSave = setItem( "modern-key", "something", {
					ttl: 100,
				} );
				expect( didSave ).toEqual( true );

				const result = getItem( "modern-key" );

				expect( result.cacheHit ).toEqual( true );
				expect( result.value ).toEqual( "something" );
			} );

			it( "should return an undefined saved value but set cacheHit to true", () => {
				const didSave = setItem( "undefined", undefined );
				expect( didSave ).toEqual( true );

				const result = getItem( "undefined" );

				expect( result.cacheHit ).toEqual( true );
				expect( result.value ).toEqual( undefined );
			} );

			it( "should return a number value", () => {
				const didSave = setItem( "number", 500 );
				expect( didSave ).toEqual( true );

				const result = getItem( "number" );

				expect( result.cacheHit ).toEqual( true );
				expect( result.value ).toEqual( 500 );
			} );

			it( "should return an array value", () => {
				const didSave = setItem( "array", [ 1, "2", 3 ] );
				expect( didSave ).toEqual( true );

				const result = getItem( "array" );

				expect( result.cacheHit ).toEqual( true );
				expect( result.value ).toEqual( [ 1, "2", 3 ] );
			} );

			it( "should return an object value", () => {
				const didSave = setItem( "object", { foo: "barr" } );
				expect( didSave ).toEqual( true );

				const result = getItem( "object" );

				expect( result.cacheHit ).toEqual( true );
				expect( result.value ).toEqual( { foo: "barr" } );
			} );

			it( "should return a complex value", () => {
				const didSave = setItem( "complex", [
					1,
					"2",
					{ cool: "times", other: [ { time: { to: "see" } } ] },
				] );
				expect( didSave ).toEqual( true );

				const result = getItem( "complex" );

				expect( result.cacheHit ).toEqual( true );
				expect( result.value ).toEqual( [
					1,
					"2",
					{ cool: "times", other: [ { time: { to: "see" } } ] },
				] );
			} );

			it( "should not mutate a value", () => {
				setItem( "value", "hello" );

				const result1 = getItem( "value" );
				const result2 = getItem( "value" );

				result1.value = "mutate";

				expect( result1.value ).not.toEqual( result2.value );
			} );

			it( "should not mutate an object value", () => {
				setItem( "object", { foo: "barr" } );

				const result1 = getItem( "object" );
				const result2 = getItem( "object" );

				result1.value.foo = "mutate";

				expect( result1.value.foo ).not.toEqual(
					result2.value.foo
				);
			} );

			it( "should not mutate an array value", () => {
				setItem( "array", [ 1, 2, 3 ] );

				const result1 = getItem( "array" );
				const result2 = getItem( "array" );

				result1.value[ 2 ] = 4;

				expect( result1.value[ 2 ] ).not.toEqual(
					result2.value[ 2 ]
				);
			} );
		} );
	}
);
