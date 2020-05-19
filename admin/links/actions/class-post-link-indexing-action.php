<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links\Reindex
 */

/**
 * Class WPSEO_Link_Reindex_Post_Service.
 */
class WPSEO_Post_Link_Indexing_Action {

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
		array_walk( $posts, [ $this, 'process_post' ] );

		return count( $posts );
	}

	/**
	 * Returns all unprocessed posts.
	 *
	 * @return array The unprocessed posts.
	 */
	protected function get_unprocessed_posts() {
		$post_types = apply_filters( 'wpseo_link_count_post_types', WPSEO_Post_Type::get_accessible_post_types() );
		if ( ! is_array( $post_types ) ) {
			return [];
		}
		return WPSEO_Link_Query::get_unprocessed_posts( $post_types );
	}

	/**
	 * Checks if the required tables are accessible.
	 *
	 * @return bool True when the tables are accessible.
	 */
	protected function is_processable() {
		return WPSEO_Link_Table_Accessible::is_accessible() && WPSEO_Meta_Table_Accessible::is_accessible();
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

		$link_builder = $this->get_link_builder();
		$link_builder->build( $post->ID, $content );
	}

	/**
	 * Returns an instance of the content processor.
	 *
	 * @return WPSEO_Link_Builder The instance of the link content processor.
	 */
	protected function get_link_builder() {
		static $link_builder;

		if ( $link_builder === null ) {
			$link_builder = new WPSEO_Link_Builder( new WPSEO_Link_Storage(), new WPSEO_Meta_Storage() );
		}

		return $link_builder;
	}
}
