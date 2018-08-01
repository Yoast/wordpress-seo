<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium
 */

/**
 * Handles the actual requests to the prominent words endpoints.
 */
class WPSEO_Premium_Prominent_Words_Service {

	/**
	 * Queries the terms for the supplied word.
	 *
	 * @param WP_REST_Request $request Data from the query request.
	 * @return WP_REST_Response The response with the found term.
	 */
	public function query( WP_REST_Request $request ) {
		$word = $request->get_param( 'word' );

		// WordPress saves the term name with escaped HTML entities, so make sure we search for the word with escaped HTML entities.
		$word = sanitize_term_field( 'name', $word, -1, WPSEO_Premium_Prominent_Words_Registration::TERM_NAME, 'db' );

		$term = get_term_by( 'name', $word, WPSEO_Premium_Prominent_Words_Registration::TERM_NAME );

		if ( ! $term instanceof WP_Term ) {
			return new WP_REST_Response( null );
		}

		$controller = new WP_REST_Terms_Controller( WPSEO_Premium_Prominent_Words_Registration::TERM_NAME );

		return $controller->prepare_item_for_response( $term, $request );
	}
}
