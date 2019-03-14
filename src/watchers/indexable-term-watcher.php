<?php
/**
 * Term/Taxonomy watcher to fill the related Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\Free\Watchers;

use Yoast\WP\Free\Exceptions\No_Indexable_Found;
use Yoast\WP\Free\Formatters\Indexable_Term_Formatter;
use Yoast\WP\Free\WordPress\Integration;
use Yoast\WP\Free\Models\Indexable;

/**
 * Watcher for terms to fill the related Indexable.
 */
class Indexable_Term_Watcher implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'edited_term', array( $this, 'save_meta' ), PHP_INT_MAX, 3 );
		\add_action( 'delete_term', array( $this, 'delete_meta' ), PHP_INT_MAX, 3 );
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
	public function delete_meta( $term_id, $taxonomy_term_id, $taxonomy ) {
		try {
			$indexable = $this->get_indexable( $term_id, $taxonomy, false );
			$indexable->delete_meta();
			$indexable->delete();
		} catch ( No_Indexable_Found $exception ) {
			return;
		}
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
	public function save_meta( $term_id, $taxonomy_term_id, $taxonomy ) {
		try {
			$indexable = $this->get_indexable( $term_id, $taxonomy );
		} catch ( No_Indexable_Found $exception ) {
			return;
		}

		$formatter = $this->get_formatter( $term_id, $taxonomy );
		$indexable = $formatter->format( $indexable );

		$indexable->save();
	}

	/**
	 * Retrieves an indexable for a term.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int    $term_id     The term the indexable is based upon.
	 * @param string $taxonomy    The taxonomy the indexable belongs to.
	 * @param bool   $auto_create Optional. Creates an indexable if it does not exist yet.
	 *
	 * @return Indexable The indexable found for the supplied term.
	 *
	 * @throws No_Indexable_Found Exception when no indexable could be found for the supplied term.
	 */
	protected function get_indexable( $term_id, $taxonomy, $auto_create = true ) {
		$indexable = Indexable::find_by_id_and_type( $term_id, 'term', $auto_create );

		if ( ! $indexable ) {
			throw No_Indexable_Found::from_term_id( $term_id, $taxonomy );
		}

		return $indexable;
	}

	/**
	 * Returns formatter for given taxonomy.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int    $term_id  ID of the term to save data for.
	 * @param string $taxonomy The taxonomy the term belongs to.
	 *
	 * @return Indexable_Term_Formatter Instance.
	 */
	protected function get_formatter( $term_id, $taxonomy ) {
		return new Indexable_Term_Formatter( $term_id, $taxonomy );
	}
}
