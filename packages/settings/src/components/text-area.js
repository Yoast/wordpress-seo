import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { TextArea } from "@yoast/admin-ui-toolkit/components";
import { REDUX_STORE_KEY } from "../constants";

/**
 * The container connecting the TextInput component to the store.
 *
 * @param {Object} props The props to pass to the TextInput component.
 *
 * @returns {JSX.Element} The connected TextInput.
 */
export default compose( [
	withSelect( ( select, { dataPath } ) => {
		const {
			getData,
			getValidationErrorProp,
		} = select( REDUX_STORE_KEY );

		return {
			value: getData( dataPath, "" ),
			error: getValidationErrorProp( dataPath ),
		};
	} ),
	withDispatch( ( dispatch, { dataPath } ) => {
		const {
			setData,
		} = dispatch( REDUX_STORE_KEY );

		return {
			onChange: ( event ) => setData( dataPath, event.target.value ),
		};
	} ),
] )( TextArea );
