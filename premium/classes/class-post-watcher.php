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
		add_action( 'admin_enqueue_scripts', array( $this, 'page_scripts' ) );
	}

	/**
	 * Load needed js file
	 */
	public function page_scripts() {
		wp_enqueue_script( 'wp-seo-premium-quickedit-notification', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/wp-seo-premium-quickedit-notification' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
	}

	/**
	 * Add an extra field to post edit screen so we know the old url in the 'post_updated' hook
	 *
	 * @param WP_Post $post
	 */
	public function old_url_field( $post ) {
		// $post must be set
		if ( null != $post ) {
			$url = $this->get_target_url( $post->ID );

			echo $this->parse_url_field( $url );
		}
	}


	/**
	 * Detect if the slug changed, hooked into 'post_updated'
	 *
	 * @param integer $post_id
	 * @param WP_Post $post
	 * @param WP_Post $post_before
	 *
	 * @return bool|void
	 */
	public function detect_slug_change( $post_id, $post, $post_before ) {

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
			return;
		}

		// Get the new URL
		$new_url = $this->get_target_url( $post_id );

		// Check if we should create a redirect
		if ( in_array( $post->post_status, array( 'publish', 'static' ) ) && $this->should_create_redirect( $old_url, $new_url ) ) {
			$this->create_redirect( $old_url, $new_url );

			$this->set_notification( $old_url, $new_url );
		}
	}

	/**
	 * Offer to create a redirect from the post that is about to get trashed
	 *
	 * @param integer $post_id
	 */
	public function detect_post_trash( $post_id ) {

		if ( $url = $this->check_if_redirect_needed( $post_id ) ) {

			$id = 'wpseo_redirect_' . md5( $url );

			// Format the message
			/* translators %1$s: <a href='{create_redirect_url}'>, %2$s: </a> */
			$message = sprintf(
				__( 'WordPress SEO Premium detected that you moved a post to the trash. %1$sClick here to create a redirect from the old post URL%2$s.', 'wordpress-seo-premium' ),
				'<a href="' . $this->javascript_create_redirect( $url ) . '">',
				'</a>'
			);

			$this->create_notification( $message, 'trash', $id );
		}

	}

	/**
	 * Offer to create a redirect from the post that is about to get  restored from the trash
	 *
	 * @param integer $post_id
	 */
	public function detect_post_untrash( $post_id ) {

		if ( $url = $this->check_if_redirect_needed( $post_id ) ) {

			$id = 'wpseo_undo_redirect_' . md5( $url );

			// Format the message
			/* translators %1$s: <a href='{undo_redirect_url}'>, %2$s: </a> */
			$message = sprintf(
				__( 'WordPress SEO Premium detected that you restored a post from the trash. %1$sClick here to remove the redirect%2$s.', 'wordpress-seo-premium' ),
				'<a href="' . $this->javascript_undo_redirect( $url, $id ) . '">',
				'</a>'
			);

			$this->create_notification( $message, 'untrash', $id );
		}

	}

	/**
	 * Offer to create a redirect from the post that is about to get deleted
	 *
	 * @param integer $post_id
	 */
	public function detect_post_delete( $post_id ) {

		// Is a redirect needed
		if ( $url = $this->check_if_redirect_needed( $post_id ) ) {

			$id = 'wpseo_redirect_' . md5( $url );

			// Format the message
			/* translators %1$s: <a href='{create_redirect_url}'>, %2$s: </a> */
			$message = sprintf(
				__( 'WordPress SEO Premium detected that you deleted a post. %1$sClick here to create a redirect from the old post URL%2$s.', 'wordpress-seo-premium' ),
				'<a href="' . $this->javascript_create_redirect( $url, $id ) . '">',
				'</a>'
			);

			$this->create_notification( $message, 'delete', $id );
		}

	}

	/**
	 * Look up if url does exists in the current redirects
	 *
	 * @param string $url url to search for
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
	 * @param integer $post_id
	 *
	 * @return string|void
	 */
	protected function check_if_redirect_needed( $post_id ) {

		// Get the post
		$post = get_post( $post_id );

		// No revisions please
		if ( $post->post_status != 'inherit' ) {
			// Get the right URL
			$url = $this->get_target_url( $post_id );

			// If $url is not a single /, there may be the option to create a redirect
			if ( $url !== '/' ) {
				// Message should only be shown if there isn't already a redirect
				if ( ! $this->check_if_redirect_exists( $url ) ) {
					return $url;
				}
			}
		}

	}

	/**
	 * Get the URL to the post and returns it's path
	 *
	 * @param integer $post_id
	 *
	 * @return string
	 */
	protected function get_target_url( $post_id ) {
		// Use the correct URL path
		$url = parse_url( get_permalink( $post_id ) );
		$url = $url['path'];

		return $url;
	}

	/**
	 * Get the old url
	 *
	 * @param object $post
	 * @param object $post_before
	 *
	 * @return bool|string
	 */
	protected function get_old_url( $post, $post_before ) {
		$wpseo_old_url = filter_input( INPUT_POST, 'wpseo_old_url' );

		if ( ! isset( $wpseo_old_url ) ) {
			// Check if request is inline action and new slug is not old slug, if so set wpseo_old_url
			$action = filter_input( INPUT_POST, 'action' );

			if ( ! empty( $action ) && $action === 'inline-save' && $post->post_name !== $post_before->post_name ) {
				return '/' . $post_before->post_name . '/';
			}
			return false;
		}

		return $wpseo_old_url;
	}

	/**
	 * Display notification
	 *
	 * @param string $old_url
	 * @param string $new_url
	 */
	protected function set_notification( $old_url, $new_url ) {
		$id = 'wpseo_redirect_' . md5( $old_url );

		// Format the message
		/* translators %1$s: <a href='{admin_redirect_url}'>, %2$s: <a href='{undo_redirect_url}'> and %3$s: </a> */
		$message = sprintf(
			__( 'WordPress SEO Premium created a %1$sredirect%3$s from the old post URL to the new post URL. %2$sClick here to undo this%3$s.', 'wordpress-seo-premium' ),
			'<a href="' . $this->admin_redirect_url( $old_url ) . '">',
			'<a href="' . $this->javascript_undo_redirect( $old_url, $id ) . '">',
			'</a>'
		);

		// Only set notification when the slug change was not saved through quick edit
		$this->create_notification( $message, 'slug_change', $id );
	}

}