<?php

class WPSEO_Link_Reindex_Post_Service {

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_REST_Response
	 */
	public function reindex( WP_REST_Request $request ) {
		global $wpdb;

		$storage = new WPSEO_Link_Storage( $wpdb->get_blog_prefix() );
		$content_processor = new WPSEO_Link_Content_Processor( $storage );

		$posts = WPSEO_Link_Reindex_Post_Query::get_posts_by_post_type( $request->get_param( 'postType' ), 5 );
		foreach( $posts as $post ) {
			// Apply the filters to have the same content as shown on the frontend.
			$content = apply_filters( 'the_content', $post->post_content );
			$content = str_replace( ']]>', ']]&gt;', $content );

			$content_processor->process( $post->ID, $content );
		}

		return new WP_REST_Response( count( $posts ) );
	}
}
