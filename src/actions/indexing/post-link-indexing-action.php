<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;

/**
 * Reindexing action for post link indexables.
 */
class Post_Link_Indexing_Action extends Abstract_Link_Indexing_Action {

	/**
	 * The transient name.
	 *
	 * @var string
	 */
	const UNINDEXED_COUNT_TRANSIENT = 'wpseo_unindexed_post_link_count';

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Sets the required helper.
	 *
	 * @required
	 *
	 * @param Post_Type_Helper $post_type_helper The post type helper.
	 *
	 * @return void
	 */
	public function set_helper( Post_Type_Helper $post_type_helper ) {
		$this->post_type_helper = $post_type_helper;
	}

	/**
	 * Returns objects to be indexed.
	 *
	 * @return array Objects to be indexed.
	 */
	protected function get_objects() {
		$query = $this->get_query( false, $this->get_limit() );

		$posts = $this->wpdb->get_results( $query );

		return \array_map(
			static function ( $post ) {
				return (object) [
					'id'      => (int) $post->ID,
					'type'    => 'post',
					'content' => $post->post_content,
				];
			},
			$posts
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
		$public_post_types = $this->post_type_helper->get_accessible_post_types();
		$placeholders      = \implode( ', ', \array_fill( 0, \count( $public_post_types ), '%s' ) );
		$indexable_table   = Model::get_table_name( 'Indexable' );
		$links_table       = Model::get_table_name( 'SEO_Links' );
		$replacements      = $public_post_types;

		$select = 'P.ID, P.post_content';
		if ( $count ) {
			$select = 'COUNT(P.ID)';
		}
		$limit_query = '';
		if ( ! $count ) {
			$limit_query    = 'LIMIT %d';
			$replacements[] = $limit;
		}

		return $this->wpdb->prepare(
			"SELECT $select
			FROM {$this->wpdb->posts} AS P
			LEFT JOIN $indexable_table AS I
				ON P.ID = I.object_id
				AND I.link_count IS NOT NULL
				AND I.object_type = 'post'
			LEFT JOIN $links_table AS L
				ON L.post_id = P.ID
				AND L.target_indexable_id IS NULL
				AND L.type = 'internal'
				AND L.target_post_id IS NOT NULL
				AND L.target_post_id != 0
			WHERE ( I.object_id IS NULL OR L.post_id IS NOT NULL )
				AND P.post_status = 'publish'
				AND P.post_type IN ($placeholders)
			$limit_query
			",
			$replacements
		);
	}
}
