import PropTypes from "prop-types";

import { useState } from "@wordpress/element";

import EmptyState from "./components/empty-state";
import IndexablesPage from "./indexables-page";

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
	return ( indexingState === "already_done" || indexingState === "completed" ) ? <IndexablesPage /> : <EmptyState setIndexingState={ setIndexingState } />;
}

LandingPage.propTypes = {
	amount: PropTypes.number,
};

export default LandingPage;
