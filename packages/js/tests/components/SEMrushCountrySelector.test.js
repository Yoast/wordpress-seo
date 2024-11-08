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
} );
