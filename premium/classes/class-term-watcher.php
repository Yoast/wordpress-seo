<?php
/**
 * @package WPSEO\Premium\Classes
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
	 * Used when the slug is changed using quick edit
	 *
	 * @var string
	 */
	protected $old_url = '';

	/**
	 * Add an extra field to term edit screen
	 *
	 * @param string $tag
	 * @param string $taxonomy
	 */
	public function old_url_field( $tag, $taxonomy ) {
		$url = $this->get_target_url( $tag, $taxonomy );

		echo $this->parse_url_field( $url, 'term' );
	}

	/**
	 * Set old URL when the quick edit is used for taxonomies
	 */
	public function set_old_url_quick_edit() {
		$permalink = $this->get_taxonomy_permalink();

		if ( ! is_wp_error( $permalink ) ) {
			$this->old_url = str_replace( home_url(), '', $permalink );
		}
	}

	/**
	 * Detect if the slug changed, hooked into 'post_updated'
	 *
	 * @param integer  $term_id
	 * @param integer  $tt_id
	 * @param stdClass $taxonomy
	 *
	 * @return bool|void
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

		$old_url = $this->get_old_url();

		if ( ! $old_url ) {
			return;
		}

		// Get the new URL
		$new_url = $this->get_target_url( $term_id, $taxonomy );

		// Check if we should create a redirect
		if ( $this->should_create_redirect( $old_url, $new_url ) ) {
			// Create redirect
			$this->create_redirect( $old_url, $new_url );

			// Set notification
			$this->set_notification( $old_url, $new_url );
		}
	}


	/**
	 * Set redirect notification
	 *
	 * @param string $old_url
	 * @param string $new_url
	 */
	public function set_notification( $old_url, $new_url ) {
		$id = 'wpseo_create_redirect_' . md5( $old_url );

		// Format the message

		/* translators %1$s: <a href='{admin_redirect_url}'>, %2$s: <a href='{undo_redirect_url}'> and %3$s: </a> */
		$message = sprintf(
			__( 'WordPress SEO Premium created a %1$sredirect%3$s. from the old term URL to the new term URL. %2$sClick here to undo this%3$s.', 'wordpress-seo-premium' ),
			'<a href="' . $this->admin_redirect_url( $old_url ) . '">',
			'<a href=\'' . $this->javascript_undo_redirect( $old_url, $id ). '\'>',
			'</a>'
		);

		$this->create_notification( $message, 'slug_change', $id );
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
		if ( null !== $term_row ) {

			// Get the URL
			$url = $this->get_target_url( get_term( $term_row->term_id, $term_row->taxonomy ), $term_row->taxonomy );

			$id = 'wpseo_create_redirect_' . md5( $url );

			// Format the message
			/* translators %1$s expands to <a href='{create_redirect_url}'> and %2$s </a> */
			$message = sprintf( __( 'WordPress SEO Premium detected that you deleted a term. %1$sClick here to create a redirect from the old term URL%2$s.', 'wordpress-seo-premium' ),  '<a href=\''. $this->javascript_create_redirect( $url, $id ) . '\'>', '</a>' );

			$this->create_notification( $message, 'delete', $id );

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

	/**
	 * Get permalink for taxonomy
	 *
	 * @return string|WP_Error
	 */
	protected function get_taxonomy_permalink() {
		return get_term_link( get_term( filter_input( INPUT_POST, 'tax_ID' ), filter_input( INPUT_POST, 'taxonomy' ) ), filter_input( INPUT_POST, 'taxonomy' ) );
	}

	/**
	 * Get the old url
	 * @return bool|string
	 */
	protected function get_old_url() {
		$wpseo_old_term_url = filter_input( INPUT_POST, 'wpseo_old_term_url' );
		if ( ! isset( $wpseo_old_term_url ) ) {
			if ( ! empty( $this->old_url ) ) {
				return $this->old_url;
			}
			else {
				return false;
			}
		}
		return $wpseo_old_term_url;
	}
}
