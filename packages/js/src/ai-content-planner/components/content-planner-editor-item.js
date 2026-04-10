import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { Button, Root } from "@yoast/ui-library";
import { FEATURE_MODAL_STORE } from "../constants";

/**
 * The section for the content planner feature in the Yoast sidebar.
 *
 * @param {Object}  props           The component props.
 * @param {string}  props.location  The location where the editor item is rendered. Can be "sidebar" or "metabox".
 * @returns {JSX.Element} The Content Planner section in the sidebar.
 */
export const ContentPlannerEditorItem = ( { location } ) => {
	const { openModal } = useDispatch( FEATURE_MODAL_STORE );

	const handleClick = useCallback( () => {
		openModal( false );
	}, [ openModal ] );

	return <Root><div className="yst-p-4">
		<Button variant="ai-secondary" onClick={ handleClick } className={ location === "sidebar" ? "yst-w-full" : "" }>
			{ __( "Get content suggestions", "wordpress-seo" ) }
		</Button>
	</div>
	</Root>;
};
