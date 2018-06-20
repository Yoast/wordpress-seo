<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Watchers
 */

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

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		// Detect a post trash.
		add_action( 'wp_trash_post', array( $this, 'detect_post_trash' ) );

		// Detect a post delete.
		add_action( 'before_delete_post', array( $this, 'detect_post_delete' ) );
	}

	/**
	 * Enqueues the quick edit handler.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		global $pagenow;

		if ( ! in_array( $pagenow, array( 'edit.php' ), true ) ) {
			return;
		}

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'quick-edit-handler' );
	}

	/**
	 * Shows an message when a post is about to get trashed.
	 *
	 * @param integer $post_id The current post ID.
	 *
	 * @return void
	 */
	public function detect_post_trash( $post_id ) {

		$post_status = get_post_status( $post_id );
		if ( ! $this->check_visible_post_status( $post_status ) ) {
			return;
		}

		/* translators: %1$s expands to the translated name of the post type. */
		$first_sentence = sprintf( __( 'You just trashed this %1$s.', 'wordpress-seo' ), $this->get_post_type_label( get_post_type( $post_id ) ) );
		$message        = $this->get_message( $first_sentence );

		$this->add_notification( $message );
	}

	/**
	 * Shows an message when a post is about to get trashed.
	 *
	 * @param integer $post_id The current post ID.
	 *
	 * @return void
	 */
	public function detect_post_delete( $post_id ) {
		// We don't want to redirect menu items.
		if ( is_nav_menu_item( $post_id ) ) {
			return;
		}

		$post_status = get_post_status( $post_id );
		if ( ! $this->check_visible_post_status( $post_status ) ) {
			return;
		}

		/* translators: %1$s expands to the translated name of the post type. */
		$first_sentence = sprintf( __( 'You just deleted this %1$s.', 'wordpress-seo' ), $this->get_post_type_label( get_post_type( $post_id ) ) );
		$message        = $this->get_message( $first_sentence );

		$this->add_notification( $message );
	}

	/**
	 * Retrieves the singular post type label.
	 *
	 * @param string $post_type Post type to retrieve label from.
	 *
	 * @return string The singular post type name.
	 */
	protected function get_post_type_label( $post_type ) {
		$post_type_object = get_post_type_object( $post_type );

		// If the post type of this post wasn't registered default back to post.
		if ( $post_type_object === null ) {
			$post_type_object = get_post_type_object( 'post' );
		}

		return $post_type_object->labels->singular_name;
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
	 * Returns the message around changed URLs.
	 *
	 * @param string $first_sentence The first sentence of the notification.
	 *
	 * @return string
	 */
	protected function get_message( $first_sentence ) {
		return '<h2>' . __( 'Make sure your visitors don\'t get errors!', 'wordpress-seo' ) . '</h2>'
			. '<p>'
			/* translators: %1$s expands to the translated name of the post type, %2$s expands to the anchor opening tag, %3$s to the anchor closing tag. */
			. $first_sentence
			. ' ' . __( 'To ensure your visitors do not get a 404 error when they click on the no longer working URL, you should create a redirect.', 'wordpress-seo' )
			. ' ' . __( 'With Yoast SEO Premium, you can easily create such redirects.', 'wordpress-seo' )
			. '</p>'
			. '<p><a class="button-primary" href="' . WPSEO_Shortlinker::get( 'https://yoa.st/1d0' ) . '" target="_blank">' . __( 'Get Yoast SEO Premium', 'wordpress-seo' ) . '</a></p>';
	}

	/**
	 * Adds a notification to be shown on the next page request since posts are updated in an ajax request.
	 *
	 * @param string $message The singular_name label from a post_type_object.
	 *
	 * @return void
	 */
	protected function add_notification( $message ) {
		$notification = new Yoast_Notification(
			$message, array(
				'type'           => 'notice-warning is-dismissible',
				'yoast-branding' => true,
			)
		);

		$notification_center = Yoast_Notification_Center::get();
		$notification_center->add_notification( $notification );
	}
}
