import PropTypes from "prop-types";
import { useSelect } from "@wordpress/data";
import { useCallback, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { disableMetaboxTabs } from "../../helpers/disableMetaboxTabs";
import ScoreIconPortal from "../../components/portals/ScoreIconPortal";
import { Root, Title, Alert, Button } from "@yoast/ui-library";

/**
 * @param {Function} handleRefreshClick The function to be called when the "Refresh this page" button is clicked.
 * @param {String} supportLink The link to be used in the "Contact support" button.
 * @returns {JSX.Element} The vertical buttons element.
 */
const HorizontalButtons = ( { handleRefreshClick, supportLink } ) => {
	return (
		<div className="yst-flex yst-gap-2">
			<Button
				onClick={ handleRefreshClick }
			>
				{ __( "Refresh this page", "wordpress-seo" ) }
			</Button>
			<Button variant="secondary" as="a" href={ supportLink } target="_blank" rel="noopener">
				{ __( "Contact support", "wordpress-seo" ) }
			</Button>
		</div>
	);
};

HorizontalButtons.propTypes = {
	handleRefreshClick: PropTypes.func.isRequired,
	supportLink: PropTypes.string.isRequired,
};

/**
 * @param {Function} handleRefreshClick The function to be called when the "Refresh this page" button is clicked.
 * @param {String} supportLink The link to be used in the "Contact support" button.
 * @returns {JSX.Element} The vertical buttons element.
 */
const VerticalButtons = ( { handleRefreshClick, supportLink } ) => {
	return (
		<div className="yst-grid yst-grid-cols-1 yst-gap-y-2">
			<Button
				className="yst-order-last"
				onClick={ handleRefreshClick }
			>
				{ __( "Refresh this page", "wordpress-seo" ) }
			</Button>
			<Button variant="secondary" as="a" href={ supportLink } target="_blank" rel="noopener">
				{ __( "Contact support", "wordpress-seo" ) }
			</Button>
		</div>
	);
};

VerticalButtons.propTypes = {
	handleRefreshClick: PropTypes.func.isRequired,
	supportLink: PropTypes.string.isRequired,
};

/**
 * @param {Object} error The error instance.
 * @returns {JSX.Element} The error fallback element.
 */
export const MetaboxErrorFallback = ( { error } ) => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );
	const supportLink = useSelect( select => select( "yoast-seo/editor" ).selectLink( "https://yoa.st/metabox-error-support" ) );
	const isRtl = useSelect( select => select( "yoast-seo/editor" ).getPreference( "isRtl", false ) );

	useEffect( () => {
		disableMetaboxTabs();
	}, [] );

	return (
		<Root context={ { isRtl } }>
			<ErrorFallback error={ error }>
				<ErrorFallback.HorizontalButtons
					supportLink={ supportLink }
					handleRefreshClick={ handleRefreshClick }
				/>
				<ScoreIconPortal
					target="wpseo-readability-score-icon"
					scoreIndicator={ "not-set" }
				/>
				<ScoreIconPortal
					target="wpseo-seo-score-icon"
					scoreIndicator={ "not-set" }
				/>
			</ErrorFallback>
		</Root>
	);
};

MetaboxErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
};

/**
 * @param {Object} error The error instance.
 * @returns {JSX.Element} The error fallback element.
 */
export const SidebarErrorFallback = ( { error } ) => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );
	const supportLink = useSelect( select => select( "yoast-seo/editor" ).selectLink( "https://yoa.st/sidebar-error-support" ) );
	const isRtl = useSelect( select => select( "yoast-seo/editor" ).getPreference( "isRtl", false ) );

	return (
		<Root context={ { isRtl } }>
			<ErrorFallback error={ error }>
				<ErrorFallback.VerticalButtons
					supportLink={ supportLink }
					handleRefreshClick={ handleRefreshClick }
				/>
			</ErrorFallback>
		</Root>
	);
};

SidebarErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
};

/**
 * @param {Object} error The error instance.
 * @returns {JSX.Element} The error fallback element.
 */
export const ElementorErrorFallback = ( { error } ) => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );
	const supportLink = useSelect( select => select( "yoast-seo/editor" ).selectLink( "https://yoa.st/elementor-error-support" ) );
	const isRtl = useSelect( select => select( "yoast-seo/editor" ).getPreference( "isRtl", false ) );

	return (
		<Root context={ { isRtl } }>
			<ErrorFallback error={ error }>
				<ErrorFallback.VerticalButtons
					supportLink={ supportLink }
					handleRefreshClick={ handleRefreshClick }
				/>
			</ErrorFallback>
		</Root>
	);
};

ElementorErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
};

/**
 * @param {Object} error The error instance.
 * @param {JSX.node} children The children to render.
 * @returns {JSX.Element} The error fallback element.
 */
export const ErrorFallback = ( { error, children } ) => {
	return (
		<div role="alert" className="yst-max-w-screen-sm yst-p-8 yst-space-y-4">
			<Title>{ __( "Something went wrong. An unexpected error occurred.", "wordpress-seo" ) }</Title>
			<p>{ __( "We're very sorry, but it seems like the following error has interrupted our application:", "wordpress-seo" ) }</p>
			<Alert variant="error">{ error?.message || __( "Undefined error message.", "wordpress-seo" ) }</Alert>
			<p>{ __( "Unfortunately, this means that all your unsaved changes will be lost. You can try and refresh this page to resolve the problem. If this error still occurs, please get in touch with our support team, and we'll get you all the help you need!", "wordpress-seo" ) }</p>
			{ children }
		</div>
	);
};

ErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
	children: PropTypes.node,
};

ErrorFallback.VerticalButtons = VerticalButtons;
ErrorFallback.HorizontalButtons = HorizontalButtons;
