<?php
/**
 * Term/Taxonomy watcher to fill the related Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Watchers;

use Yoast\WP\SEO\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\WordPress\Integration;

/**
 * Watcher for terms to fill the related Indexable.
 */
class Indexable_Term_Watcher implements Integration {

	/**
	 * @var \Yoast\WP\SEO\Repositories\Indexable_Repository
	 */
	protected $repository;

	/**
	 * @var \Yoast\WP\SEO\Builders\Indexable_Term_Builder
	 */
	protected $builder;

	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Indexables_Feature_Flag_Conditional::class ];
	}

	/**
	 * Indexable_Term_Watcher constructor.
	 *
	 * @param \Yoast\WP\SEO\Repositories\Indexable_Repository $repository The repository to use.
	 * @param \Yoast\WP\SEO\Builders\Indexable_Term_Builder   $builder    The post builder to use.
	 */
	public function __construct( Indexable_Repository $repository, Indexable_Term_Builder $builder ) {
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
		$indexable = $this->repository->find_by_id_and_type( $term_id, 'term', false );

		// If we haven't found an existing indexable, create it. Otherwise update it.
		$indexable = ( $indexable === false ) ? $this->repository->create_for_id_and_type( $term_id, 'term' ) : $this->builder->build( $term_id, $indexable );

		$indexable->save();
	}
}
