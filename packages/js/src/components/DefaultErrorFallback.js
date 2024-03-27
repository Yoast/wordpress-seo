import PropTypes from "prop-types";
import { get } from "lodash";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";

import { Root, Title, Alert, Button } from "@yoast/ui-library";

/**
 * The default error fallback component.
 *
 * @param {Object} error The error instance.
 * @returns {JSX.Element} The error fallback element.
 */
const DefaultErrorFallback = ( { error } ) => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );
	const linkParams = get( window, "wpseoScriptData.linkParams", [] );

	const supportLink = addQueryArgs( "https://yoa.st/settings-error-support", linkParams );
	const isRtl = get( window, "wpseoAdminGlobalL10n.isRtl", "" );

	return (
		<Root context={ { isRtl } }>
			<div role="alert" className="yst-max-w-screen-sm yst-p-8 yst-space-y-4">
				<Title>{ __( "Something went wrong. An unexpected error occurred.", "wordpress-seo" ) }</Title>
				<p>{ __( "We're very sorry, but it seems like the following error has interrupted our application:", "wordpress-seo" ) }</p>
				<Alert variant="error">{ error?.message || __("Undefined error message.", "wordpress-seo" ) }</Alert>
				<p>{ __( "Unfortunately, this means that all your unsaved changes will be lost. You can try and refresh this page to resolve the problem. If this error still occurs, please get in touch with our support team, and we'll get you all the help you need!", "wordpress-seo" ) }</p>
				<div className="yst-flex yst-gap-2">
					<Button onClick={ handleRefreshClick }>{ __( "Refresh this page", "wordpress-seo" ) }</Button>
					<Button variant="secondary" as="a" href={ supportLink } target="_blank" rel="noopener">
						{ __( "Contact support", "wordpress-seo" ) }
					</Button>
				</div>
			</div>
		</Root>
	);
};

DefaultErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
};

export default DefaultErrorFallback;
