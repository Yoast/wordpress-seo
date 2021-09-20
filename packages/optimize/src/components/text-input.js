import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { TextInput } from "@yoast/admin-ui-toolkit/components";

import { OPTIMIZE_STORE_KEY } from "../constants";

/**
 * The container connecting the TextInput component to the store.
 *
 * @param {Object} props The props to pass to the TextInput component.
 *
 * @returns {JSX.Element} The connected TextInput.
 */
export default compose( [
	withSelect( ( select, { dataPath, id } ) => {
		const { getData } = select( OPTIMIZE_STORE_KEY );

		return {
			value: getData( dataPath, "" ),
			// Fallback to dataPath for id prop
			id: id || dataPath,
		};
	} ),
	withDispatch( ( dispatch, { dataPath } ) => {
		const { setData } = dispatch( OPTIMIZE_STORE_KEY );

		return {
			onChange: ( event ) => setData( dataPath, event.target.value ),
		};
	} ),
] )( TextInput );
