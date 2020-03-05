<?php
/**
 * Primary Term watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use WPSEO_Meta;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;

/**
 * Watches Posts to save the primary term when set.
 */
class Primary_Term_Watcher implements Integration_Interface {

	/**
	 * The primary term repository.
	 *
	 * @var Primary_Term_Repository
	 */
	protected $repository;

	/**
	 * Represents the site helper.
	 *
	 * @var Site_Helper
	 */
	protected $site;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Primary_Term_Watcher constructor.
	 *
	 * @codeCoverageIgnore It sets dependencies.
	 *
	 * @param Primary_Term_Repository $repository The primary term repository.
	 * @param Site_Helper             $site
	 */
	public function __construct( Primary_Term_Repository $repository, Site_Helper $site ) {
		$this->repository = $repository;
		$this->site       = $site;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'save_post', [ $this, 'save_primary_terms' ] );
		\add_action( 'delete_post', [ $this, 'delete_primary_terms' ] );
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
			$primary_term = $this->repository->find_by_post_id_and_taxonomy( $post_id, $taxonomy->name, false );

			if ( ! $primary_term ) {
				continue;
			}

			$primary_term->delete();
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
		// Bail if this is a multisite installation and the site has been switched.
		if ( $this->site->is_multisite_and_switched() ) {
			return;
		}

		if ( ! $this->is_post_request() ) {
			return;
		}

		foreach ( $this->get_primary_term_taxonomies( $post_id ) as $taxonomy ) {
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
	 * Returns whether or not a taxonomy is hierarchical.
	 *
	 * @param \stdClass $taxonomy Taxonomy object.
	 *
	 * @return bool True for hierarchical taxonomy.
	 */
	protected function filter_hierarchical_taxonomies( $taxonomy ) {
		return (bool) $taxonomy->hierarchical;
	}

	/**
	 * Checks if the request is a post request.
	 *
	 * @codeCoverageIgnore It wraps server input.
	 *
	 * @return bool Whether the method is a post request.
	 */
	protected function is_post_request() {
		return isset( $_SERVER['REQUEST_METHOD'] ) && \strtolower( \wp_unslash( $_SERVER['REQUEST_METHOD'] ) ) === 'post';
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
