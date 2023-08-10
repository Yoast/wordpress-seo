import { shallow } from "enzyme";

import WincherTableRow, {
	PositionOverTimeChart,
	PositionOverTimeCell,
	CaretIcon,
	PositionChangeValue,
	SelectKeyphraseCheckboxWrapper,
	KeyphraseTdWrapper,
	TrackingTdWrapper,
} from "../../src/components/WincherTableRow";
import { Toggle } from "@yoast/components";
import WincherSEOPerformanceLoading from "../../src/components/modals/WincherSEOPerformanceLoading";
import { noop } from "lodash";

const keyphrasesData = {
	"yoast seo": {
		id: "12345",
		keyword: "yoast seo",
		position: {
			value: 10,
			history: [
				{
					datetime: "2021-08-02T22:00:00Z",
					value: 40,
				},
				{
					datetime: "2021-08-03T22:00:00Z",
					value: 38,
				},
			],
			change: -2,
		},
		// eslint-disable-next-line camelcase
		updated_at: new Date(),
	},
	"woocommerce seo": {
		id: "54321",
		keyword: "woocommerce seo",
		position: null,
		// eslint-disable-next-line camelcase
		updated_at: null,
	},
};

describe( "WincherTableRow", () => {
	it( "should render a row with the available data but without chart data", () => {
		const component = shallow( <WincherTableRow
			rowData={ keyphrasesData[ "woocommerce seo" ] }
			keyphrase="woocommerce seo"
			isSelected={ false }
			onSelectKeyphrases={ noop }
		/> );

		expect( component.find( "td" ).length ).toEqual( 1 );
		expect( component.find( "td" ).at( 0 ).getElement().props.children ).toEqual( <WincherSEOPerformanceLoading /> );
		expect( component.find( SelectKeyphraseCheckboxWrapper ).length ).toEqual( 1 );
		expect( component.find( KeyphraseTdWrapper ).length ).toEqual( 1 );
		expect( component.find( KeyphraseTdWrapper ).at( 0 ).text() ).toEqual( "woocommerce seo" );
		expect( component.find( TrackingTdWrapper ).length ).toEqual( 1 );
	} );

	it( "should render a row with the available data and with chart data", () => {
		const component = shallow( <WincherTableRow
			rowData={ keyphrasesData[ "yoast seo" ] }
			keyphrase="yoast seo"
			isSelected={ false }
			onSelectKeyphrases={ noop }
		/> );

		expect( component.find( "td" ).length ).toEqual( 3 );
		expect( component.find( Toggle ).length ).toEqual( 1 );
		expect( component.find( PositionOverTimeCell ).length ).toEqual( 1 );
		expect( component.find( SelectKeyphraseCheckboxWrapper ).length ).toEqual( 1 );
		expect( component.find( KeyphraseTdWrapper ).length ).toEqual( 1 );
		expect( component.find( TrackingTdWrapper ).length ).toEqual( 1 );

		expect( component.find( Toggle ).getElement().props.id ).toBe( "toggle-keyphrase-tracking-yoast seo" );
		expect( component.find( Toggle ).getElement().props.isEnabled ).toBe( true );
		expect( component.find( Toggle ).getElement().props.showToggleStateLabel ).toBe( false );

		expect( component.find( KeyphraseTdWrapper ).at( 0 ).text() ).toEqual( "yoast seo" );
		expect( component.find( "td" ).at( 0 ).text() ).toContain( "10" );
		expect( component.find( "td" ).at( 2 ).text() ).toEqual( "a few seconds ago" );
	} );

	it( "should not render an enabled toggle or any position and chart data when no data is available", () => {
		const component = shallow( <WincherTableRow
			rowData={ {} }
			keyphrase="yoast seo"
			isSelected={ false }
			onSelectKeyphrases={ noop }
		/> );

		expect( component.find( "td" ).length ).toEqual( 1 );
		expect( component.find( Toggle ).length ).toEqual( 1 );
		expect( component.find( PositionOverTimeCell ).length ).toEqual( 0 );
		expect( component.find( TrackingTdWrapper ).length ).toEqual( 1 );

		expect( component.find( Toggle ).getElement().props.id ).toBe( "toggle-keyphrase-tracking-yoast seo" );
		expect( component.find( Toggle ).getElement().props.isEnabled ).toBe( false );
		expect( component.find( KeyphraseTdWrapper ).at( 0 ).text() ).toEqual( "yoast seo" );
		expect( component.find( "td" ).at( 0 ).text() ).toEqual( "Activate tracking to show the ranking position" );
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
