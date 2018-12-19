<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the link watcher. This class will watch for the save_post hook being called.
 */
class WPSEO_Link_Watcher {

	/**
	 * @var WPSEO_Link_Content_Processor
	 */
	protected $content_processor;

	/**
	 * WPSEO_Link_Watcher constructor.
	 *
	 * @param WPSEO_Link_Content_Processor $content_processor The processor to use.
	 */
	public function __construct( WPSEO_Link_Content_Processor $content_processor ) {
		$this->content_processor = $content_processor;
	}

	/**
	 * Registers the hooks.
	 *
	 * @returns void
	 */
	public function register_hooks() {
		add_action( 'save_post', array( $this, 'save_post' ), 10, 2 );
		add_action( 'delete_post', array( $this, 'delete_post' ) );
	}

	/**
	 * Saves the links that are used in the post.
	 *
	 * @param int     $post_id The post id to.
	 * @param WP_Post $post    The post object.
	 *
	 * @return void
	 */
	public function save_post( $post_id, WP_Post $post ) {
		if ( ! WPSEO_Link_Table_Accessible::is_accessible() || ! WPSEO_Meta_Table_Accessible::is_accessible() ) {
			return;
		}

		// When the post is a revision.
		if ( wp_is_post_revision( $post->ID ) ) {
			return;
		}

		$post_statuses_to_skip = array( 'auto-draft', 'trash' );

		if ( in_array( $post->post_status, $post_statuses_to_skip, true ) ) {
			return;
		}

		// When the post isn't processable, just remove the saved links.
		if ( ! $this->is_processable( $post_id ) ) {
			return;
		}

		$this->process( $post_id, $post->post_content );
	}

	/**
	 * Removes the seo links when the post is deleted.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return void
	 */
	public function delete_post( $post_id ) {
		if ( ! WPSEO_Link_Table_Accessible::is_accessible() || ! WPSEO_Meta_Table_Accessible::is_accessible() ) {
			return;
		}

		// Fetch links to update related linked objects.
		$links = $this->content_processor->get_stored_internal_links( $post_id );

		// Update the storage, remove all links for this post.
		$storage = new WPSEO_Link_Storage();
		$storage->cleanup( $post_id );

		// Update link counts for object and referenced links.
		$this->content_processor->update_link_counts( $post_id, 0, $links );
	}

	/**
	 * Checks if the post is processable.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return bool True when the post is processable.
	 */
	protected function is_processable( $post_id ) {
		/*
		 * Do not use the `wpseo_link_count_post_types` because we want to always count the links,
		 * even if we don't show them.
		 */
		$post_types = WPSEO_Post_Type::get_accessible_post_types();

		return isset( $post_types[ get_post_type( $post_id ) ] );
	}

	/**
	 * Processes the content for the given post id.
	 *
	 * @param int    $post_id The post id to process.
	 * @param string $content The content to process.
	 *
	 * @return void
	 */
	private function process( $post_id, $content ) {
		// Apply the filters to have the same content as shown on the frontend.
		$content = apply_filters( 'the_content', $content );
		$content = str_replace( ']]>', ']]&gt;', $content );

		$this->content_processor->process( $post_id, $content );
	}
}
