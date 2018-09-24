<?php
/**
 * Term/Taxonomy watcher to fill the related Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\Formatters\Indexable_Term as Indexable_Term_Formatter;
use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\Models\Indexable;

/**
 * Watcher for terms to fill the related Indexable.
 */
class Indexable_Term implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'created_term', array( $this, 'save_meta' ), PHP_INT_MAX, 3 );
		\add_action( 'edited_term', array( $this, 'save_meta' ), PHP_INT_MAX, 3 );
		\add_action( 'deleted_term', array( $this, 'delete_meta' ), PHP_INT_MAX, 3 );
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

		$formatter      = new Indexable_Term_Formatter( $term_id, $taxonomy );
		$formatted_data = $formatter->format();

		$indexable->permalink       = $this->get_permalink( $term_id, $taxonomy );
		$indexable->object_sub_type = $taxonomy;

		foreach( $this->get_indexable_fields() as $indexable_key ) {
			$indexable->{ $indexable_key } = $formatted_data[ $indexable_key ];
		}

		$indexable->save();

		if ( ! empty( $indexable->id ) ) {
			$this->save_indexable_meta( $indexable, $formatted_data );
		}
	}

	/**
	 * Retrieves an indexable for a term.
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
	 * Lookup table for the indexable fields.
	 *
	 * @return array The indexable fields.
	 */
	protected function get_indexable_fields() {
		return array(
			'primary_focus_keyword_score',
			'is_cornerstone',
			'is_robots_noindex',
			'is_robots_noimageindex',
			'is_robots_noarchive',
			'is_robots_nosnippet',
			'primary_focus_keyword',
			'readability_score',
			'canonical',
			'is_robots_nofollow',
			'title',
			'description',
			'breadcrumb_title',
			'link_count',
			'incoming_link_count',
		);
	}

	/**
	 * Retrieves the permalink for a term.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int    $term_id  The term to use.
	 * @param string $taxonomy Taxonomy to use.
	 *
	 * @return string|\WP_Error The permalink for the term.
	 */
	protected function get_permalink( $term_id, $taxonomy ) {
		return \get_term_link( $term_id, $taxonomy );
	}

	/**
	 * Saves the indexable meta data.
	 *
	 * @param Indexable $indexable      The indexable to save the meta for.
	 * @param array     $formatted_data The formatted data.
	 *
	 * @codeCoverageIgnore
	 */
	protected function save_indexable_meta( $indexable, $formatted_data ) {
		foreach ( $this->get_indexable_meta_fields() as $indexable_key ) {
			$indexable->set_meta( $indexable_key, $formatted_data[ $indexable_key ] );
		}
	}

	/**
	 * Lookup table for the indexable meta fields.
	 *
	 * @return array The indexable meta fields.
	 */
	protected function get_indexable_meta_fields() {
		return array(
			'og_title',
			'og_image',
			'og_description',
			'twitter_title',
			'twitter_image',
			'twitter_description',
		);
	}
}
