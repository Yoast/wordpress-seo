import { setLinkSuggestions } from "../linkSuggestions";
import { SET_LINK_SUGGESTIONS } from "../linkSuggestions";

describe ( "Set link suggestions action creator " , () => {
	it( "creates the SET_LINK_SUGGESTIONS action" , () => {
		const linkSuggestions = [ "link suggestion 1", "link suggestion 2" ];
		const expected = {
			type: SET_LINK_SUGGESTIONS,
			linkSuggestions,
		};

		const actual = setLinkSuggestions( linkSuggestions );

		expect( actual ).toEqual( expected );
	} );
} );
