import apiFetch from "@wordpress/api-fetch";
import { useSelect } from "@wordpress/data";
import { Fragment, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, Button, useModalContext } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { STORE_NAME_AI } from "../../constants";
import { Body, title } from "./messages/subscription";

/**
 * @param {string[]} [invalidSubscriptions=[]] The array with the names of products with invalid subscription.
 * @returns {JSX.Element} The element.
 */
export const SubscriptionError = ( { invalidSubscriptions = [] } ) => {
	const bustSubscriptionCacheEndpoint = useSelect( select => select( STORE_NAME_AI ).selectBustSubscriptionCacheEndpoint(), [] );

	const { onClose } = useModalContext();

	const handleRefresh = useCallback( async() => {
		try {
			await apiFetch( {
				path: bustSubscriptionCacheEndpoint,
				method: "POST",
				parse: false,
			} );
		} catch ( e ) {
			console.error( e );
		}
		window.location.reload();
	}, [] );

	return (
		<Fragment>
			<Alert variant="error">
				<span className="yst-block yst-font-medium">{ title }</span>
				<Body invalidSubscriptions={ invalidSubscriptions } />
			</Alert>
			<div className="yst-mt-6 yst-mb-1 yst-flex yst-space-x-3 rtl:yst-space-x-reverse yst-place-content-end">
				<Button variant="secondary" onClick={ onClose }>
					{ __( "Close", "wordpress-seo" ) }
				</Button>
				<Button variant="primary" onClick={ handleRefresh }>
					{ __( "Refresh page", "wordpress-seo" ) }
				</Button>
			</div>
		</Fragment>
	);
};

SubscriptionError.propTypes = {
	invalidSubscriptions: PropTypes.arrayOf( PropTypes.string ),
};
