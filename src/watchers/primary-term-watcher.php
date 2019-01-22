<?php
/**
 * Primary Term watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\Loggers\Logger;
use Yoast\YoastSEO\Models\Indexable;
use Yoast\YoastSEO\Models\Primary_Term as Primary_Term_Indexable;
use Yoast\YoastSEO\WordPress\Integration;


/**
 * Watches Posts to save the primary term when set.
 */
class Primary_Term_Watcher implements Integration {

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'save_post', array( $this, 'save_primary_terms' ) );
		\add_action( 'delete_post', array( $this, 'delete_primary_terms' ) );
	}

	/**
	 * Deletes primary terms for a post.
	 *
	 * @param int $post_id The post to delete the terms of.
	 *
	 * @return void
	 */
	public function delete_primary_terms( $post_id ) {
		foreach ( $this->get_primary_term_taxonomies( $post_id ) as $taxonomy ) {
			try {
				$indexable = $this->get_indexable( $post_id, $taxonomy->name, false );
				$indexable->delete();
			} catch ( No_Indexable_Found $exception ) {
				continue;
			}
		}
	}

	/**
	 * Saves the primary terms for a post.
	 *
	 * @param int $post_id Post ID to save the primary terms for.
	 *
	 * @return void
	 */
	public function save_primary_terms( $post_id ) {
		if ( ! $this->is_post_request() ) {
			return;
		}

		foreach ( $this->get_primary_term_taxonomies( $post_id ) as $taxonomy ) {
			$this->save_primary_term( $post_id, $taxonomy->name );
		}
	}

	/**
	 * Save the primary term for a specific taxonomy
	 *
	 * @param int    $post_id  Post ID to save primary term for.
	 * @param string $taxonomy Taxonomy to save primary term for.
	 *
	 * @return void
	 */
	protected function save_primary_term( $post_id, $taxonomy ) {
		// This request must be valid.
		$term_id = $this->get_posted_term_id( $taxonomy );
		if ( $term_id && ! $this->is_referer_valid( $taxonomy ) ) {
			return;
		}

		try {
			$primary_term = $this->get_indexable( $post_id, $taxonomy );

			// Removes the indexable when found.
			if ( empty( $term_id ) ) {
				$this->delete_indexable( $primary_term );

				return;
			}
		}
		catch ( No_Indexable_Found $exception ) {
			return;
		}

		$primary_term->term_id  = $term_id;
		$primary_term->post_id  = $post_id;
		$primary_term->taxonomy = $taxonomy;
		$primary_term->save();
	}

	/**
	 * Returns all the taxonomies for which the primary term selection is enabled
	 *
	 * @param int $post_id Default current post ID.
	 *
	 * @return array The taxonomies.
	 */
	protected function get_primary_term_taxonomies( $post_id = null ) {
		if ( null === $post_id ) {
			$post_id = $this->get_current_id();
		}

		// @todo determine if caching is needed here, no database queries are used?
		$taxonomies = wp_cache_get( 'primary_term_taxonomies_' . $post_id, 'wpseo' );
		if ( false !== $taxonomies ) {
			return $taxonomies;
		}

		$taxonomies = $this->generate_primary_term_taxonomies( $post_id );

		wp_cache_set( 'primary_term_taxonomies_' . $post_id, $taxonomies, 'wpseo' );

		return $taxonomies;
	}

	/**
	 * Generate the primary term taxonomies.
	 *
	 * @param int $post_id ID of the post.
	 *
	 * @return array The taxonomies.
	 */
	protected function generate_primary_term_taxonomies( $post_id ) {
		$post_type      = get_post_type( $post_id );
		$all_taxonomies = get_object_taxonomies( $post_type, 'objects' );
		$all_taxonomies = array_filter( $all_taxonomies, array( $this, 'filter_hierarchical_taxonomies' ) );

		/**
		 * Filters which taxonomies for which the user can choose the primary term.
		 *
		 * @api array    $taxonomies An array of taxonomy objects that are primary_term enabled.
		 *
		 * @param string $post_type      The post type for which to filter the taxonomies.
		 * @param array  $all_taxonomies All taxonomies for this post types, even ones that don't have primary term
		 *                               enabled.
		 */
		$taxonomies = (array) apply_filters( 'wpseo_primary_term_taxonomies', $all_taxonomies, $post_type, $all_taxonomies );

		return $taxonomies;
	}

	/**
	 * Returns whether or not a taxonomy is hierarchical
	 *
	 * @param \stdClass $taxonomy Taxonomy object.
	 *
	 * @return bool True for hierarchical taxonomy.
	 */
	protected function filter_hierarchical_taxonomies( $taxonomy ) {
		return (bool) $taxonomy->hierarchical;
	}

	/**
	 * Retrieves an indexable for a primary taxonomy.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int    $post_id     The post the indexable is based upon.
	 * @param string $taxonomy    The taxonomy the indexable belongs to.
	 * @param bool   $auto_create Optional. Creates an indexable if it does not exist yet.
	 *
	 * @return Indexable Instance of the indexable.
	 *
	 * @throws No_Indexable_Found Exception when no indexable could be found for the supplied post.
	 */
	protected function get_indexable( $post_id, $taxonomy, $auto_create = true ) {
		$indexable = Primary_Term_Indexable::find_by_postid_and_taxonomy( $post_id, 'post', $auto_create );

		if ( ! $indexable ) {
			throw No_Indexable_Found::from_primary_term( $post_id, $taxonomy );
		}

		return $indexable;
	}

	/**
	 * Deletes the given indexable.
	 *
	 * @param Indexable $indexable The indexable to delete.
	 *
	 * @return void
	 */
	protected function delete_indexable( $indexable ) {
		try {
			$indexable->delete();
		}
		catch ( \Exception $exception ) {
			Logger::get_logger()->notice( $exception->getMessage() );
		}
	}

	/**
	 * Get the current post ID.
	 *
	 * @coveCoverageIgnore
	 *
	 * @return integer The post ID.
	 */
	protected function get_current_id() {
		return get_the_ID();
	}

	/**
	 * Checks if the request is a post request.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether thet method is a post request.
	 */
	protected function is_post_request() {
		return isset( $_SERVER['REQUEST_METHOD'] ) && strtolower( wp_unslash( $_SERVER['REQUEST_METHOD'] ) ) === 'post';
	}

	/**
	 * Retrieves the posted term id based on the given taxonomy.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $taxonomy The taxonomy to check.
	 *
	 * @return int The term id.
	 */
	protected function get_posted_term_id( $taxonomy ) {
		return filter_input( INPUT_POST, \WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy . '_term', FILTER_SANITIZE_NUMBER_INT );
	}

	/**
	 * Checks if the referer is valid for given taxonomy.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $taxonomy The taxonomy to validate.
	 *
	 * @return bool Whether the referer is valid.
	 */
	protected function is_referer_valid( $taxonomy ) {
		return check_admin_referer( 'save-primary-term', \WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy . '_nonce' );
	}
}
