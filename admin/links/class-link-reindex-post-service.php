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
		return new WP_REST_Response( $this->process_posts() );
	}

	/**
	 * Returns the posts.
	 *
	 * @return int The total amount of unprocessed posts.
	 */
	protected function process_posts() {
		if ( ! $this->is_processable() ) {
			return 0;
		}

		$posts = $this->get_unprocessed_posts();
		array_walk( $posts, array( $this, 'process_post' ) );

		return count( $posts );
	}

	/**
	 * Returns all unprocessed posts.
	 *
	 * @return array The unprocessed posts.
	 */
	protected function get_unprocessed_posts() {
		return WPSEO_Link_Query::get_unprocessed_posts( WPSEO_Link_Utils::get_public_post_types() );
	}

	/**
	 * Checks if the required tables are accessible.
	 *
	 * @return bool True when the tables are accessible.
	 */
	protected function is_processable() {
		return WPSEO_Link_Table_Accessible::check_table_is_accessible() && WPSEO_Meta_Table_Accessible::is_accessible();
	}

	/**
	 * Processes the post.
	 *
	 * @param stdObject $post The post to process.
	 *
	 * @return void
	 */
	protected function process_post( $post ) {
		// Some plugins might output data, so let's buffer this to prevent wrong responses.
		ob_start();

		// Apply the filters to have the same content as shown on the frontend.
		$content = apply_filters( 'the_content', $post->post_content );
		$content = str_replace( ']]>', ']]&gt;', $content );

		ob_end_clean();

		$content_processor = $this->get_content_processor();
		$content_processor->process( $post->ID, $content );
	}

	/**
	 * Returns an instance of the content processor.
	 *
	 * @return WPSEO_Link_Content_Processor The instance of the link content processor.
	 */
	protected function get_content_processor() {
		static $content_processor;

		if ( $content_processor === null ) {
			$content_processor = new WPSEO_Link_Content_Processor( new WPSEO_Link_Storage(), new WPSEO_Meta_Storage() );
		}

		return $content_processor;
	}
}
