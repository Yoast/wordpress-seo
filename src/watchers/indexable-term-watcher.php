<?php
/**
 * Term/Taxonomy watcher to fill the related Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\Free\Watchers;

use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Builders\Indexable_Term_Builder;
use Yoast\WP\Free\Helpers\Indexable_Helper;
use Yoast\WP\Free\WordPress\Integration;

/**
 * Watcher for terms to fill the related Indexable.
 */
class Indexable_Term_Watcher implements Integration {

	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Indexables_Feature_Flag_Conditional::class ];
	}

	/**
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * @var Indexable_Term_Builder
	 */
	protected $builder;

	/**
	 * Indexable_Term_Watcher constructor.
	 *
	 * @param Indexable_Term_Builder $builder The post builder to use.
	 */
	public function __construct( Indexable_Helper $indexable_helper, Indexable_Term_Builder $builder ) {
		$this->indexable_helper = $indexable_helper;
		$this->builder          = $builder;
	}

	/**
	 * @inheritdoc
	 */
	public function register_hooks() {
		\add_action( 'edited_term', [ $this, 'build_indexable' ], \PHP_INT_MAX, 3 );
		\add_action( 'delete_term', [ $this, 'delete_indexable' ], \PHP_INT_MAX, 3 );
	}

	/**
	 * Deletes a term from the index.
	 *
	 * @param int    $term_id          The Term ID to delete.
	 * @param int    $taxonomy_term_id The Taxonomy ID the Term belonged to.
	 * @param string $taxonomy         The taxonomy name the Term belonged to.
	 *
	 * @return void
	 */
	public function delete_indexable( $term_id, $taxonomy_term_id, $taxonomy ) {
		$indexable = $this->indexable_helper->find_by_id_and_type( $term_id, 'term', false );

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
	 * @param int    $term_id          ID of the term to save data for.
	 * @param int    $taxonomy_term_id The taxonomy_term_id for the term.
	 * @param string $taxonomy         The taxonomy the term belongs to.
	 *
	 * @return void
	 */
	public function build_indexable( $term_id, $taxonomy_term_id, $taxonomy ) {
		$indexable = $this->indexable_helper->find_by_id_and_type( $term_id, 'term', false );

		// If we haven't found an existing indexable, create it. Otherwise update it.
		$indexable = $indexable === false
			? $this->indexable_helper->create_for_id_and_type( $term_id, 'term' )
			: $this->builder->build( $term_id, $indexable );

		$indexable->save();
	}
}
