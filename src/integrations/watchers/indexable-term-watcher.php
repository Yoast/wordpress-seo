<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Watches Terms/Taxonomies to fill the related Indexable.
 */
class Indexable_Term_Watcher implements Integration_Interface {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The indexable builder.
	 *
	 * @var Indexable_Builder
	 */
	protected $builder;

	/**
	 * The link builder.
	 *
	 * @var Indexable_Link_Builder
	 */
	protected $link_builder;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * Represents the site helper.
	 *
	 * @var Site_Helper
	 */
	protected $site;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Indexable_Term_Watcher constructor.
	 *
	 * @param Indexable_Repository   $repository       The repository to use.
	 * @param Indexable_Builder      $builder          The post builder to use.
	 * @param Indexable_Link_Builder $link_builder     The lint builder to use.
	 * @param Indexable_Helper       $indexable_helper The indexable helper.
	 * @param Site_Helper            $site             The site helper.
	 */
	public function __construct(
		Indexable_Repository $repository,
		Indexable_Builder $builder,
		Indexable_Link_Builder $link_builder,
		Indexable_Helper $indexable_helper,
		Site_Helper $site
	) {
		$this->repository       = $repository;
		$this->builder          = $builder;
		$this->link_builder     = $link_builder;
		$this->indexable_helper = $indexable_helper;
		$this->site             = $site;
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'created_term', [ $this, 'build_indexable' ], \PHP_INT_MAX );
		\add_action( 'edited_term', [ $this, 'build_indexable' ], \PHP_INT_MAX );
		\add_action( 'delete_term', [ $this, 'delete_indexable' ], \PHP_INT_MAX );

		if ( \version_compare( \wp_get_wp_version(), '6.9-alpha', '>=' ) ) {
			\add_action( 'update_term_count', [ $this, 'update_term_count' ], \PHP_INT_MAX, 3 );
		}
		else {
			\add_action( 'edited_term_taxonomy', [ $this, 'edited_term_taxonomy' ], \PHP_INT_MAX, 3 );
		}
	}

	/**
	 * Deletes a term from the index.
	 *
	 * @param int $term_id The Term ID to delete.
	 *
	 * @return void
	 */
	public function delete_indexable( $term_id ) {
		$indexable = $this->repository->find_by_id_and_type( $term_id, 'term', false );

		if ( ! $indexable ) {
			return;
		}

		$indexable->delete();
		\do_action( 'wpseo_indexable_deleted', $indexable );
	}

	/**
	 * Update the taxonomy meta data on save.
	 *
	 * @param int $term_id ID of the term to save data for.
	 *
	 * @return void
	 */
	public function build_indexable( $term_id ) {
		// Bail if this is a multisite installation and the site has been switched.
		if ( $this->site->is_multisite_and_switched() ) {
			return;
		}

		$term = \get_term( $term_id );

		if ( $term === null || \is_wp_error( $term ) ) {
			return;
		}

		if ( ! \is_taxonomy_viewable( $term->taxonomy ) ) {
			return;
		}

		$indexable = $this->repository->find_by_id_and_type( $term_id, 'term', false );

		// If we haven't found an existing indexable, create it. Otherwise update it.
		$indexable = $this->builder->build_for_id_and_type( $term_id, 'term', $indexable );

		if ( ! $indexable ) {
			return;
		}

		// Update links.
		$this->link_builder->build( $indexable, $term->description );

		$indexable->object_last_modified = \max( $indexable->object_last_modified, \current_time( 'mysql' ) );
		$this->indexable_helper->save_indexable( $indexable );
	}

	/**
	 * Update the term indexable with the new post count.
	 *
	 * @param int    $tt_id         Term taxonomy ID.
	 * @param string $taxonomy_name Taxonomy slug.
	 * @param int    $count         Term count.
	 *
	 * @return void
	 */
	public function update_term_count( $tt_id, $taxonomy_name, $count ) {
		$indexable = $this->repository->find_by_id_and_type( $tt_id, 'term', true );

		if ( ! $indexable ) {
			return;
		}

		$indexable->post_count = $count;
		$this->indexable_helper->save_indexable( $indexable );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.ParameterTypeHint.MissingTraversableTypeHintSpecification -- Reason: We have no control over $args.

	/**
	 * Update the term indexable with the new post count.
	 *
	 * @param int    $tt_id         Term taxonomy ID.
	 * @param string $taxonomy_name Taxonomy slug.
	 * @param array  $args          Arguments passed to wp_update_term().
	 *
	 * @return void
	 */
	public function edited_term_taxonomy( $tt_id, $taxonomy_name, $args = [] ) {
		global $wpdb;

		if ( ! empty( $args ) ) {
			// If args are passed, this is not a count update.
			return;
		}

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: No relevant caches.
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery -- Reason: Most performant way.
		$new_count = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT count FROM {$wpdb->term_taxonomy} WHERE term_taxonomy_id = %d",
				$tt_id
			)
		);
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.NoCaching
		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery

		$this->update_term_count( $tt_id, $taxonomy_name, (int) $new_count );
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.ParameterTypeHint.MissingTraversableTypeHintSpecification
}
