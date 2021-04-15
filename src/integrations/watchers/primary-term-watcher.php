<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Builders\Primary_Term_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Primary_Term_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;

/**
 * Primary Term watcher.
 *
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
	 * The primary term helper.
	 *
	 * @var Primary_Term_Helper
	 */
	private $primary_term;

	/**
	 * The primary term builder.
	 *
	 * @var Primary_Term_Builder
	 */
	protected $primary_term_builder;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Primary_Term_Watcher constructor.
	 *
	 * @codeCoverageIgnore It sets dependencies.
	 *
	 * @param Primary_Term_Repository $repository           The primary term repository.
	 * @param Site_Helper             $site                 The site helper.
	 * @param Primary_Term_Helper     $primary_term         The primary term helper.
	 * @param Primary_Term_Builder    $primary_term_builder The primary term builder.
	 */
	public function __construct(
		Primary_Term_Repository $repository,
		Site_Helper $site,
		Primary_Term_Helper $primary_term,
		Primary_Term_Builder $primary_term_builder
	) {
		$this->repository           = $repository;
		$this->site                 = $site;
		$this->primary_term         = $primary_term;
		$this->primary_term_builder = $primary_term_builder;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 */
	public function register_hooks() {
		\add_action( 'set_object_terms', [ $this, 'save_primary_terms' ], ( \PHP_INT_MAX - 500 ) );
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
		foreach ( $this->primary_term->get_primary_term_taxonomies( $post_id ) as $taxonomy ) {
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

		$this->primary_term_builder->build( $post_id );
	}
}
