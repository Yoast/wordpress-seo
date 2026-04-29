import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { Button, Root } from "@yoast/ui-library";
import { CONTENT_PLANNER_STORE, FEATURE_MODAL_STATUS } from "../constants";
import classNames from "classnames";

/**
 * The section for the content planner feature in the Yoast sidebar.
 *
 * @param {Object}   props           The component props.
 * @param {string}   props.location  The location where the editor item is rendered. Can be "sidebar" or "metabox".
 * @param {Function} props.setFeatureModalStatus The function to set the feature modal status.
 * @returns {JSX.Element} The Content Planner section in the sidebar.
 */
export const ContentPlannerEditorItem = ( { location, setFeatureModalStatus } ) => {
	const handleClick = useCallback( () => {
		setFeatureModalStatus( FEATURE_MODAL_STATUS.idle );
	}, [ setFeatureModalStatus ] );

	const minPostsMet = useSelect( select => select( CONTENT_PLANNER_STORE ).selectIsMinPostsMet(), [] );
	const helperTextId = "yoast-content-planner-min-posts-notice-" + location;

	return <Root><div
		className={ classNames(
			"yst-p-4",
			location === "metabox" && "yst-flex yst-items-center yst-gap-3"
		) }
	>
		<Button
			variant="ai-secondary"
			onClick={ handleClick }
			disabled={ ! minPostsMet }
			aria-disabled={ ! minPostsMet }
			aria-describedby={ minPostsMet ? null : helperTextId }
			className={ location === "sidebar" ? "yst-w-full" : "" }
		>
			{ __( "Get content suggestions", "wordpress-seo" ) }
		</Button>
		{ ! minPostsMet && (
			<span
				id={ helperTextId }
				className={ classNames(
					"yst-text-sm yst-text-slate-500 yst-italic",
					location === "sidebar" && "yst-flex yst-mt-1 yst-justify-center"
				) }
			>
				{ __( "Available after 5 published posts", "wordpress-seo" ) }
			</span>
		) }
	</div>
	</Root>;
};
