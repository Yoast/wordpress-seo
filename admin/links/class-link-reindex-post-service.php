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
	 * @param WP_REST_Request $request The REST request data.
	 *
	 * @return WP_REST_Response
	 */
	public function reindex( WP_REST_Request $request ) {
		global $wpdb;

		$storage           = new WPSEO_Link_Storage( $wpdb->get_blog_prefix() );
		$content_processor = new WPSEO_Link_Content_Processor( $storage );

		$posts = WPSEO_Link_Query::get_unprocessed_posts( $request->get_param( 'postType' ) );
		foreach ( $posts as $post ) {
			// Apply the filters to have the same content as shown on the frontend.
			$content = apply_filters( 'the_content', $post->post_content );
			$content = str_replace( ']]>', ']]&gt;', $content );

			$content_processor->process( $post->ID, $content );
		}

		return new WP_REST_Response( count( $posts ) );
	}
}
