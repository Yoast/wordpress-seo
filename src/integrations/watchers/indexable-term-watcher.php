<?php
/**
 * Term/Taxonomy watcher to fill the related Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Watcher for terms to fill the related Indexable.
 */
class Indexable_Term_Watcher implements Integration_Interface {

	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * @var Indexable_Repository
	 * @var \Yoast\WP\SEO\Repositories\Indexable_Repository
	 */
	protected $repository;

	/**
	 * @var Indexable_Builder
	 */
	protected $builder;

	/**
	 * Indexable_Term_Watcher constructor.
	 *
	 * @param Indexable_Repository $repository The repository to use.
	 * @param Indexable_Builder    $builder    The post builder to use.
	 */
	public function __construct( Indexable_Repository $repository, Indexable_Builder $builder ) {
		$this->repository = $repository;
		$this->builder    = $builder;
	}

	/**
	 * @inheritdoc
	 */
	public function register_hooks() {
		\add_action( 'edited_term', [ $this, 'build_indexable' ], \PHP_INT_MAX );
		\add_action( 'delete_term', [ $this, 'delete_indexable' ], \PHP_INT_MAX );
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
	}

	/**
	 * Update the taxonomy meta data on save.
	 *
	 * Note: This method is missing functionality to update internal links and incoming links.
	 *       As this functionality is currently not available for terms, it has not been added in this
	 *       class yet.
	 *
	 * @param int $term_id ID of the term to save data for.
	 *
	 * @return void
	 */
	public function build_indexable( $term_id ) {
		// Bail if this is a multisite installation and the site has been switched.
		if ( is_multisite() && ms_is_switched() ) {
			return;
		}

		$indexable = $this->repository->find_by_id_and_type( $term_id, 'term', false );

		// If we haven't found an existing indexable, create it. Otherwise update it.
		try {
			$indexable = $this->builder->build_for_id_and_type( $term_id, 'term', $indexable );
		} catch ( \Exception $exception ) {
			return;
		}

		$indexable->save();
	}
}
