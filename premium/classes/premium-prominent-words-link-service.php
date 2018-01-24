<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium
 */

/**
 * Handles the actual requests to the prominent words link endpoint.
 */
class WPSEO_Premium_Prominent_Words_Link_Service {

	/**
	 * Links the posted terms to the given post id.
	 *
	 * @param WP_REST_Request $request Data from the query request.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function save( WP_REST_Request $request ) {
		$post_id = (int) $request['id'];
		$post    = get_post( $post_id );

		if ( ! $post instanceof WP_Post ) {
			return new WP_REST_Response( __( 'There is no post found for the given post id.', 'wordpress-seo-premium' ) );
		}

		$terms_to_save = $request->get_param( WPSEO_Premium_Prominent_Words_Registration::TERM_NAME );
		if ( ! $terms_to_save ) {
			$terms_to_save = array();
		}

		wp_set_object_terms( $post_id, $terms_to_save, WPSEO_Premium_Prominent_Words_Registration::TERM_NAME );

		// Save the post meta.
		$this->save_version_number( $post_id );

		return new WP_REST_Response( __( 'The terms saved successfully for the given post.', 'wordpress-seo-premium' ) );
	}

	/**
	 * Saves the version number as a meta.
	 *
	 * @param int $post_id The post ID to save the version number for.
	 */
	protected function save_version_number( $post_id ) {
		$versioning = new WPSEO_Premium_Prominent_Words_Versioning();
		$versioning->save_version_number( $post_id );
	}
}
