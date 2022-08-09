import PropTypes from "prop-types";

import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import EmptyState from "./components/empty-state";
import IndexablesPage from "./indexables-page";
import { Alert } from "@yoast/ui-library";

/* eslint-disable camelcase */
/* eslint-disable no-warning-comments */
/* eslint-disable complexity */

/**
 * Renders the four indexable tables.
 *
 * @returns {WPElement} A div containing the empty state page.
 */
function LandingPage( { amount } ) {
	const [ indexingState, setIndexingState ] = useState( () => amount === 0 ? "already_done" : "idle" );
	if ( window.wpseoIndexablesPageData?.environment === "staging" ) {
		return <div
			className="yst-max-w-full yst-mt-6 "
		>
			<Alert variant="info">{ __( "This functionality is disabled in staging environments.", "wordpress-seo" ) }</Alert>
		</div>;
	}
	return ( indexingState === "already_done" || indexingState === "completed" ) ? <IndexablesPage /> : <EmptyState setIndexingState={ setIndexingState } />;
}

LandingPage.propTypes = {
	amount: PropTypes.number,
};

export default LandingPage;
