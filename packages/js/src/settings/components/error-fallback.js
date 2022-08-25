import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Title, Alert, Button } from "@yoast/ui-library";
import { useSelectSettings } from "../store";

/**
 * @param {Object} error The error instance.
 * @returns {JSX.Element} The error fallback element.
 */
const ErrorFallback = ( { error } ) => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );
	const supportLink = useSelectSettings( "selectLink", "", "https://yoast.com/help/support" );

	return (
		<div role="alert" className="yst-max-w-screen-sm yst-p-8 yst-space-y-4">
			<Title>{ __( "Oops! An unexpected error has occured.", "wordpress-seo" ) }</Title>
			<p>{ __( "We're very sorry, but it seems the following error has halted our application:", "wordpress-seo" ) }</p>
			<Alert variant="error">{ error?.message || "Undefined error message." }</Alert>
			<p>{ __( "You can refresh to try again, but all your unsaved changes will be lost. If this error occurs again, please contact our support team and we'll get you sorted.", "wordpress-seo" ) }</p>
			<div className="yst-flex yst-gap-2">
				<Button onClick={ handleRefreshClick }>{ __( "Refresh", "wordpress-seo" ) }</Button>
				<Button variant="secondary" as="a" href={ supportLink } target="blank" rel="noreferrer">
					{ __( "Contact support", "wordpress-seo" ) }
				</Button>
			</div>
		</div>
	);
};

ErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
};

export default ErrorFallback;
