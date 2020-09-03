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
	it( "successfully calls the associated newRequest function when the change country button is clicked", () => {
		const onClickMock = jest.fn();
		const component = shallow( <SEMrushCountrySelector
			setCountry={ noop } newRequest={ onClickMock } setNoResultsFoundnewRequest={ noop }
			setRequestSucceeded={ noop } setRequestLimitReached={ noop } setRequestFailed={ noop } setNoResultsFound={ noop }
		/> );

		component.find( "button" ).simulate( "click" );

		expect( onClickMock ).toHaveBeenCalled();
	} );
	it( "validates the amount of options loaded within the select", () => {
		const component = shallow( <SEMrushCountrySelector
			setCountry={ noop } newRequest={ noop } setNoResultsFoundnewRequest={ noop }
			setRequestSucceeded={ noop } setRequestLimitReached={ noop } setRequestFailed={ noop } setNoResultsFound={ noop }
		/> );

		expect( component.find( "select" ).getElement().props.children.length ).toEqual( 117 );
	} );
} );
