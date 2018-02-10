<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Post_Watcher.
 */
class WPSEO_Post_Watcher extends WPSEO_Watcher {

	/**
	 * @var string Type of watcher, will be used for the filters.
	 */
	protected $watch_type = 'post';

	/**
	 * Constructor of class.
	 */
	public function __construct() {
		$this->set_hooks();
	}

	/**
	 * Load needed js file.
	 */
	public function page_scripts() {
		global $pagenow;

		if ( ! $this->post_redirect_can_be_made( $pagenow ) ) {
			return;
		}

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$version       = $asset_manager->flatten_version( WPSEO_VERSION );

		if ( $pagenow === 'edit.php' || $this->is_nested_pages( $pagenow ) ) {
			wp_enqueue_script( 'wp-seo-premium-quickedit-notification', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/dist/wp-seo-premium-quickedit-notification-' . $version . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
			wp_localize_script( 'wp-seo-premium-quickedit-notification', 'wpseoPremiumStrings', WPSEO_Premium_Javascript_Strings::strings() );
		}

		if ( $pagenow === 'post.php' ) {
			wp_enqueue_script( 'wp-seo-premium-redirect-notifications', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/dist/wp-seo-premium-redirect-notifications-' . $version . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
			wp_localize_script( 'wp-seo-premium-redirect-notifications', 'wpseoPremiumStrings', WPSEO_Premium_Javascript_Strings::strings() );
		}
	}

	/**
	 * Add an extra field to post edit screen so we know the old URL in the 'post_updated' hook.
	 *
	 * @param WP_Post $post The post object to get the ID from.
	 */
	public function old_url_field( $post ) {
		// $post must be set.
		if ( null !== $post ) {
			$url = $this->get_target_url( $post->ID );

			echo $this->parse_url_field( $url, 'post' );
		}
	}

	/**
	 * Detect if the slug changed, hooked into 'post_updated'.
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

		// There is no slug change.
		if ( $post->post_name === $post_before->post_name ) {
			return false;
		}

		/**
		 * Filter: 'wpseo_premium_post_redirect_slug_change' - Check if a redirect should be created on post slug change.
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

		// Maybe we can undo the created redirect.
		$this->notify_undo_slug_redirect( $old_url, $new_url );
	}

	/**
	 * Checks whether the given post is public or not.
	 *
	 * @param integer $post_id The current post ID.
	 *
	 * @return bool
	 */
	private function check_public_post_status( $post_id ) {
		$public_post_statuses = array(
			'publish',
			'static',
			'private',
		);

		/**
		 * Filter: 'wpseo_public_post_statuses' - Allow changing the statuses that are expected to have caused a URL to be public.
		 *
		 * @api array $published_post_statuses The statuses that'll be treated as published.
		 * @param object $post The post object we're doing the published check for.
		 */
		$public_post_statuses = apply_filters( 'wpseo_public_post_statuses', $public_post_statuses, $post_id );

		return ( in_array( get_post_status( $post_id ), $public_post_statuses, true ) );
	}

	/**
	 * Offer to create a redirect from the post that is about to get trashed.
	 *
	 * @param integer $post_id The current post ID.
	 */
	public function detect_post_trash( $post_id ) {

		$url = $this->check_if_redirect_needed( $post_id );
		if ( ! empty( $url ) ) {

			$id = 'wpseo_redirect_' . md5( $url );

			// Format the message.
			$message = sprintf(
				/* translators: %1$s: Yoast SEO Premium, %2$s: List with actions, %3$s: <a href=''>, %4$s: </a>, %5$s: Slug to post */
				__( '%1$s detected that you moved a post (%5$s) to the trash. You can either: %2$s Don\'t know what to do? %3$sRead this post%4$s.', 'wordpress-seo-premium' ),
				'Yoast SEO Premium',
				$this->get_delete_action_list( $url, $id ),
				'<a target="_blank" href="https://yoast.com/deleting-pages-from-your-site/#utm_source=wordpress-seo-premium-' . $this->watch_type . '-watcher&amp;utm_medium=dialog&amp;utm_campaign=410-redirect">',
				'</a>',
				'<code>' . $url . '</code>'
			);

			$this->create_notification( $message, 'trash' );
		}

	}

	/**
	 * Offer to create a redirect from the post that is about to get  restored from the trash.
	 *
	 * @param integer $post_id The current post ID.
	 */
	public function detect_post_untrash( $post_id ) {
		$redirect = $this->check_if_redirect_needed( $post_id, true );

		if ( $redirect ) {

			$id = 'wpseo_undo_redirect_' . md5( $redirect->get_origin() );

			// Format the message.
			$message = sprintf(
				/* translators: %1$s: Yoast SEO Premium, %2$s: <a href='{undo_redirect_url}'>, %3$s: </a>, %4$s: Slug to post */
				__( '%1$s detected that you restored a post (%4$s) from the trash, for which a redirect was created. %2$sClick here to remove the redirect%3$s', 'wordpress-seo-premium' ),
				'Yoast SEO Premium',
				'<button type="button" class="button" onclick=\'' . $this->javascript_undo_redirect( $redirect, $id ) . '\'>',
				'</button>',
				'<code>' . $redirect->get_origin() . '</code>'
			);

			$this->create_notification( $message, 'untrash' );
		}

	}

	/**
	 * Offer to create a redirect from the post that is about to get deleted.
	 *
	 * @param integer $post_id The current post ID.
	 */
	public function detect_post_delete( $post_id ) {

		// We don't want to redirect menu items.
		if ( is_nav_menu_item( $post_id ) ) {
			return;
		}


		// When the post comes from the trash or if the post is a revision then skip further execution.
		if ( get_post_status( $post_id ) === 'trash' || wp_is_post_revision( $post_id ) ) {
			return;
		}

		// Is a redirect needed.
		$url = $this->check_if_redirect_needed( $post_id );
		if ( ! empty( $url ) ) {
			$this->set_delete_notification( $url );
		}
	}

	/**
	 * Look up if URL does exists in the current redirects.
	 *
	 * @param string $url URL to search for.
	 *
	 * @return bool
	 */
	protected function get_redirect( $url ) {
		$redirect_manager = new WPSEO_Redirect_Manager();

		return $redirect_manager->get_redirect( $url );
	}

	/**
	 * This method checks if a redirect is needed.
	 *
	 * This method will check if URL as redirect already exists.
	 *
	 * @param integer $post_id      The current post ID.
	 * @param bool    $should_exist Boolean to determine if the URL should be exist as a redirect.
	 *
	 * @return WPSEO_Redirect|string|void
	 */
	protected function check_if_redirect_needed( $post_id, $should_exist = false ) {

		// No revisions please.
		if ( $this->check_public_post_status( $post_id ) ) {
			// Get the right URL.
			$url = $this->get_target_url( $post_id );

			// If $url is not a single /, there may be the option to create a redirect.
			if ( $url !== '/' ) {
				// Message should only be shown if there isn't already a redirect.
				$redirect = $this->get_redirect( $url );

				if ( is_a( $redirect, 'WPSEO_Redirect' ) === $should_exist ) {
					if ( $should_exist === false ) {
						return $url;
					}

					return $redirect;
				}
			}
		}
	}

	/**
	 * Get the URL to the post and returns it's path.
	 *
	 * @param integer $post_id The current post ID.
	 *
	 * @return string
	 */
	protected function get_target_url( $post_id ) {
		// Use the correct URL path.
		$url = wp_parse_url( get_permalink( $post_id ) );
		if ( is_array( $url ) && isset( $url['path'] ) ) {
			return $url['path'];
		}

		return '';
	}

	/**
	 * Get the old URL.
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
	 * Setting the hooks for the post watcher.
	 */
	protected function set_hooks() {
		global $pagenow;

		// Only set the hooks for the page where they are needed.
		if ( ! ( $this->post_redirect_can_be_made( $pagenow ) ) ) {
			return;
		}

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

	/**
	 * Returns the undo message for the post.
	 *
	 * @return string
	 */
	protected function get_undo_slug_notification() {
		/* translators: %1$s: Yoast SEO Premium, %2$s and %3$s expand to a link to the admin page, %4$s: Old slug of the post, %5$s: New slug of the post, the text surrounded by %6$s and %7$s is placed in a button that can undo the created redirect */
		return __(
			'%1$s created a %2$sredirect%3$s from the old post URL to the new post URL. %6$sClick here to undo this%7$s <br> Old URL: %4$s <br> New URL: %5$s',
			'wordpress-seo-premium'
		);
	}

	/**
	 * Returns the delete message for the post.
	 *
	 * @return string
	 */
	protected function get_delete_notification() {
		/* translators: %1$s: Yoast SEO Premium, %2$s: List with actions, %3$s: <a href='{post_with_explaination.}'>, %4$s: </a> */
		return __(
			'%1$s detected that you deleted a post. You can either: %2$s Don\'t know what to do? %3$sRead this post %4$s.',
			'wordpress-seo-premium'
		);
	}

	/**
	 * Is the current page valid to make a redirect from.
	 *
	 * @param string $current_page The currently opened page.
	 *
	 * @return bool True when a redirect can be made on this page.
	 */
	protected function post_redirect_can_be_made( $current_page ) {
		return $this->is_post_page( $current_page ) || $this->is_action_inline_save() || $this->is_nested_pages( $current_page );
	}

	/**
	 * Is the current page related to a post (edit/overview).
	 *
	 * @param string $current_page The current opened page.
	 *
	 * @return bool True when page is a post edit/overview page.
	 */
	protected function is_post_page( $current_page ) {
		return ( in_array( $current_page, array( 'edit.php', 'post.php' ), true ) );
	}

	/**
	 * Is the page in an AJAX-request and is the action "inline save".
	 *
	 * @return bool True when in an AJAX-request and the action is inline-save.
	 */
	protected function is_action_inline_save() {
		return ( defined( 'DOING_AJAX' ) && DOING_AJAX && filter_input( INPUT_POST, 'action' ) === 'inline-save' );
	}

	/**
	 * Checks if current page is loaded by nested pages.
	 *
	 * @param string $current_page The current page.
	 *
	 * @return bool True when the current page is nested pages.
	 */
	protected function is_nested_pages( $current_page ) {
		return ( $current_page === 'admin.php' && filter_input( INPUT_GET, 'page' ) === 'nestedpages' );
	}
}
