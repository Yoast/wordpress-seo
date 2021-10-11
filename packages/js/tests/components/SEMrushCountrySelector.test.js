import { shallow } from "enzyme";

import SEMrushCountrySelector
	from "../../../js/src/components/modals/SEMrushCountrySelector";
import React from "react";
import { noop } from "lodash";

window.jQuery = () => ( {
	select2: () => {},
	on: () => {},
} );

describe( "SEMrushCountrySelector", () => {
	it( "successfully calls the associated newRequest function when the select country button is clicked", () => {
		const onClickMock = jest.fn();
		const component = shallow( <SEMrushCountrySelector
			setCountry={ noop } newRequest={ onClickMock } setNoResultsFoundnewRequest={ noop }
			setRequestSucceeded={ noop } setRequestLimitReached={ noop } setRequestFailed={ noop } setNoResultsFound={ noop }
		/> );

		component.find( "#yoast-semrush-country-selector-button" ).simulate( "click" );

		expect( onClickMock ).toHaveBeenCalled();
	} );
	it( "successfully calls the associated setCountry function when the selected option has changed", () => {
		const setCountryMock = jest.fn();
		const component = shallow( <SEMrushCountrySelector
			setCountry={ setCountryMock } newRequest={ noop } setNoResultsFoundnewRequest={ noop }
			setRequestSucceeded={ noop } setRequestLimitReached={ noop } setRequestFailed={ noop } setNoResultsFound={ noop }
		/> );

		component.find( "#yoast-semrush-country-selector-select" ).simulate( "change" );

		expect( setCountryMock ).toHaveBeenCalled();
	} );
} );
