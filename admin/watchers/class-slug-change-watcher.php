<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Watchers
 */

/**
 * Class WPSEO_Slug_Change_Watcher.
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

		// Detects deletion of a term.
		add_action( 'delete_term_taxonomy', array( $this, 'detect_term_delete' ) );
	}

	/**
	 * Enqueues the quick edit handler.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		global $pagenow;

		if ( ! in_array( $pagenow, array( 'edit.php', 'edit-tags.php' ), true ) ) {
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
		if ( ! $this->is_post_viewable( $post_id ) ) {
			return;
		}

		/* translators: %1$s expands to the translated name of the post type. */
		$first_sentence = sprintf( __( 'You just trashed a %1$s.', 'wordpress-seo' ), $this->get_post_type_label( get_post_type( $post_id ) ) );
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
		if ( ! $this->is_post_viewable( $post_id ) ) {
			return;
		}

		/* translators: %1$s expands to the translated name of the post type. */
		$first_sentence = sprintf( __( 'You just deleted a %1$s.', 'wordpress-seo' ), $this->get_post_type_label( get_post_type( $post_id ) ) );
		$message        = $this->get_message( $first_sentence );

		$this->add_notification( $message );
	}

	/**
	 * Shows a message when a term is about to get deleted.
	 *
	 * @param integer $term_id The term ID that will be deleted.
	 *
	 * @return void
	 */
	public function detect_term_delete( $term_id ) {
		if ( ! $this->is_term_viewable( $term_id ) ) {
			return;
		}

		$first_sentence = sprintf(
			/* translators: 1: term label */
			__( 'You just deleted a %1$s.', 'wordpress-seo' ),
			$this->get_taxonomy_label_for_term( $term_id )
		);

		$message = $this->get_message( $first_sentence );

		$this->add_notification( $message );
	}

	/**
	 * Checks if the post is viewable.
	 *
	 * @param string $post_id The post id to check.
	 *
	 * @return bool Whether the post is viewable or not.
	 */
	protected function is_post_viewable( $post_id ) {
		$post_type = get_post_type( $post_id );
		if ( ! WPSEO_Post_Type::is_post_type_accessible( $post_type ) ) {
			return false;
		}

		$post_status = get_post_status( $post_id );
		if ( ! $this->check_visible_post_status( $post_status ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Checks if the term is viewable.
	 *
	 * @param string $term_id The term ID to check.
	 *
	 * @return bool Whether the term is viewable or not.
	 */
	protected function is_term_viewable( $term_id ) {
		$term = get_term( $term_id );

		if ( ! $term || is_wp_error( $term ) ) {
			return false;
		}

		$taxonomy = get_taxonomy( $term->taxonomy );
		if ( ! $taxonomy ) {
			return false;
		}

		return $taxonomy->publicly_queryable || $taxonomy->public;
	}

	/**
	 * Gets the taxonomy label to use for a term.
	 *
	 * @param int $term_id The term ID.
	 *
	 * @return string The taxonomy's singular label.
	 */
	protected function get_taxonomy_label_for_term( $term_id ) {
		$term     = get_term( $term_id );
		$taxonomy = get_taxonomy( $term->taxonomy );

		return $taxonomy->labels->singular_name;
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
	 * @return string The full notification.
	 */
	protected function get_message( $first_sentence ) {
		return '<h2>' . __( 'Make sure you don\'t miss out on traffic!', 'wordpress-seo' ) . '</h2>'
			. '<p>'
			. $first_sentence
			. ' ' . __( 'Search engines and other websites can still send traffic to your deleted post.', 'wordpress-seo' )
			. ' ' . __( 'You should create a redirect to ensure your visitors do not get a 404 error when they click on the no longer working URL.', 'wordpress-seo' )
			/* translators: %s expands to Yoast SEO Premium */
			. ' ' . sprintf( __( 'With %s, you can easily create such redirects.', 'wordpress-seo' ), 'Yoast SEO Premium' )
			. '</p>'
			. '<p><a class="yoast-button-upsell" href="' . WPSEO_Shortlinker::get( 'https://yoa.st/1d0' ) . '" target="_blank">'
			/* translators: %s expands to Yoast SEO Premium */
			. sprintf( __( 'Get %s', 'wordpress-seo' ), 'Yoast SEO Premium' )
			. '<span class="screen-reader-text">' . __( '(Opens in a new browser tab)', 'wordpress-seo' ) . '</span>'
			. '<span aria-hidden="true" class="yoast-button-upsell__caret"></span>'
			. '</a></p>';
	}

	/**
	 * Adds a notification to be shown on the next page request since posts are updated in an ajax request.
	 *
	 * @param string $message The message to add to the notification.
	 *
	 * @return void
	 */
	protected function add_notification( $message ) {
		$notification = new Yoast_Notification(
			$message,
			array(
				'type'           => 'notice-warning is-dismissible',
				'yoast_branding' => true,
			)
		);

		$notification_center = Yoast_Notification_Center::get();
		$notification_center->add_notification( $notification );
	}
}
