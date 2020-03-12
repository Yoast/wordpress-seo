<?php

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Repositories\Primary_Term_Repository;

/**
 * Creates an indexable for the primary term.
 */
class Primary_Term_Builder {

	/**
	 * The primary term repository.
	 *
	 * @var Primary_Term_Repository
	 */
	protected $repository;

	/**
	 * Primary_Term_Builder constructor.
	 *
	 * @param Primary_Term_Repository $repository The primary term repository.
	 */
	public function __construct( Primary_Term_Repository $repository ) {
		$this->repository = $repository;
	}


	/**
	 * Formats the data.
	 *
	 * @param int $post_id The post ID.
	 */
	public function build( $post_id ) {
		foreach ( $this->get_primary_term_taxonomies( $post_id ) as $taxonomy ) {
			$this->save_primary_term( $post_id, $taxonomy->name );
		}
	}

	/**
	 * Returns all the taxonomies for which the primary term selection is enabled.
	 *
	 * @param int $post_id Default current post ID.
	 *
	 * @return array The taxonomies.
	 */
	protected function get_primary_term_taxonomies( $post_id = null ) {
		if ( $post_id === null ) {
			$post_id = \get_the_ID();
		}

		$taxonomies = $this->generate_primary_term_taxonomies( $post_id );

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
		$post_type      = \get_post_type( $post_id );
		$all_taxonomies = \get_object_taxonomies( $post_type, 'objects' );
		$all_taxonomies = \array_filter( $all_taxonomies, [ $this, 'filter_hierarchical_taxonomies' ] );

		/**
		 * Filters which taxonomies for which the user can choose the primary term.
		 *
		 * @api array    $taxonomies An array of taxonomy objects that are primary_term enabled.
		 *
		 * @param string $post_type      The post type for which to filter the taxonomies.
		 * @param array  $all_taxonomies All taxonomies for this post types, even ones that don't have primary term
		 *                               enabled.
		 */
		$taxonomies = (array) \apply_filters( 'wpseo_primary_term_taxonomies', $all_taxonomies, $post_type, $all_taxonomies );

		return $taxonomies;
	}

	/**
	 * Save the primary term for a specific taxonomy.
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

		$term_selected = ! empty( $term_id );
		$primary_term  = $this->repository->find_by_post_id_and_taxonomy( $post_id, $taxonomy, $term_selected );

		// Removes the indexable when found.
		if ( ! $term_selected ) {
			if ( $primary_term ) {
				$primary_term->delete();
			}
			return;
		}

		$primary_term->term_id  = $term_id;
		$primary_term->post_id  = $post_id;
		$primary_term->taxonomy = $taxonomy;
		$primary_term->save();
	}

	/**
	 * Retrieves the posted term ID based on the given taxonomy.
	 *
	 * @param string $taxonomy The taxonomy to check.
	 *
	 * @codeCoverageIgnore It wraps form input.
	 *
	 * @return int The term ID.
	 */
	protected function get_posted_term_id( $taxonomy ) {
		return \filter_input( \INPUT_POST, WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy . '_term', \FILTER_SANITIZE_NUMBER_INT );
	}

	/**
	 * Checks if the referer is valid for given taxonomy.
	 *
	 * @param string $taxonomy The taxonomy to validate.
	 *
	 * @codeCoverageIgnore It wraps a WordPress function.
	 *
	 * @return bool Whether the referer is valid.
	 */
	protected function is_referer_valid( $taxonomy ) {
		return \check_admin_referer( 'save-primary-term', WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy . '_nonce' );
	}
}
