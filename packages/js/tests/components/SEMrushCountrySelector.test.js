import { noop } from "lodash";
import SEMrushCountrySelector from "../../../js/src/components/modals/SEMrushCountrySelector";
import { fireEvent, render, screen } from "../test-utils";

jest.mock( "@wordpress/api-fetch", () => ( {
	__esModule: true,
	"default": () => ( { response: {} } ),
} ) );

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
			userLocale="en"
			isRtl={ false }
		/> );

		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toHaveTextContent( "Change country" );

		fireEvent.click( button );

		expect( onClickMock ).toHaveBeenCalled();
	} );

	it( "successfully calls the associated setCountry function when a country is selected", () => {
		const onChangeMock = jest.fn();

		render( <SEMrushCountrySelector
			setCountry={ onChangeMock }
			newRequest={ noop }
			setNoResultsFoundnewRequest={ noop }
			setRequestSucceeded={ noop }
			setRequestLimitReached={ noop }
			setRequestFailed={ noop }
			setNoResultsFound={ noop }
			userLocale="en"
			isRtl={ false }
		/> );

		const select = screen.getByRole( "combobox" );

		expect( select ).toBeInTheDocument();

		fireEvent.click( select );
		const options = screen.getAllByRole( "option" );
		fireEvent.click( options[ 3 ] );

		expect( onChangeMock ).toHaveBeenCalled();
	} );
} );
