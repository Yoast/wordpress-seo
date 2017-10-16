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
		add_action( 'transition_post_status', array( $this, 'post_status_transition' ), 10, 3 );
		add_action( 'delete_post', array( $this, 'delete_post' ) );
	}

	/**
	 * Saves the links from in the post.
	 *
	 * @param string  $new_status The new status.
	 * @param string  $old_status The old status.
	 * @param WP_Post $post       The post object.
	 *
	 * @return void
	 */
	public function post_status_transition( $new_status, $old_status, WP_Post $post ) {
		// When the post is a revision.
		if ( wp_is_post_revision( $post->ID ) ) {
			return;
		}

		// When there isn't a status change.
		if ( $new_status === $old_status ) {
			return;
		}

		// When the post isn't processable, just remove the saved links.
		if ( ! $this->is_processable( $new_status, $post->ID ) ) {
			// When it is not processable, just remove all references.
			$this->delete_post( $post->ID );

			return;
		}

		$this->process( $post->ID, $post->post_content );
	}

	/**
	 * Saves the links that are used in the post.
	 *
	 * @deprecated 5.7
	 *
	 * @param int     $post_id The post id to.
	 * @param WP_Post $post    The post object.
	 *
	 * @return void
	 */
	public function save_post( $post_id, WP_Post $post ) {
		_deprecated_function( __METHOD__, '5.7' );

		// When the post is a revision.
		if ( wp_is_post_revision( $post->ID ) ) {
			return;
		}

		if ( ! $this->is_processable( get_post_status( $post_id ) , $post->ID ) ) {
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
		$storage = new WPSEO_Link_Storage();
		$storage->cleanup( $post_id );
	}

	/**
	 * Checks if the post is processable.
	 *
	 * @param string $post_status The post status status.
	 * @param int    $post_id     The post id.
	 *
	 * @return bool True when the post is processable.
	 */
	protected function is_processable( $post_status, $post_id ) {
		// When the post status is not publish.
		if ( $post_status !== 'publish' ) {
			return false;
		}

		// When the post type is not public.
		$post_type        = get_post_type( $post_id );
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
}
