<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;

/**
 * Reindexing action for term link indexables.
 */
class Term_Link_Indexing_Action extends Abstract_Link_Indexing_Action {

	/**
	 * The transient name.
	 *
	 * @var string
	 */
	const UNINDEXED_COUNT_TRANSIENT = 'wpseo_unindexed_term_link_count';

	/**
	 * The post type helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * Sets the required helper.
	 *
	 * @required
	 *
	 * @param Taxonomy_Helper $taxonomy_helper The taxonomy helper.
	 *
	 * @return void
	 */
	public function set_helper( Taxonomy_Helper $taxonomy_helper ) {
		$this->taxonomy_helper = $taxonomy_helper;
	}

	/**
	 * Returns objects to be indexed.
	 *
	 * @return array Objects to be indexed.
	 */
	protected function get_objects() {
		$query = $this->get_query( false, $this->get_limit() );

		$terms = $this->wpdb->get_results( $query );

		return \array_map(
			static function ( $term ) {
				return (object) [
					'id'      => (int) $term->term_id,
					'type'    => 'term',
					'content' => $term->description,
				];
			},
			$terms
		);
	}

	/**
	 * Queries the database for unindexed term IDs.
	 *
	 * @param bool $count Whether or not it should be a count query.
	 * @param int  $limit The maximum number of term IDs to return.
	 *
	 * @return string The query.
	 */
	protected function get_query( $count, $limit = 1 ) {
		$public_taxonomies = $this->taxonomy_helper->get_public_taxonomies();
		$placeholders      = \implode( ', ', \array_fill( 0, \count( $public_taxonomies ), '%s' ) );
		$indexable_table   = Model::get_table_name( 'Indexable' );
		$replacements      = $public_taxonomies;

		$select = 'term_id, description';
		if ( $count ) {
			$select = 'COUNT(term_id)';
		}
		$limit_query = '';
		if ( ! $count ) {
			$limit_query    = 'LIMIT %d';
			$replacements[] = $limit;
		}

		return $this->wpdb->prepare(
			"SELECT $select
			FROM {$this->wpdb->term_taxonomy}
			WHERE term_id NOT IN (
				SELECT object_id FROM $indexable_table WHERE link_count IS NOT NULL AND object_type = 'term'
			) AND taxonomy IN ($placeholders)
			$limit_query
			",
			$replacements
		);
	}
}
