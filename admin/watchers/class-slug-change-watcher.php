<?php
/** @package WPSEO\Admin\Watchers */

/**
 * Class WPSEO_Slug_Change_Watcher
 */
class WPSEO_Slug_Change_Watcher implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {

		// If the current plugin is Yoast SEO Premium, stop registering.
		if ( WPSEO_Utils::is_yoast_seo_premium() ) {
			return;
		}

		// Detect a post slug change.
		add_action( 'post_updated', array( $this, 'detect_slug_change' ), 12, 3 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Enqueues the quick edit handler.
	 */
	public function enqueue_assets() {
		global $pagenow;

		if ( ! in_array( $pagenow, array( 'edit.php' ), true )  ) {
			return;
		}

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'quick-edit-handler' );
	}

	/**
	 * Detects if the slug changed, hooked into 'post_updated'.
	 *
	 * @param integer $post_id     The ID of the post. Unused.
	 * @param WP_Post $post        The post with the new values.
	 * @param WP_Post $post_before The post with the previous values.
	 *
	 * @return void
	 */
	public function detect_slug_change( $post_id, $post, $post_before ) {
		// If post is a revision do not advise creating a redirect.
		if ( wp_is_post_revision( $post_before ) && wp_is_post_revision( $post ) ) {
			return;
		}

		// There is no slug change.
		if ( $post->post_name === $post_before->post_name ) {
			return;
		}

		// If the post URL wasn't visible before, or isn't visible now, don't advise creating a redirect.
		if ( ! $this->check_visible_post_status( $post_before->post_status ) || ! $this->check_visible_post_status( $post->post_status ) ) {
			return;
		}

		$post_type_object = get_post_type_object( $post->post_type );

		// If the post type of this post wasn't registered default back to post.
		if ( $post_type_object === null ) {
			$post_type_object = get_post_type_object( 'post' );
		}

		$this->add_notification( $post_type_object->labels->singular_name );
	}

	/**
	 * Checks whether the given post status is visible or not.
	 *
	 * @param string $post_status The post status to check.
	 *
	 * @return bool Whether or not the post is visible.
	 */
	protected function check_visible_post_status( $post_status ) {
		$visible_post_statuses = array(
			'publish',
			'static',
			'private',
		);

		return in_array( $post_status, $visible_post_statuses, true );
	}

	/**
	 * Adds a notification to be shown on the next page request since posts are updated in an ajax request.
	 *
	 * @param string $post_type_label The singular_name label from a post_type_object.
	 *
	 * @return void
	 */
	protected function add_notification( $post_type_label ) {
		$notification = new Yoast_Notification(
			sprintf(
				/* translators: %1$s expands to the translated name of the post type, %2$s expands to the anchor opening tag, %3$s to the anchor closing tag. */
				__(
					'You just changed the URL of this %1$s. To ensure your visitors do not see a 404 on the old URL, you should create a redirect. %2$sLearn how to create redirects here.%3$s',
					'wordpress-seo'
				),
				$post_type_label,
				'<a href="https://yoa.st/1d0" target="_blank">',
				'</a>'
			), array( 'type' => 'notice-info' )
		);

		$notification_center = Yoast_Notification_Center::get();
		$notification_center->add_notification( $notification );
	}
}
