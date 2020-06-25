<?php
/**
 * Reindexation action for indexables.
 *
 * @package Yoast\WP\SEO\Actions\Indexation
 */

namespace Yoast\WP\SEO\Actions\Indexation;

use wpdb;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Post_Link_Indexing_Action class.
 */
class Post_Link_Indexing_Action implements Indexation_Action_Interface {

	/**
	 * The link builder.
	 *
	 * @var Indexable_Link_Builder
	 */
	protected $link_builder;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	private $wpdb;

	/**
	 * Indexable_Post_Indexing_Action constructor
	 *
	 * @param Indexable_Link_Builder $link_builder     The indexable link builder.
	 * @param Post_Type_Helper       $post_type_helper The post type helper.
	 * @param Indexable_Repository   $repository       The indexable repository.
	 * @param wpdb                   $wpdb             The WordPress database instance.
	 */
	public function __construct(
		Indexable_Link_Builder $link_builder,
		Post_Type_Helper $post_type_helper,
		Indexable_Repository $repository,
		wpdb $wpdb
	) {
		$this->link_builder     = $link_builder;
		$this->post_type_helper = $post_type_helper;
		$this->repository       = $repository;
		$this->wpdb             = $wpdb;
	}

	/**
	 * @inheritDoc
	 */
	public function get_total_unindexed() {
		$transient = \get_transient( 'wpseo-unindexed-post-link-count' );

		if ( $transient ) {
			return (int) $transient;
		}

		$query = $this->get_query( true );

		$result = $this->wpdb->get_var( $query );

		if ( \is_null( $result ) ) {
			return false;
		}

		\set_transient( 'wpseo-unindexed-post-link-count', $result, \DAY_IN_SECONDS );

		return (int) $result;
	}

	/**
	 * Creates indexables for unindexed posts.
	 *
	 * @return SEO_Links[] The created SEO links.
	 */
	public function index() {
		$query = $this->get_query( false, $this->get_limit() );

		$post_ids = $this->wpdb->get_col( $query );

		$indexables = [];
		foreach ( $post_ids as $post_id ) {
			$indexable = $this->repository->find_by_id_and_type( (int) $post_id, 'post' );

			// It's possible the indexable was created without having it's links indexed.
			if ( $indexable->link_count === null ) {
				$post = \get_post( $indexable->object_id );
				$this->link_builder->build( $indexable, $post->post_content );
			}

			$indexables[] = $indexable;
		}

		return $indexables;
	}

	/**
	 * @inheritDoc
	 */
	public function get_limit() {
		/**
		 * Filter 'wpseo_link_indexing_limit' - Allow filtering the amount of posts indexed during each indexing pass.
		 *
		 * @api int The maximum number of posts indexed.
		 */
		return \apply_filters( 'wpseo_post_link_indexing_limit', 5 );
	}

	/**
	 * Queries the database for unindexed term IDs.
	 *
	 * @param bool $count Whether or not it should be a count query.
	 * @param int  $limit The maximum amount of term IDs to return.
	 *
	 * @return string The query.
	 */
	protected function get_query( $count, $limit = 1 ) {
		$public_post_types = $this->post_type_helper->get_accessible_post_types();
		$placeholders      = \implode( ', ', \array_fill( 0, \count( $public_post_types ), '%s' ) );
		$indexable_table   = Model::get_table_name( 'Indexable' );
		$replacements      = $public_post_types;

		$select = 'ID, post_content';
		if ( $count ) {
			$select = 'COUNT(ID)';
		}
		$limit_query = '';
		if ( ! $count ) {
			$limit_query    = 'LIMIT %d';
			$replacements[] = $limit;
		}

		return $this->wpdb->prepare( "
			SELECT $select
			FROM {$this->wpdb->posts}
			WHERE ID NOT IN (SELECT object_id FROM $indexable_table WHERE link_count IS NOT NULL) AND post_status = 'publish' AND post_type IN ($placeholders)
			$limit_query
        ", $replacements );
	}
}
