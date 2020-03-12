<?php

namespace Yoast\WP\SEO\Builders;

use WPSEO_Meta;
use Yoast\WP\SEO\Helpers\Primary_Term_Helper;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;

/**
 * Creates the primary term for a post.
 */
class Primary_Term_Builder {

	/**
	 * The primary term repository.
	 *
	 * @var Primary_Term_Repository
	 */
	protected $repository;

	/**
	 * The primary term helper.
	 *
	 * @var Primary_Term_Helper
	 */
	private $primary_term;

	/**
	 * Primary_Term_Builder constructor.
	 *
	 * @param Primary_Term_Repository $repository   The primary term repository.
	 * @param Primary_Term_Helper     $primary_term The primary term helper.
	 */
	public function __construct( Primary_Term_Repository $repository, Primary_Term_Helper $primary_term ) {
		$this->repository   = $repository;
		$this->primary_term = $primary_term;
	}


	/**
	 * Formats the data.
	 *
	 * @param int $post_id The post ID.
	 */
	public function build( $post_id ) {
		foreach ( $this->primary_term->get_primary_term_taxonomies( $post_id ) as $taxonomy ) {
			$this->save_primary_term( $post_id, $taxonomy->name );
		}
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
