import { shallow } from "enzyme";

global.window.wpseoAdminL10n = [];
global.window.wpseoAdminL10n[ "shortlinks.semrush.volume_help" ] = "test.com";

import SEMrushKeyphrasesTable
	from "../../../js/src/components/modals/SEMrushKeyphrasesTable";
import { noop } from "lodash";

const testData = {
	results: {
		columnNames: [
			"Keyword",
			"Search Volume",
			"Trends",
		],
		rows: [
			[
				"element1",
				"111",
				"0.82,0.82,0.82,0.82,0.82,0.82,0.82,0.82,0.82,1.00,1.00,1.00",
			],
			[
				"element2",
				"222",
				"1.00,0.67,0.45,0.45,0.37,0.37,0.37,0.37,0.37,0.30,0.37,0.45",
			],
			[
				"element3",
				"333",
				"0.82,0.82,0.82,0.82,1.00,1.00,0.82,0.82,0.82,0.82,0.82,0.82",
			],
			[
				"element4",
				"444",
				"0.45,0.45,0.45,0.55,0.45,0.55,0.55,0.55,1.00,0.82,0.82,0.45",
			],
			[
				"element5",
				"555",
				"0.67,0.67,0.67,0.82,0.82,1.00,1.00,0.82,0.82,1.00,1.00,1.00",
			],
			[
				"element6",
				"666",
				"0.00,1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00",
			],
			[
				"element7",
				"777",
				"0.06,1.00,0.20,0.11,0.11,0.11,0.13,0.13,0.13,0.11,0.09,0.07",
			],
			[
				"element8",
				"888",
				"0.13,1.00,0.25,0.13,0.13,0.13,0.16,0.16,0.37,0.37,0.16,0.16",
			],
			[
				"element9",
				"999",
				"0.00,1.00,0.04,0.01,0.01,0.01,0.01,0.01,0.01,0.02,0.01,0.01",
			],
			[
				"element10",
				"101010",
				"0.06,0.02,0.01,0.01,0.01,0.01,0.02,0.01,0.05,0.20,0.05,1.00",
			],
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
	it( "should fill the table with 10 elements", () => {
		const component = shallow( <SEMrushKeyphrasesTable
			keyphrase={ "yoast seo" }
			relatedKeyphrases={ [ "yoast" ] } countryCode={ "us" } data={ testData } renderAction={ noop }
		/> );

		expect( component.find( "tbody" ).getElement().props.children.length ).toEqual( 10 );
	} );
	it( "should have the right search results present", () => {
		const component = shallow( <SEMrushKeyphrasesTable
			keyphrase={ "yoast seo" }
			relatedKeyphrases={ [ "yoast" ] } countryCode={ "us" } data={ testData } renderAction={ noop }
		/> );

		expect( component.find( { children: "element1" } ).length ).toEqual( 1 );
		expect( component.find( { children: "element2" } ).length ).toEqual( 1 );
		expect( component.find( { children: "element3" } ).length ).toEqual( 1 );
		expect( component.find( { children: "element4" } ).length ).toEqual( 1 );
		expect( component.find( { children: "element5" } ).length ).toEqual( 1 );
		expect( component.find( { children: "element6" } ).length ).toEqual( 1 );
		expect( component.find( { children: "element7" } ).length ).toEqual( 1 );
		expect( component.find( { children: "element8" } ).length ).toEqual( 1 );
		expect( component.find( { children: "element9" } ).length ).toEqual( 1 );
		expect( component.find( { children: "element10" } ).length ).toEqual( 1 );
	} );
	it( "should have the right volumes present", () => {
		const component = shallow( <SEMrushKeyphrasesTable
			keyphrase={ "yoast seo" }
			relatedKeyphrases={ [ "yoast" ] } countryCode={ "us" } data={ testData } renderAction={ noop }
		/> );

		expect( component.find( { children: "111" } ).length ).toEqual( 1 );
		expect( component.find( { children: "222" } ).length ).toEqual( 1 );
		expect( component.find( { children: "333" } ).length ).toEqual( 1 );
		expect( component.find( { children: "444" } ).length ).toEqual( 1 );
		expect( component.find( { children: "555" } ).length ).toEqual( 1 );
		expect( component.find( { children: "666" } ).length ).toEqual( 1 );
		expect( component.find( { children: "777" } ).length ).toEqual( 1 );
		expect( component.find( { children: "888" } ).length ).toEqual( 1 );
		expect( component.find( { children: "999" } ).length ).toEqual( 1 );
		expect( component.find( { children: "101010" } ).length ).toEqual( 1 );
	} );
	it( "should have the right calculated graph points", () => {
		const component = shallow( <SEMrushKeyphrasesTable
			keyphrase={ "yoast seo" }
			relatedKeyphrases={ [ "yoast" ] } countryCode={ "us" } data={ testData } renderAction={ noop }
		/> );

		const graphElements = component.find( { className: "yoast-table--nopadding" } ).getElements();
		let elementIndex, expectedValueIndex;
		for ( elementIndex = 0; elementIndex < graphElements.length; elementIndex++ ) {
			for ( expectedValueIndex = 0; expectedValueIndex < graphElements.length; expectedValueIndex++ ) {
				expect( graphElements[ elementIndex ].props.children.props.data[ expectedValueIndex ].x )
					.toEqual( expectedGraphData[ elementIndex ].x[ expectedValueIndex ][ 0 ] );
				expect( graphElements[ elementIndex ].props.children.props.data[ expectedValueIndex ].y )
					.toEqual( expectedGraphData[ elementIndex ].y[ expectedValueIndex ][ 0 ] );
			}
		}
	} );
} );
