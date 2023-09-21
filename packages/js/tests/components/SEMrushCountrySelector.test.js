// import { noop } from "lodash";
// import React from "react";
// import SEMrushCountrySelector from "../../../js/src/components/modals/SEMrushCountrySelector";

jest.mock( "@wordpress/api-fetch", () => ( {
	__esModule: true,
	"default": () => ( { response: {} } ),
} ) );

// window.jQuery = () => ( { on: noop } );

describe( "SEMrushCountrySelector", () => {
	it( "successfully calls the associated newRequest function when the select country button is clicked", () => {

	} );
	it( "successfully calls the associated setCountry function when the selected option has changed", () => {

	} );
} );
