import { noop } from "lodash";
import SEMrushKeyphrasesTable from "../../../js/src/components/modals/SEMrushKeyphrasesTable";
import { render, screen } from "../test-utils";

global.window.wpseoAdminL10n = [];
global.window.wpseoAdminL10n[ "shortlinks.semrush.volume_help" ] = "test.com";

const testData = {
	results: {
		columnNames: [ "Keyword", "Search Volume", "Trends" ],
		rows: [
			[ "element1", "111", "0.82,0.82,0.82,0.82,0.82,0.82,0.82,0.82,0.82,1.00,1.00,1.00" ],
			[ "element2", "222", "1.00,0.67,0.45,0.45,0.37,0.37,0.37,0.37,0.37,0.30,0.37,0.45" ],
			[ "element3", "333", "0.82,0.82,0.82,0.82,1.00,1.00,0.82,0.82,0.82,0.82,0.82,0.82" ],
			[ "element4", "444", "0.45,0.45,0.45,0.55,0.45,0.55,0.55,0.55,1.00,0.82,0.82,0.45" ],
			[ "element5", "555", "0.67,0.67,0.67,0.82,0.82,1.00,1.00,0.82,0.82,1.00,1.00,1.00" ],
			[ "element6", "666", "0.00,1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00" ],
			[ "element7", "777", "0.06,1.00,0.20,0.11,0.11,0.11,0.13,0.13,0.13,0.11,0.09,0.07" ],
			[ "element8", "888", "0.13,1.00,0.25,0.13,0.13,0.13,0.16,0.16,0.37,0.37,0.16,0.16" ],
			[ "element9", "999", "0.00,1.00,0.04,0.01,0.01,0.01,0.01,0.01,0.01,0.02,0.01,0.01" ],
			[ "element10", "101010", "0.06,0.02,0.01,0.01,0.01,0.01,0.02,0.01,0.05,0.20,0.05,1.00" ],
		],
	},
	status: 200,
};

const expectedGraphData = [
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 1 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 1 ], [ 0.67 ], [ 0.45 ], [ 0.45 ], [ 0.37 ], [ 0.37 ], [ 0.37 ], [ 0.37 ], [ 0.37 ], [ 0.3 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 1 ], [ 1 ], [ 0.82 ], [ 0.82 ], [ 0.82 ], [ 0.82 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0.45 ], [ 0.45 ], [ 0.45 ], [ 0.55 ], [ 0.45 ], [ 0.55 ], [ 0.55 ], [ 0.55 ], [ 1 ], [ 0.82 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0.67 ], [ 0.67 ], [ 0.67 ], [ 0.82 ], [ 0.82 ], [ 1 ], [ 1 ], [ 0.82 ], [ 0.82 ], [ 1 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0 ], [ 1 ], [ 0 ], [ 0 ], [ 0 ], [ 0 ], [ 0 ], [ 0 ], [ 0 ], [ 0 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ .06 ], [ 1 ], [ 0.2 ], [ 0.11 ], [ 0.11 ], [ 0.11 ], [ 0.13 ], [ 0.13 ], [ 0.13 ], [ 0.11 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0.13 ], [ 1 ], [ 0.25 ], [ 0.13 ], [ 0.13 ], [ 0.13 ], [ 0.16 ], [ 0.16 ], [ 0.37 ], [ 0.37 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0 ], [ 1 ], [ 0.04 ], [ 0.01 ], [ 0.01 ], [ 0.01 ], [ 0.01 ], [ 0.01 ], [ 0.01 ], [ 0.02 ] ],
	},
	{
		x: [ [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ] ],
		y: [ [ 0.06 ], [ 0.02 ], [ 0.01 ], [ 0.01 ], [ 0.01 ], [ 0.01 ], [ 0.02 ], [ 0.01 ], [ 0.05 ], [ 0.2 ] ],
	},
];

describe( "SEMrushKeyphrasesTable", () => {
	beforeEach( () => {
		render( <SEMrushKeyphrasesTable
			keyphrase={ "yoast seo" }
			relatedKeyphrases={ [ "yoast" ] }
			countryCode={ "us" }
			data={ testData }
			renderAction={ noop }
		/> );
	} );

	it( "should fill the table with 10 elements", () => {
		const tbody = document.querySelector( "tbody" );
		expect( tbody.children ).toHaveLength( 10 );
	} );

	describe( "search keywords", () => {
		test.each( [
			"element1",
			"element2",
			"element3",
			"element4",
			"element5",
			"element6",
			"element7",
			"element8",
			"element9",
			"element10",
		] )( "should have the %s search keyword present", text => {
			expect( screen.getByText( text ) ).toBeInTheDocument();
		} );
	} );

	describe( "search volumes", () => {
		test.each( [
			"111",
			"222",
			"333",
			"444",
			"555",
			"666",
			"777",
			"888",
			"999",
			"101010",
		] )( "should have the %s volume present", text => {
			expect( screen.getByText( text ) ).toBeInTheDocument();
		} );
	} );

	it( "should have the right calculated graph points", () => {
		const graphElements = document.querySelector( ".yoast-table--nopadding" );
		let elementIndex, expectedValueIndex;
		for ( elementIndex = 0; elementIndex < graphElements.length; elementIndex++ ) {
			for ( expectedValueIndex = 0; expectedValueIndex < graphElements.length; expectedValueIndex++ ) {
				expect( graphElements[ elementIndex ].props.children.props.data[ expectedValueIndex ].x )
					.toBe( expectedGraphData[ elementIndex ].x[ expectedValueIndex ][ 0 ] );
				expect( graphElements[ elementIndex ].props.children.props.data[ expectedValueIndex ].y )
					.toBe( expectedGraphData[ elementIndex ].y[ expectedValueIndex ][ 0 ] );
			}
		}
	} );
} );
