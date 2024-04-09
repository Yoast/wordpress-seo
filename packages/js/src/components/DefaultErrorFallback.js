import classNames from "classnames";
import PropTypes from "prop-types";
import { useSelect } from "@wordpress/data";
import { useCallback, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { disableMetaboxTabs } from "../helpers/disableMetaboxTabs";
import ScoreIconPortal from "./portals/ScoreIconPortal";
import { Root, Title, Alert, Button } from "@yoast/ui-library";
import { useRootContext } from "@yoast/externals/contexts";

/**
 * The default error fallback component.
 *
 * @param {Object} error The error instance.
 *
 * @returns {JSX.Element} The error fallback element.
 */
export const DefaultErrorFallback = ( { error } ) => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );
	const supportLink = useSelect( select => select( "yoast-seo/editor" ).selectLink( "https://yoa.st/metabox-sidebar-error-support" ) );
	const isRtl = useSelect( select => select( "yoast-seo/editor" ).getPreference( "isRtl", false ) );
	const { locationContext } = useRootContext();

	useEffect( () => {
		if ( locationContext.includes( "metabox" ) ) {
			disableMetaboxTabs();
		}
	}, [ locationContext, disableMetaboxTabs ] );

	return (
		<Root context={ { isRtl } }>
			<div role="alert" className="yst-max-w-screen-sm yst-p-8 yst-space-y-4">
				<Title>{ __( "Something went wrong. An unexpected error occurred.", "wordpress-seo" ) }</Title>
				<p>{ __( "We're very sorry, but it seems like the following error has interrupted our application:", "wordpress-seo" ) }</p>
				<Alert variant="error">{ error?.message || __( "Undefined error message.", "wordpress-seo" ) }</Alert>
				<p>{ __( "Unfortunately, this means that all your unsaved changes will be lost. You can try and refresh this page to resolve the problem. If this error still occurs, please get in touch with our support team, and we'll get you all the help you need!", "wordpress-seo" ) }</p>
				<div
					className={ classNames(
						locationContext.includes( "metabox" ) && "yst-flex yst-gap-2",
						locationContext.includes( "sidebar" ) && "yst-grid yst-grid-cols-1 yst-gap-y-2"
					) }
				>
					<Button
						className={ classNames(
							locationContext.includes( "sidebar" ) && "yst-order-last"
						) }
						onClick={ handleRefreshClick }
					>
						{ __( "Refresh this page", "wordpress-seo" ) }
					</Button>
					<Button variant="secondary" as="a" href={ supportLink } target="_blank" rel="noopener">
						{ __( "Contact support", "wordpress-seo" ) }
					</Button>
				</div>
			</div>
			{ locationContext.includes( "metabox" ) && <>
				<ScoreIconPortal
					target="wpseo-readability-score-icon"
					scoreIndicator={ "not-set" }
				/>
				<ScoreIconPortal
					target="wpseo-seo-score-icon"
					scoreIndicator={ "not-set" }
				/>
			</> }
		</Root>
	);
};

DefaultErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
};
