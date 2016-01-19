<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * The watcher to fetch changes in the slug for the term.
 */
class WPSEO_Term_Slug_Watcher {

	/**
	 * @var bool
	 */
	protected $edited_terms = false;

	/**
	 * Setting the hooks
	 */
	public function __construct() {
		add_action( 'edited_terms', array( $this, 'hook_make_term_slug_unique' ), 10, 2 );
	}

	/**
	 * Generate an unique slug if it is necessary. This might be the case when given slug is redirected.
	 *
	 * @param string $slug          The slug that has to be unique.
	 * @param object $term          Term object.
	 * @param string $original_slug Slug originally passed to the function for testing.
	 *
	 * @return string Will return a true unique slug.
	 */
	public function hook_unique_term_slug( $slug, $term, $original_slug ) {
		if ( $this->check_for_redirect( $this->get_term_slug( $slug, $term ) ) ) {
			$suffix = $this->get_suffix( $slug, $original_slug );
			$slug   = $original_slug . '-' . $suffix;
			$slug   = wp_unique_term_slug( $slug, $term );
		}

		return $slug;
	}

	/**
	 * Makes the term slug unique
	 *
	 * @param integer $term_id  The term id to handle.
	 * @param string  $taxonomy The taxonomy for the term.
	 */
	public function hook_make_term_slug_unique( $term_id, $taxonomy ) {
		global $wpdb;

		add_action( 'wp_unique_term_slug', array( $this, 'hook_unique_term_slug' ), 10, 3 );

		// Unset the cache.
		wp_cache_delete( $term_id, 'terms' );

		$term = get_term( $term_id, $taxonomy );
		$slug = wp_unique_term_slug( $term->slug, $term );

		$wpdb->update( $wpdb->terms, compact( 'slug' ), compact( 'term_id' ) );

	}


	/**
	 * Overrides the term slug to use the given $slug and returns the part that is used for a redirect.
	 *
	 * @param string $slug The slug that have to be unique.
	 * @param object $term Term object.
	 *
	 * @return string
	 */
	protected function get_term_slug( $slug, $term ) {
		$term->slug = $slug;

		return str_replace( trailingslashit( home_url() ), '', get_term_link( $term, $term->taxonomy ) );
	}

	/**
	 * Get the new suffix.
	 *
	 * @param string $slug          The new slug.
	 * @param string $original_slug The original slug.
	 *
	 * @return integer
	 */
	protected function get_suffix( $slug, $original_slug ) {
		if ( $slug === $original_slug ) {
			return 2;
		}

		return ( str_replace( $original_slug . '-', '', $slug ) + 1 );
	}

	/**
	 * Check if the slug already exists as a redirect.
	 *
	 * @param string $slug The slug to look for.
	 *
	 * @return bool
	 */
	protected function check_for_redirect( $slug ) {
		$redirect_manager = new WPSEO_Redirect_Manager();
		$redirect         = $redirect_manager->get_redirect( $slug );

		return $redirect instanceof WPSEO_Redirect;
	}

}
