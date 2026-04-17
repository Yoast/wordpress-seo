import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import { Button, Root } from "@yoast/ui-library";
import { FEATURE_MODAL_STATUS } from "../constants";

/**
 * The section for the content planner feature in the Yoast sidebar.
 *
 * @param {Object}   props           The component props.
 * @param {string}   props.location  The location where the editor item is rendered. Can be "sidebar" or "metabox".
 * @param {Function} props.openModal The function to open the content planner modal.
 * @param {Function} props.setFeatureModalStatus The function to set the feature modal status.
 * @returns {JSX.Element} The Content Planner section in the sidebar.
 */
export const ContentPlannerEditorItem = ( { location, openModal, setFeatureModalStatus } ) => {
	const handleClick = useCallback( () => {
		setFeatureModalStatus( FEATURE_MODAL_STATUS.idle );
		openModal();
	}, [ openModal, setFeatureModalStatus ] );

	return <Root><div className="yst-p-4">
		<Button variant="ai-secondary" onClick={ handleClick } className={ location === "sidebar" ? "yst-w-full" : "" }>
			{ __( "Get content suggestions", "wordpress-seo" ) }
		</Button>
	</div>
	</Root>;
};
