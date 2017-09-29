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
	 * Registers the hooks
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
	 */
	public function save_post( $post_id, WP_Post $post ) {
		if ( ! $this->is_processable( $post_id ) ) {
			return;
		}

		$content = $post->post_content;

		// Apply the filters to have the same content as shown on the frontend.
		$content = apply_filters( 'the_content', $content );
		$content = str_replace( ']]>', ']]&gt;', $content );

		$this->content_processor->process( $post_id, $content );
	}

	/**
	 * Removes the seo links when the post is deleted.
	 *
	 * @param int $post_id The post id.
	 */
	public function delete_post( $post_id ) {
		$storage = new WPSEO_Link_Storage();
		$storage->cleanup( $post_id );
	}

	/**
	 * Checks if the post is processable.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return bool True when the post is processable.
	 */
	protected function is_processable( $post_id ) {
		// When the post is a revision.
		if ( wp_is_post_revision( $post_id ) ) {
			return false;
		}

		// When the post status is not publish.
		if ( get_post_status( $post_id ) !== 'publish' ) {
			return false;
		}

		// When the post type is not public.
		$post_type        = get_post_type( $post_id );
		$post_type_object = get_post_type_object( $post_type );
		if ( $post_type_object->public === false ) {
			return false;
		}

		return true;
	}
}
