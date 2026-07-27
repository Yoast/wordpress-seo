import { describe, expect, it } from "@jest/globals";

import { buildContentAndMap } from "../../src/elementor-v4/content-walker";

/**
 * Builds a fake preview `$element` backed by a real jsdom container, exposing the
 * jQuery-ish `.find( selector ).get( index )` interface the walker relies on.
 *
 * @param {string} html The preview markup.
 * @returns {Object} A stub with the `$element` the walker expects.
 */
function makePreview( html ) {
	const root = document.createElement( "div" );
	root.innerHTML = html;
	return {
		find: ( selector ) => {
			const el = root.querySelector( selector );
			return { get: ( index ) => ( index === 0 ? el : null ) };
		},
	};
}

const widget = ( id, widgetType ) => ( { elType: "widget", id, widgetType } );
const container = ( elements ) => ( { elType: "container", elements } );

// A classic widget wrapper, with editor chrome that must be stripped from the content.
const classicWidget = ( id, type, inner ) =>
	`<div data-id="${ id }" class="elementor-element elementor-widget elementor-widget-${ type }">` +
	`<div class="elementor-element-overlay">CHROME</div>${ inner }</div>`;

describe( "buildContentAndMap", () => {
	it( "returns empty for null, undefined, object, and string input", () => {
		const empty = { content: "", widgets: [] };
		expect( buildContentAndMap( null, makePreview( "" ) ) ).toEqual( empty );
		expect( buildContentAndMap( undefined, makePreview( "" ) ) ).toEqual( empty );
		expect( buildContentAndMap( {}, makePreview( "" ) ) ).toEqual( empty );
		expect( buildContentAndMap( "text", makePreview( "" ) ) ).toEqual( empty );
		expect( buildContentAndMap( [], makePreview( "" ) ) ).toEqual( empty );
	} );

	it( "reads a classic widget's rendered HTML and strips editor chrome", () => {
		const $el = makePreview( classicWidget( "w1", "heading", "<h2>Hello</h2>" ) );
		const { content, widgets } = buildContentAndMap( [ widget( "w1", "heading" ) ], $el );

		expect( content ).toContain( "<h2>Hello</h2>" );
		expect( content ).not.toContain( "CHROME" );
		expect( widgets ).toHaveLength( 1 );
		expect( widgets[ 0 ] ).toMatchObject( { id: "w1", widgetType: "heading", start: 0 } );
		expect( content.slice( widgets[ 0 ].start, widgets[ 0 ].end ) ).toBe( content );
	} );

	it( "reads an atomic widget rendered as a bare semantic tag as-is", () => {
		const $el = makePreview( "<h2 data-interaction-id=\"a1\" class=\"e-heading-base\">Atomic</h2>" );
		const { content, widgets } = buildContentAndMap( [ widget( "a1", "e-heading" ) ], $el );

		expect( content ).toBe( "<h2 data-interaction-id=\"a1\" class=\"e-heading-base\">Atomic</h2>" );
		expect( widgets[ 0 ] ).toMatchObject( { id: "a1", widgetType: "e-heading" } );
	} );

	it( "matches the data-id wrapper when both data-id and data-interaction-id are present", () => {
		const $el = makePreview(
			"<div data-id=\"x\" class=\"elementor-element elementor-widget elementor-widget-e-heading\">" +
			"<h2 data-interaction-id=\"x\" class=\"e-heading-base\">Wrapped</h2></div>"
		);
		const { content } = buildContentAndMap( [ widget( "x", "e-heading" ) ], $el );
		// The wrapper div is matched first (document order), so its outerHTML wraps the heading.
		expect( content.startsWith( "<div data-id=\"x\"" ) ).toBe( true );
		expect( content ).toContain( "<h2 data-interaction-id=\"x\"" );
	} );

	it( "produces sequential, contiguous offsets for sibling widgets", () => {
		const $el = makePreview(
			classicWidget( "w1", "heading", "<h2>One</h2>" ) +
			classicWidget( "w2", "text-editor", "<p>Two</p>" )
		);
		const { content, widgets } = buildContentAndMap(
			[ widget( "w1", "heading" ), widget( "w2", "text-editor" ) ], $el
		);

		expect( widgets ).toHaveLength( 2 );
		expect( widgets[ 0 ].start ).toBe( 0 );
		expect( widgets[ 0 ].end ).toBe( widgets[ 1 ].start );
		expect( widgets[ 1 ].end ).toBe( content.length );
		expect( content.slice( widgets[ 1 ].start, widgets[ 1 ].end ) ).toContain( "<p>Two</p>" );
	} );

	it( "walks container children and shifts their offsets by preceding content", () => {
		const $el = makePreview(
			classicWidget( "outer", "heading", "<h2>Outer</h2>" ) +
			classicWidget( "inner", "text-editor", "<p>Inner</p>" )
		);
		const tree = [
			widget( "outer", "heading" ),
			container( [ widget( "inner", "text-editor" ) ] ),
		];
		const { content, widgets } = buildContentAndMap( tree, $el );

		const outer = widgets.find( ( w ) => w.id === "outer" );
		const inner = widgets.find( ( w ) => w.id === "inner" );
		expect( inner.start ).toBe( outer.end );
		expect( content.slice( inner.start, inner.end ) ).toContain( "<p>Inner</p>" );
	} );

	it( "skips a widget that is not rendered in the preview, keeping later offsets at 0", () => {
		const $el = makePreview( classicWidget( "present", "heading", "<h2>Here</h2>" ) );
		const { widgets } = buildContentAndMap(
			[ widget( "missing", "heading" ), widget( "present", "heading" ) ], $el
		);

		expect( widgets ).toHaveLength( 1 );
		expect( widgets[ 0 ] ).toMatchObject( { id: "present", start: 0 } );
	} );

	it( "skips a widget node without an id", () => {
		const $el = makePreview( classicWidget( "w1", "heading", "<h2>Has id</h2>" ) );
		const noId = { elType: "widget", widgetType: "heading" };
		const { widgets } = buildContentAndMap( [ noId, widget( "w1", "heading" ) ], $el );

		expect( widgets ).toHaveLength( 1 );
		expect( widgets[ 0 ].id ).toBe( "w1" );
	} );

	it( "strips \\n and \\t so positions match the normalised content", () => {
		const $el = makePreview( "<p data-interaction-id=\"t\">Line\tone\ntwo</p>" );
		const { content, widgets } = buildContentAndMap( [ widget( "t", "e-paragraph" ) ], $el );

		expect( content ).not.toMatch( /[\n\t]/ );
		expect( widgets[ 0 ].end - widgets[ 0 ].start ).toBe( content.length );
	} );

	it( "unwraps a Backbone collection (toJSON) at any nesting level", () => {
		const $el = makePreview( classicWidget( "deep", "heading", "<h3>Deep</h3>" ) );
		const tree = [ {
			elType: "container",
			elements: { toJSON: () => [ widget( "deep", "heading" ) ] },
		} ];
		const { content, widgets } = buildContentAndMap( tree, $el );

		expect( content ).toContain( "<h3>Deep</h3>" );
		expect( widgets[ 0 ].id ).toBe( "deep" );
	} );

	it( "every widget span is a valid, non-overlapping slice of the content", () => {
		const $el = makePreview(
			classicWidget( "w1", "heading", "<h2>First</h2>" ) +
			classicWidget( "w2", "text-editor", "<p>Second</p>" )
		);
		const { content, widgets } = buildContentAndMap(
			[ widget( "w1", "heading" ), widget( "w2", "text-editor" ) ], $el
		);

		widgets.forEach( ( w ) => {
			expect( w.start ).toBeGreaterThanOrEqual( 0 );
			expect( w.end ).toBeGreaterThan( w.start );
			expect( w.end ).toBeLessThanOrEqual( content.length );
		} );
	} );

	it( "does not recurse into a widget node's own children, so nested widgets are not double-counted", () => {
		// A widget such as nested-tabs carries child widgets in the model, but its rendered HTML
		// already contains them — the walker must read the widget once and not walk its children.
		const $el = makePreview( classicWidget( "tabs", "nested-tabs", "<h3>Tab</h3><p>Panel text</p>" ) );
		const tree = [ {
			elType: "widget",
			id: "tabs",
			widgetType: "nested-tabs",
			elements: [ widget( "panel", "e-paragraph" ) ],
		} ];
		const { content, widgets } = buildContentAndMap( tree, $el );

		expect( widgets ).toHaveLength( 1 );
		expect( widgets[ 0 ].id ).toBe( "tabs" );
		expect( widgets.find( ( w ) => w.id === "panel" ) ).toBeUndefined();
		// "Panel text" appears exactly once (not duplicated by walking the child node).
		expect( content.split( "Panel text" ) ).toHaveLength( 2 );
	} );
} );
