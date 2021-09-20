import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { SearchInput } from "@yoast/admin-ui-toolkit/components";

import { OPTIMIZE_STORE_KEY } from "../constants";

/**
 * The container connecting the SearchInput component to the store.
 *
 * @param {Object} props The props to pass to the SearchInput component.
 *
 * @returns {JSX.Element} The connected TextInput.
 */
export default compose( [
	withSelect( ( select ) => {
		const { getQueryData } = select( OPTIMIZE_STORE_KEY );

		return {
			value: getQueryData( "searchTerm" ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setQueryData } = dispatch( OPTIMIZE_STORE_KEY );

		return {
			onChange: ( event ) => setQueryData( "searchTerm", event.target.value ),
		};
	} ),
] )( SearchInput );
