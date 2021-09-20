import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Page as PurePage, Spinner } from "@yoast/admin-ui-toolkit/components";
import { isLoadingStatus } from "@yoast/admin-ui-toolkit/helpers";
import { PropTypes } from "prop-types";

import { REDUX_STORE_KEY } from "../constants";

/**
 * The Page Component.
 *
 * @param {String} title The title of the page.
 * @param {JSX.Node} description The description of the page.
 * @param {*} children The content of the page.
 *
 * @returns {JSX.Element} The Page Component.
 */
export default function Page( { title, description, children } ) {
	const saveStatus = useSelect( ( select ) => select( REDUX_STORE_KEY ).getSaveStatus() );
	const { handleSave } = useDispatch( REDUX_STORE_KEY );
	const handleSubmit = useCallback( handleSave, [ handleSave ] );

	return (
		<PurePage>
			<PurePage.Header
				title={ title }
				description={ description }
			/>

			{ children }
			<div className="yst-bg-gray-50 yst-p-8 yst-rounded-b-lg yst-mt-auto">
				<button
					className="yst-button yst-button--primary"
					onClick={ handleSubmit }
				>
					{ isLoadingStatus( saveStatus ) && <Spinner className="yst-mr-3" /> }
					{ __( "Save changes", "admin-ui" ) }
				</button>
			</div>
		</PurePage>
	);
}

Page.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.node,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ).isRequired,
};

Page.defaultProps = {
	description: "",
};
