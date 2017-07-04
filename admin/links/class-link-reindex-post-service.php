<?php
/**
 * @package WPSEO\Admin\Links\Reindex
 */

/**
 * Class WPSEO_Link_Reindex_Post_Service
 */
class WPSEO_Link_Reindex_Post_Service {

	/**
	 * Reindexes the unprocessed posts by REST request.
	 *
	 * @return WP_REST_Response The response object.
	 */
	public function reindex() {
		$content_processor = new WPSEO_Link_Content_Processor( new WPSEO_Link_Storage(), new WPSEO_Meta_Storage() );

		$posts = WPSEO_Link_Query::get_unprocessed_posts( WPSEO_Link_Utils::get_public_post_types() );
		foreach ( $posts as $post ) {
			// Apply the filters to have the same content as shown on the frontend.
			$content = apply_filters( 'the_content', $post->post_content );
			$content = str_replace( ']]>', ']]&gt;', $content );

			$content_processor->process( $post->ID, $content );
		}

		return new WP_REST_Response( count( $posts ) );
	}
}
