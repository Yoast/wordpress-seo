<?php


class WPSEO_Premium_Prominent_Words_Service {

	/**
	 * Query the terms for the supplied word
	 *
	 * @param WP_REST_Request $request Data from the query request.
	 * @return WP_REST_Response
	 */
	public function query( WP_REST_Request $request ) {
		$word = $request->get_param( 'word' );

		$term = get_term_by( 'name', $word, WPSEO_Premium_Prominent_Words_Registration::TERM_NAME );

		if ( ! $term instanceof WP_Term ) {
			return new WP_REST_Response( null );
		}

		$controller = new WP_REST_Terms_Controller( WPSEO_Premium_Prominent_Words_Registration::TERM_NAME );

		return $controller->prepare_item_for_response( $term, $request );
	}
}
