import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { RadioButton } from "@yoast/admin-ui-toolkit/components";

import { OPTIMIZE_STORE_KEY } from "../constants";

/**
 * The container connecting the RadioButton component to the store.
 *
 * @returns {JSX.Element} The connected RadioButton.
 */
export default compose( [
	withSelect( ( select, { dataPath, value } ) => {
		const { getData } = select( OPTIMIZE_STORE_KEY );

		const checkedValue = value === "true";
		return {
			checked: getData( dataPath ) === checkedValue,
		};
	} ),
	withDispatch( ( dispatch, { dataPath } ) => {
		const { setData } = dispatch( OPTIMIZE_STORE_KEY );
		return {
			onChange: ( event ) => {
				const newValue = event.target.value === "true";
				setData( dataPath, newValue );
			},
		};
	} ),
] )( RadioButton );
