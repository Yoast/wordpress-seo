<?php
/**
 * @package Premium
 * @subpackage Redirect
 */

/**
 * Class WPSEO_Term_Watcher
 */
class WPSEO_Term_Watcher extends WPSEO_Watcher {

	/**
	 * Type of watcher.
	 *
	 * This will be used for the filters.
	 *
	 * @var string
	 */
	protected $watch_type = 'term';

	/**
	 * Add an extra field to term edit screen
	 *
	 * @param mixed $tag
	 * @oaram mixed $taxonomy
	 */
	public function old_url_field( $tag, $taxonomy ) {
		$url = $this->get_target_url( $tag, $taxonomy );

		echo $this->parse_url_field( $url );
	}

	/**
	 * Detect if the slug changed, hooked into 'post_updated'
	 *
	 * @param integer $term_id
	 * @param integer $tt_id
	 * @param mixed   $taxonomy
	 */
	public function detect_slug_change( $term_id, $tt_id, $taxonomy ) {
		/**
		 * Filter: 'wpseo_premium_term_redirect_slug_change' - Check if a redirect should be created on term slug change
		 *
		 * @api bool unsigned
		 */
		if ( apply_filters( 'wpseo_premium_term_redirect_slug_change', false ) === true ) {
			return true;
		}

		// Check if the old page is set
		if ( ! isset( $_POST['wpseo_old_url'] ) ) {
			return;
		}

		// Get the new URL
		$new_url = $this->get_target_url( $term_id, $taxonomy );

		// Get the old URL
		$old_url = esc_url( $_POST['wpseo_old_url'] );

		// Check if we should create a redirect
		if ( $this->should_create_redirect( $old_url, $new_url ) ) {

			// Format the message
			$message = sprintf( __( "WordPress SEO Premium created a <a href='%s'>redirect</a> from the old term URL to the new term URL. <a href='%s'>Click here to undo this</a>.", 'wordpress-seo-premium' ), $this->admin_redirect_url( $old_url ), $this->javascript_undo_redirect( $old_url ) );

			$this->create_redirect( $old_url, $new_url );

			$this->create_notification( $message, 'slug_change' );
		}

	}

	/**
	 * Offer to create a redirect from the term that is about to get deleted
	 *
	 * @param integer $term_id
	 */
	public function detect_term_delete( $term_id ) {

		global $wpdb;

		// Get the term and taxonomy from the term_taxonomy table
		$term_row = $wpdb->get_row( $wpdb->prepare( 'SELECT `term_id`, `taxonomy` FROM `' . $wpdb->term_taxonomy . '` WHERE `term_taxonomy_id` = %d ', $term_id ) );

		// Check result
		if ( null != $term_row ) {

			// Get the URL
			$url = $this->get_target_url( get_term( $term_row->term_id, $term_row->taxonomy ), $term_row->taxonomy );

			// Format the message
			$message = sprintf( __( 'WordPress SEO Premium detected that you deleted a term. <a href="%s">Click here to create a redirect from the old term URL</a>.', 'wordpress-seo-premium' ), $this->javascript_create_redirect( $url ) );

			$this->create_notification( $message, 'delete' );

		}


	}

	/**
	 * Get the URL to the term and returns it's path
	 *
	 * @param string $tag
	 * @param string $taxonomy
	 *
	 * @return string
	 */
	protected function get_target_url( $tag, $taxonomy ) {
		// Use the correct URL path
		$url = parse_url( get_term_link( $tag, $taxonomy ) );
		$url = $url['path'];

		return $url;
	}

}