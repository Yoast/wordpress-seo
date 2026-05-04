import { createBlock } from "@wordpress/blocks";
import { buildBlocksFromOutline } from "../../../src/ai-content-planner/helpers/build-blocks-from-outline";

jest.mock( "@wordpress/blocks", () => ( {
	createBlock: jest.fn( ( type, attrs ) => ( { type, attrs } ) ),
} ) );

describe( "buildBlocksFromOutline", () => {
	beforeEach( () => {
		createBlock.mockClear();
	} );

	it( "returns an empty array for an empty outline", () => {
		const result = buildBlocksFromOutline( [] );
		expect( result ).toEqual( [] );
		expect( createBlock ).not.toHaveBeenCalled();
	} );

	it( "creates three blocks per section: heading, content-suggestion, paragraph", () => {
		const outline = [ { heading: "Introduction", contentNotes: [ "Note 1", "Note 2" ] } ];

		const result = buildBlocksFromOutline( outline );

		expect( result ).toHaveLength( 3 );
		expect( createBlock ).toHaveBeenCalledWith( "core/heading", { content: "Introduction", level: 2 } );
		expect( createBlock ).toHaveBeenCalledWith( "yoast-seo/content-suggestion", { suggestions: [ "Note 1", "Note 2" ] } );
		expect( createBlock ).toHaveBeenCalledWith( "core/paragraph" );
	} );

	it( "creates three blocks for each section in a multi-section outline", () => {
		const outline = [
			{ heading: "Section 1", contentNotes: [ "Note A" ] },
			{ heading: "Section 2", contentNotes: [ "Note B", "Note C" ] },
		];

		const result = buildBlocksFromOutline( outline );

		expect( result ).toHaveLength( 6 );
		expect( createBlock ).toHaveBeenCalledTimes( 6 );
	} );

	it( "preserves section order in the output blocks", () => {
		const outline = [
			{ heading: "First", contentNotes: [] },
			{ heading: "Second", contentNotes: [] },
		];

		const result = buildBlocksFromOutline( outline );

		expect( result[ 0 ] ).toEqual( { type: "core/heading", attrs: { content: "First", level: 2 } } );
		expect( result[ 1 ] ).toEqual( { type: "yoast-seo/content-suggestion", attrs: { suggestions: [] } } );
		expect( result[ 3 ] ).toEqual( { type: "core/heading", attrs: { content: "Second", level: 2 } } );
	} );

	it( "uses heading level 2 for all section headings", () => {
		const outline = [
			{ heading: "A", contentNotes: [] },
			{ heading: "B", contentNotes: [] },
		];

		buildBlocksFromOutline( outline );

		const headingCalls = createBlock.mock.calls.filter( ( [ type ] ) => type === "core/heading" );
		headingCalls.forEach( ( [ , attrs ] ) => {
			expect( attrs.level ).toBe( 2 );
		} );
	} );

	it( "passes contentNotes as suggestions to the content-suggestion block", () => {
		const contentNotes = [ "Use examples", "Add statistics", "Include a CTA" ];
		const outline = [ { heading: "Body", contentNotes } ];

		buildBlocksFromOutline( outline );

		expect( createBlock ).toHaveBeenCalledWith( "yoast-seo/content-suggestion", { suggestions: contentNotes } );
	} );
} );
