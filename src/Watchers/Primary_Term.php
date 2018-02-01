<?php

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\Yoast_Model;

class Primary_Term implements Integration {

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
		$term_id = filter_input( INPUT_POST, \WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy . '_term', FILTER_SANITIZE_NUMBER_INT );

		// We accept an empty string here because we need to save that if no terms are selected.
		if ( null === $term_id && check_admin_referer( 'save-primary-term', \WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy . '_nonce' ) ) {
			return;
		}

		try {
			$primary_term = $this->get_indexable( $post_id, $taxonomy );
		} catch ( No_Indexable_Found $exception ) {
			return;
		}

		$primary_term->term_id = $term_id;
		$primary_term->save();
	}


	/**
	 * Get the current post ID.
	 *
	 * @return integer The post ID.
	 */
	protected function get_current_id() {
		return get_the_ID();
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
	 * @param int    $post_id     The post the indexable is based upon.
	 * @param string $taxonomy    The taxonomy the indexable belongs to.
	 * @param bool   $auto_create Optional. Creates an indexable if it does not exist yet.
	 *
	 * @return \Yoast\YoastSEO\Models\Primary_Term
	 *
	 * @throws \Yoast\YoastSEO\Exceptions\No_Indexable_Found
	 */
	protected function get_indexable( $post_id, $taxonomy, $auto_create = true ) {
		/** @var \Yoast\YoastSEO\Models\Primary_Term $indexable */
		$indexable = Yoast_Model::of_type( 'Primary_Term' )
								->where( 'post_id', $post_id )
								->where( 'taxonomy', $taxonomy )
								->find_one();

		if ( $auto_create && ! $indexable ) {
			/** @var \Yoast\YoastSEO\Models\Primary_Term $indexable */
			$indexable           = Yoast_Model::of_type( 'Primary_Term' )->create();
			$indexable->post_id  = $post_id;
			$indexable->taxonomy = $taxonomy;
		}

		if ( ! $indexable ) {
			throw new No_Indexable_Found( 'No indexable found for supplied arguments' );
		}

		return $indexable;
	}
}
