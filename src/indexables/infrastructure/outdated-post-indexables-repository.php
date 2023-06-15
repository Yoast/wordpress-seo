<?php

namespace Yoast\WP\SEO\Indexables\infrastructure;

use wpdb;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Indexables\Application\Ports\Outdated_Post_Indexables_Repository_Interface;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Indexables\Domain\Outdated_Post_Indexables_List;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

class Outdated_Post_Indexables_Repository implements Outdated_Post_Indexables_Repository_Interface {

	/**
	 * @var \wpdb
	 */
	protected $wpdb;
	/**
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;
	/**
	 * @var Post_Helper
	 */
	protected $post_helper;
	/**
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	private $indexable_builder;

	public function __construct(
		wpdb $wpdb,
		Post_Type_Helper $post_type_helper,
		Post_Helper $post_helper,
		Indexable_Repository $indexable_repository,
		Indexable_Builder $indexable_builder
	) {
		$this->wpdb                 = $wpdb;
		$this->post_type_helper     = $post_type_helper;
		$this->post_helper          = $post_helper;
		$this->indexable_repository = $indexable_repository;
		$this->indexable_builder    = $indexable_builder;
	}

	/**
	 * @inheritDoc
	 */
	public function get_outdated_post_indexables(
		Last_Batch_Count $count
	): Outdated_Post_Indexables_List {
		$indexable_table = Model::get_table_name( 'Indexable' );


		$post_types             = $this->post_type_helper->get_indexable_post_types();
		$excluded_post_statuses = $this->post_helper->get_excluded_post_statuses();
		$replacements           = \array_merge(
			$post_types,
			$excluded_post_statuses
		);

		$limit_query = '';
		if ( $count->get_last_batch() ) {
			$limit_query    = 'LIMIT %d';
			$replacements[] = $count->get_last_batch();
		}

		// @phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber
		$query = $this->wpdb->prepare(
			"
			SELECT i.*
			FROM {$indexable_table} i
			LEFT JOIN {$this->wpdb->posts} P on P.id = i.object_id
			WHERE i.object_type='post' and object_last_modified <> P.post_modified_gmt
			AND P.post_type IN (" . \implode( ', ', \array_fill( 0, \count( $post_types ), '%s' ) ) . ')
			AND P.post_status NOT IN (' . \implode( ', ', \array_fill( 0, \count( $excluded_post_statuses ), '%s' ) ) . ")
			
			$limit_query",
			$replacements
		);

		$results    = $this->wpdb->get_results( $query, ARRAY_A );
		$indexables = new Outdated_Post_Indexables_List();
		foreach ( $results as $result ) {
			$indexables->add_post_indexable( $this->indexable_repository->query()->create( $result ));
		}

		return $indexables;
	}
}
