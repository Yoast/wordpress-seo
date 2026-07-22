import { describe, expect, it } from "@jest/globals";

import { getContainerElements, getDocumentTree } from "../../src/elementor-v4/document-tree";

describe( "getContainerElements", () => {
	it( "returns the serialised live elements array from the container model", () => {
		const elements = [ { id: "a", widgetType: "e-heading" } ];
		const doc = {
			container: {
				model: { get: ( key ) => key === "elements" ? { toJSON: () => elements } : null },
			},
		};
		expect( getContainerElements( doc ) ).toEqual( elements );
	} );

	it( "returns null when container is absent", () => {
		expect( getContainerElements( {} ) ).toBeNull();
		expect( getContainerElements( { container: null } ) ).toBeNull();
	} );

	it( "returns null when model.get('elements') has no toJSON method (plain array, not Backbone Collection)", () => {
		const doc = {
			container: { model: { get: () => [ { id: "a" } ] } },
		};
		expect( getContainerElements( doc ) ).toBeNull();
	} );

	it( "returns null when model is absent", () => {
		const doc = { container: {} };
		expect( getContainerElements( doc ) ).toBeNull();
	} );
} );

describe( "getDocumentTree", () => {
	it( "returns an empty array for null or undefined input", () => {
		expect( getDocumentTree( null ) ).toEqual( [] );
		expect( getDocumentTree( undefined ) ).toEqual( [] );
	} );

	it( "returns live container elements when the container model is available", () => {
		const elements = [ { id: "widget-1", widgetType: "e-heading" } ];
		const doc = {
			container: { model: { get: () => ( { toJSON: () => elements } ) } },
		};
		expect( getDocumentTree( doc ) ).toEqual( elements );
	} );

	it( "falls back to config.elements when the container is absent", () => {
		const elements = [ { id: "widget-1" } ];
		expect( getDocumentTree( { config: { elements } } ) ).toEqual( elements );
	} );

	it( "prefers the live container over config.elements when both are present", () => {
		const live = [ { id: "live" } ];
		const doc = {
			container: { model: { get: () => ( { toJSON: () => live } ) } },
			config: { elements: [ { id: "stale" } ] },
		};
		expect( getDocumentTree( doc ) ).toEqual( live );
	} );

	it( "returns an empty array when neither container nor config.elements is available", () => {
		expect( getDocumentTree( {} ) ).toEqual( [] );
		expect( getDocumentTree( { config: {} } ) ).toEqual( [] );
		expect( getDocumentTree( { config: { elements: "not-an-array" } } ) ).toEqual( [] );
	} );
} );
