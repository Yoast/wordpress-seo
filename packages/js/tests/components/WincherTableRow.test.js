// import WincherTableRow, { PositionOverTimeChart } from "../../src/components/WincherTableRow";
// import { Toggle } from "@yoast/components";
// import WincherSEOPerformanceLoading from "../../src/components/modals/WincherSEOPerformanceLoading";

// const keyphrasesData = {
// 	"yoast seo": {
// 		id: "12345",
// 		keyword: "yoast seo",
// 		position: {
// 			value: 10,
// 			history: [
// 				{
// 					datetime: "2021-08-02T22:00:00Z",
// 					value: 40,
// 				},
// 				{
// 					datetime: "2021-08-03T22:00:00Z",
// 					value: 38,
// 				},
// 			],
// 		},
// 		// eslint-disable-next-line camelcase
// 		updated_at: new Date(),
// 	},
// 	"woocommerce seo": {
// 		id: "54321",
// 		keyword: "woocommerce seo",
// 		position: null,
// 		// eslint-disable-next-line camelcase
// 		updated_at: null,
// 	},
// };

describe( "WincherTableRow", () => {
	it( "should render a row with the available data but without chart data", () => {

	} );

	it( "should render a row with the available data and with chart data", () => {

	} );

	it( "should not render an enabled toggle or any position and chart data when no data is available", () => {

	} );
} );


describe( "PositionOverTimeCell", () => {
	it( "should render chart but not change if undefined position change", () => {
		const component = shallow( <PositionOverTimeCell
			rowData={ {
				position: {
					value: 10,
					history: [],
				},
			} }
		/> );

		expect( component.find( PositionOverTimeChart ).length ).toEqual( 1 );
		expect( component.find( CaretIcon ).length ).toEqual( 0 );
		expect( component.find( PositionChangeValue ).length ).toEqual( 0 );
	} );

	it( "should render chart but not change if no position change", () => {
		const component = shallow( <PositionOverTimeCell
			rowData={ {
				position: {
					value: 10,
					history: [],
					change: 0,
				},
			} }
		/> );

		expect( component.find( PositionOverTimeChart ).length ).toEqual( 1 );
		expect( component.find( CaretIcon ).length ).toEqual( 0 );
		expect( component.find( PositionChangeValue ).length ).toEqual( 0 );
	} );

	it( "should render chart and improving position change", () => {
		const component = shallow( <PositionOverTimeCell
			rowData={ {
				position: {
					value: 10,
					history: [],
					// improving
					change: -2,
				},
			} }
		/> );

		expect( component.find( PositionOverTimeChart ).length ).toEqual( 1 );
		expect( component.find( CaretIcon ).getElement().props.isImproving ).toEqual( true );
		expect( component.find( PositionChangeValue ).getElement().props.isImproving ).toEqual( true );
		expect( component.find( PositionChangeValue ).text() ).toEqual( "2" );
	} );

	it( "should render chart and declined position change", () => {
		const component = shallow( <PositionOverTimeCell
			rowData={ {
				position: {
					value: 10,
					history: [],
					// declined
					change: 2,
				},
			} }
		/> );

		expect( component.find( PositionOverTimeChart ).length ).toEqual( 1 );
		expect( component.find( CaretIcon ).getElement().props.isImproving ).toEqual( false );
		expect( component.find( PositionChangeValue ).getElement().props.isImproving ).toEqual( false );
		expect( component.find( PositionChangeValue ).text() ).toEqual( "2" );
	} );
} );
