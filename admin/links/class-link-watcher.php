<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the link watcher. This class will watch for the save_post hook being called.
 */
class WPSEO_Link_Watcher {

	/** @var WPSEO_Link_Content_Processor */
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
		$this->hook_save_post();
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
		if ( ! WPSEO_Link_Table_Accessible::check_table_is_accessible() || ! WPSEO_Meta_Table_Accessible::is_accessible() ) {
			return;
		}

		// When the post is a revision.
		if ( wp_is_post_revision( $post->ID ) ) {
			return;
		}

		// When the post status is auto-draft.
		if ( $post->post_status === 'auto-draft' ) {
			return;
		}

		// When the post isn't processable, just remove the saved links.
		if ( ! $this->is_processable( $post ) ) {
			return;
		}

		$is_hooked = $this->is_save_post_hooked();
		// Unhook from `save_post` if we are hooked, to prevent recursion.
		if ( $is_hooked ) {
			$this->unhook_save_post();
		}

		$this->process( $post_id, $post->post_content );

		// Only re-hook `save_post` if we were hooked when starting the processing.
		if ( $is_hooked ) {
			$this->hook_save_post();
		}
	}

	/**
	 * Removes the seo links when the post is deleted.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return void
	 */
	public function delete_post( $post_id ) {
		if ( ! WPSEO_Link_Table_Accessible::check_table_is_accessible() || ! WPSEO_Meta_Table_Accessible::is_accessible() ) {
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
	 * @param WP_Post $post The post.
	 *
	 * @return bool True when the post is processable.
	 */
	protected function is_processable( WP_Post $post ) {
		// When the post type is not public.
		$post_type        = get_post_type( $post );
		$post_type_object = get_post_type_object( $post_type );

		return ( $post_type_object !== null && $post_type_object->public === true );
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

	/**
	 * Hooks the `save_post` action to process internal links.
	 *
	 * @return void
	 */
	protected function hook_save_post() {
		add_action( 'save_post', array( $this, 'save_post' ), PHP_INT_MAX, 2 );
	}

	/**
	 * Unhooks the `save_post` action to avoid recursive calls.
	 *
	 * @return void
	 */
	protected function unhook_save_post() {
		remove_action( 'save_post', array( $this, 'save_post' ) );
	}

	/**
	 * Returns if we are hooked on the `save_post` action or not.
	 *
	 * @return bool True if `save_post` is hooked.
	 */
	protected function is_save_post_hooked() {
		return ( false !== has_action( 'save_post', array( $this, 'save_post' ) ) );
	}
}
