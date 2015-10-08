<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Post_Watcher
 */
class WPSEO_Post_Watcher extends WPSEO_Watcher {

	/**
	 * Type of watcher.
	 *
	 * This will be used for the filters.
	 *
	 * @var string
	 */
	protected $watch_type = 'post';

	/**
	 * Constructor of class
	 */
	public function __construct() {
		$this->set_hooks();
	}

	/**
	 * Load needed js file
	 *
	 * @param string $current_page The page that is opened at the moment.
	 */
	public function page_scripts( $current_page ) {
		if ( $current_page === 'edit.php' || $current_page === 'edit-tags.php' ) {
			wp_enqueue_script( 'wp-seo-premium-quickedit-notification', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/wp-seo-premium-quickedit-notification' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
		}
	}

	/**
	 * Add an extra field to post edit screen so we know the old url in the 'post_updated' hook
	 *
	 * @param WP_Post $post The post object to get the ID from.
	 */
	public function old_url_field( $post ) {
		// $post must be set.
		if ( null != $post ) {
			$url = $this->get_target_url( $post->ID );

			echo $this->parse_url_field( $url, 'post' );
		}
	}


	/**
	 * Detect if the slug changed, hooked into 'post_updated'
	 *
	 * @param integer $post_id     The ID of the post.
	 * @param WP_Post $post        The post with the new values.
	 * @param WP_Post $post_before The post with the previous values.
	 *
	 * @return bool
	 */
	public function detect_slug_change( $post_id, $post, $post_before ) {

		// If post is a revision do not create redirect.
		if ( wp_is_post_revision( $post_before ) && wp_is_post_revision( $post ) ) {
			return false;
		}

		/**
		 * Filter: 'wpseo_premium_post_redirect_slug_change' - Check if a redirect should be created on post slug change
		 *
		 * @api bool unsigned
		 */
		if ( apply_filters( 'wpseo_premium_post_redirect_slug_change', false ) === true ) {
			return true;
		}

		$old_url = $this->get_old_url( $post, $post_before );

		if ( ! $old_url ) {
			return false;
		}

		// If the post URL wasn't public before, or isn't public now, don't even check if we have to redirect.
		if ( ! $this->check_public_post_status( $post_before ) || ! $this->check_public_post_status( $post ) ) {
			return false;
		}

		// Get the new URL.
		$new_url = $this->get_target_url( $post_id );

		// Check if we should create a redirect.
		if ( $this->should_create_redirect( $old_url, $new_url ) ) {
			$this->create_redirect( $old_url, $new_url );

			$this->set_notification( $old_url, $new_url );
		}
	}

	/**
	 * Checks whether the given post is public or not
	 *
	 * @param integer $post_id The current post ID.
	 *
	 * @return bool
	 */
	private function check_public_post_status( $post_id ) {
		$public_post_statuses = array(
			'publish',
			'static',
		);

		/**
		 * Filter: 'wpseo_public_post_statuses' - Allow changing the statuses that are expected to have caused a URL to be public
		 *
		 * @api array $published_post_statuses The statuses that'll be treated as published
		 * @param object $post The post object we're doing the published check for
		 */
		$public_post_statuses = apply_filters( 'wpseo_public_post_statuses', $public_post_statuses, $post_id );

		return ( in_array( get_post_status( $post_id ), $public_post_statuses, true ) );
	}

	/**
	 * Offer to create a redirect from the post that is about to get trashed
	 *
	 * @param integer $post_id The current post ID.
	 */
	public function detect_post_trash( $post_id ) {

		if ( $url = $this->check_if_redirect_needed( $post_id ) ) {

			$id = 'wpseo_redirect_' . md5( $url );

			// Format the message.
			/* translators %1$s: Yoast SEO Premium, %2$s: <a href='{create_redirect_url}'>, %3$s: </a> */
			$message = sprintf(
				__( '%1$s detected that you moved a post to the trash. %2$sClick here to create a redirect from the old post URL%3$s.', 'wordpress-seo-premium' ),
				'Yoast SEO Premium',
				'<a href=\'' . $this->javascript_create_redirect( $url, $id ) . '\'>',
				'</a>'
			);

			$this->create_notification( $message, 'trash', $id );
		}

	}

	/**
	 * Offer to create a redirect from the post that is about to get  restored from the trash
	 *
	 * @param integer $post_id The current post ID.
	 */
	public function detect_post_untrash( $post_id ) {

		if ( $url = $this->check_if_redirect_needed( $post_id, true ) ) {

			$id = 'wpseo_undo_redirect_' . md5( $url );

			// Format the message.
			/* translators %1$s: Yoast SEO Premium, %2$s: <a href='{undo_redirect_url}'>, %3$s: </a> */
			$message = sprintf(
				__( '%1$s detected that you restored a post from the trash. %2$sClick here to remove the redirect%3$s.', 'wordpress-seo-premium' ),
				'Yoast SEO Premium',
				'<a href=\'' . $this->javascript_undo_redirect( $url, $id ). '\'>',
				'</a>'
			);

			$this->create_notification( $message, 'untrash', $id );
		}

	}

	/**
	 * Offer to create a redirect from the post that is about to get deleted
	 *
	 * @param integer $post_id The current post ID.
	 */
	public function detect_post_delete( $post_id ) {

		// When the post comes from the trash or if the post is a revision then skip further execution.
		if ( get_post_status( $post_id ) === 'trash' || wp_is_post_revision( $post_id ) ) {
			return;
		}

		// Is a redirect needed.
		if ( $url = $this->check_if_redirect_needed( $post_id ) ) {

			$id = 'wpseo_redirect_' . md5( $url );

			// Format the message.
			/* translators %1$s: Yoast SEO Premium, %2$s: <a href='{create_redirect_url}'>, %3$s: </a> */
			$message = sprintf(
				__( '%1$s detected that you deleted a post. %2$sClick here to create a redirect from the old post URL%3$s.', 'wordpress-seo-premium' ),
				'Yoast SEO Premium',
				'<a href=\'' . $this->javascript_create_redirect( $url, $id ) . '\'>',
				'</a>'
			);

			$this->create_notification( $message, 'delete', $id );
		}

	}

	/**
	 * Look up if url does exists in the current redirects
	 *
	 * @param string $url Url to search for.
	 *
	 * @return bool
	 */
	public function check_if_redirect_exists( $url ) {
		$redirect_manager = new WPSEO_URL_Redirect_Manager();
		$redirects        = $redirect_manager->get_redirects();

		return array_key_exists( $url, $redirects );
	}

	/**
	 * This method checks if a redirect is needed.
	 *
	 * This method will check if url as redirect already exists
	 *
	 * @param integer $post_id      The current post ID.
	 * @param bool    $should_exist Boolean to determine if the url should be exist as a redirect.
	 *
	 * @return string|void
	 */
	protected function check_if_redirect_needed( $post_id, $should_exist = false ) {

		// No revisions please.
		if ( $this->check_public_post_status( $post_id ) ) {
			// Get the right URL.
			$url = $this->get_target_url( $post_id );

			// If $url is not a single /, there may be the option to create a redirect.
			if ( $url !== '/' ) {
				// Message should only be shown if there isn't already a redirect.
				if ( $this->check_if_redirect_exists( $url ) === $should_exist ) {
					return $url;
				}
			}
		}

	}

	/**
	 * Get the URL to the post and returns it's path
	 *
	 * @param integer $post_id The current post ID.
	 *
	 * @return string
	 */
	protected function get_target_url( $post_id ) {
		// Use the correct URL path.
		$url = parse_url( get_permalink( $post_id ) );
		$url = $url['path'];

		return $url;
	}

	/**
	 * Get the old url
	 *
	 * @param object $post        The post object with the new values.
	 * @param object $post_before The post object with the old values.
	 *
	 * @return bool|string
	 */
	protected function get_old_url( $post, $post_before ) {
		$wpseo_old_post_url = filter_input( INPUT_POST, 'wpseo_old_post_url' );

		if ( empty( $wpseo_old_post_url ) ) {
			// Check if request is inline action and new slug is not old slug, if so set wpseo_post_old_url.
			$action = filter_input( INPUT_POST, 'action' );

			if ( ! empty( $action ) && $action === 'inline-save' && $post->post_name !== $post_before->post_name ) {
				return '/' . $post_before->post_name . '/';
			}
			return false;
		}

		return $wpseo_old_post_url;
	}

	/**
	 * Display notification
	 *
	 * @param string $old_url The old url to the post.
	 * @param string $new_url Unused. The new generated redirect url.
	 */
	protected function set_notification( $old_url, $new_url ) {
		$id = 'wpseo_redirect_' . md5( $old_url );

		// Format the message.
		/* translators %1$s: Yoast SEO Premium, %2$s: <a href='{admin_redirect_url}'>, %3$s: <a href='{undo_redirect_url}'> and %4$s: </a> */
		$message = sprintf(
			__( '%1$s created a %2$sredirect%4$s from the old post URL to the new post URL. %3$sClick here to undo this%4$s.', 'wordpress-seo-premium' ),
			'Yoast SEO Premium',
			'<a target="_blank" href="' . $this->admin_redirect_url( $old_url ) . '">',
			'<a href=\'' . $this->javascript_undo_redirect( $old_url, $id ). '\'>',
			'</a>'
		);

		// Only set notification when the slug change was not saved through quick edit.
		$this->create_notification( $message, 'slug_change', $id );
	}

	/**
	 * Setting the hooks for the post watcher
	 */
	private function set_hooks() {
		add_action( 'admin_enqueue_scripts', array( $this, 'page_scripts' ) );

		// Add old URL field to post edit screen.
		add_action( 'edit_form_advanced', array( $this, 'old_url_field' ), 10, 1 );
		add_action( 'edit_page_form', array( $this, 'old_url_field' ), 10, 1 );

		// Detect a post slug change.
		add_action( 'post_updated', array( $this, 'detect_slug_change' ), 12, 3 );

		// Detect a post trash.
		add_action( 'wp_trash_post', array( $this, 'detect_post_trash' ) );

		// Detect a post untrash.
		add_action( 'untrashed_post', array( $this, 'detect_post_untrash' ) );

		// Detect a post delete.
		add_action( 'before_delete_post', array( $this, 'detect_post_delete' ) );
	}

}
