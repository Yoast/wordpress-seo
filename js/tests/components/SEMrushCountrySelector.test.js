import { mount, shallow } from "enzyme";

import SEMrushCountrySelector
	from "../../../js/src/components/modals/SEMrushCountrySelector";
import React from "react";

window.jQuery = () => ( { select2: () => {}, on: () => {} } );

describe( "SEMrushCountrySelector", () => {
	it( "successfully calls the associated newRequest function when the change country button is clicked", () => {
		const onClickMock = jest.fn();
		const component = shallow( <SEMrushCountrySelector setCountry={() => {console.log("setCountry")}} newRequest={onClickMock}
		setNoResultsFoundnewRequest={() => {}} setRequestSucceeded={() => {}} setRequestLimitReached={() => {}}
		setRequestFailed={() => {}} setNoResultsFound={() => {}} /> );

		component.find("button").simulate("click");

		expect( onClickMock ).toHaveBeenCalled();
	} );

} );
