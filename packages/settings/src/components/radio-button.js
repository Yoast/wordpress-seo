import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { RadioButton } from "@yoast/admin-ui-toolkit/components";

import { REDUX_STORE_KEY } from "../constants";

/**
 * The container connecting the RadioButton component to the store.
 *
 * @returns {JSX.Element} The connected RadioButton.
 */
export default compose( [
	withSelect( ( select, { dataPath, value } ) => {
		const { getData } = select( REDUX_STORE_KEY );
		return {
			checked: getData( dataPath ) === value,
		};
	} ),
	withDispatch( ( dispatch, { dataPath } ) => {
		const { setData } = dispatch( REDUX_STORE_KEY );
		return {
			onChange: ( event ) => {
				setData( dataPath, event.target.value );
			},
		};
	} ),
] )( RadioButton );
