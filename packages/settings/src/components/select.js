import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import Select from "@yoast/admin-ui-toolkit/components/select";
import { REDUX_STORE_KEY } from "../constants";

/**
 * The container connecting the Select component to the store.
 *
 * @param {Object} props The props to pass to the Select component.
 *
 * @returns {JSX.Element} The connected Select component.
 */
export default compose( [
	withSelect( ( select, { dataPath, optionPathForFallbackValue } ) => {
		const {
			getData,
			getOption,
			getValidationErrorProp,
		} = select( REDUX_STORE_KEY );

		let value = getData( dataPath );
		if ( ! value && optionPathForFallbackValue ) {
			value = getOption( optionPathForFallbackValue, "" );
		}

		return {
			value,
			error: getValidationErrorProp( dataPath ),
			id: dataPath,
		};
	} ),
	withDispatch( ( dispatch, { dataPath } ) => {
		const {
			setData,
		} = dispatch( REDUX_STORE_KEY );

		return {
			onChange: ( event ) => setData( dataPath, event ),
		};
	} ),
] )( Select );
