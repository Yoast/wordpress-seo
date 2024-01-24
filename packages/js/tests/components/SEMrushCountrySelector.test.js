import { noop } from "lodash";
import SEMrushCountrySelector from "../../../js/src/components/modals/SEMrushCountrySelector";
import { fireEvent, render, screen, waitFor } from "../test-utils";

jest.mock( "@wordpress/api-fetch", () => ( {
	__esModule: true,
	"default": () => ( { response: {} } ),
} ) );

const DOWN_ARROW = { keyCode: 40 };

describe( "SEMrushCountrySelector", () => {
	it( "successfully calls the associated newRequest function when the select country button is clicked", () => {
		const onClickMock = jest.fn();

		render( <SEMrushCountrySelector
			setCountry={ noop }
			newRequest={ onClickMock }
			setNoResultsFoundnewRequest={ noop }
			setRequestSucceeded={ noop }
			setRequestLimitReached={ noop }
			setRequestFailed={ noop }
			setNoResultsFound={ noop }
		/> );

		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toHaveTextContent( "Select country" );

		fireEvent.click( button );

		expect( onClickMock ).toHaveBeenCalled();
	} );

	it( "successfully calls the associated setCountry function when the selected option has changed", async() => {
		const setCountryMock = jest.fn();

		render( <SEMrushCountrySelector
			setCountry={ setCountryMock }
			newRequest={ noop }
			setNoResultsFoundnewRequest={ noop }
			setRequestSucceeded={ noop }
			setRequestLimitReached={ noop }
			setRequestFailed={ noop }
			setNoResultsFound={ noop }
		/> );

		const select = document.getElementById( "yoast-semrush-country-selector-select" );
		fireEvent.keyDown( select, DOWN_ARROW );

		let item;
		await waitFor( () => {
			item = screen.getByText( "United Kingdom - UK" );
		}, { timeout: 1000 } );
		fireEvent.click( item );

		expect( setCountryMock ).toHaveBeenCalledWith( "uk" );
	} );
} );
