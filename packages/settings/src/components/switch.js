import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { Switch } from "@yoast/admin-ui-toolkit/components";
import { REDUX_STORE_KEY } from "../constants";
import withHideForOptions from "../helpers/with-hide-for-options";

/**
 * The container connecting the Switch component to the store.
 *
 * @param {Object} props The props to pass to the Switch component.
 *
 * @returns {JSX.Element} The connected Switch.
 */
export default compose( [
	withSelect( ( select, { dataPath } ) => {
		const { getData } = select( REDUX_STORE_KEY );

		return {
			isChecked: getData( dataPath, true ),
		};
	} ),
	withDispatch( ( dispatch, { dataPath } ) => {
		const { toggleData } = dispatch( REDUX_STORE_KEY );

		return {
			onChange: () => toggleData( dataPath ),
		};
	} ),
	withHideForOptions(),
] )( Switch );
