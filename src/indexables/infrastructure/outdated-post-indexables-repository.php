<?php

namespace Yoast\WP\SEO\Indexables\Infrastructure;

use wpdb;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Indexables\Application\Ports\Outdated_Post_Indexables_Repository_Interface;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Outdated_Posts_Found_Exception;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Indexables\Domain\Outdated_Post_Indexables_List;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * The Outdated_Post_Indexables_Repository class.
 */
class Outdated_Post_Indexables_Repository implements Outdated_Post_Indexables_Repository_Interface {

	/**
	 * The wp query.
	 *
	 * @var wpdb $wpdb
	 */
	private $wpdb;

	/**
	 * The post type helper instance.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The post helper instance.
	 *
	 * @var Post_Helper
	 */
	private $post_helper;

	/**
	 * The indexable repository instance.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The constructor.
	 *
	 * @param wpdb                 $wpdb                 The wpdb instance.
	 * @param Post_Type_Helper     $post_type_helper     The post type helper.
	 * @param Post_Helper          $post_helper          The post helper.
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct(
		wpdb $wpdb,
		Post_Type_Helper $post_type_helper,
		Post_Helper $post_helper,
		Indexable_Repository $indexable_repository
	) {
		$this->wpdb                 = $wpdb;
		$this->post_type_helper     = $post_type_helper;
		$this->post_helper          = $post_helper;
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * The get outdated post indexables
	 *
	 * @param Last_Batch_Count $count The last batch count domain object.
	 *
	 * @throws No_Outdated_Posts_Found_Exception When there are no outdated posts found.
	 * @return Outdated_Post_Indexables_List
	 */
	public function get_outdated_post_indexables(
		Last_Batch_Count $count
	): Outdated_Post_Indexables_List {
		$indexable_table = Model::get_table_name( 'Indexable' );

		$post_types             = $this->post_type_helper->get_indexable_post_types();
		$excluded_post_statuses = $this->post_helper->get_excluded_post_statuses();
		$query                  = $this->indexable_repository->query();

		if ( $count->get_last_batch() ) {
			$query->limit( $count->get_last_batch() );
		}

		$query->join( $this->wpdb->posts, "P.id = $indexable_table.object_id", 'P' );
		$query->where( 'object_type', 'post' );
		$query->where_raw( 'object_last_modified <> P.post_modified_gmt' );
		$query->where_raw( 'P.post_type IN (' . \implode( ', ', \array_fill( 0, \count( $post_types ), '%s' ) ) . ')', $post_types );
		$query->where_raw( 'P.post_status NOT IN (' . \implode( ', ', \array_fill( 0, \count( $excluded_post_statuses ), '%s' ) ) . ')', $excluded_post_statuses );

		$indexables = $query->find_many();

		if ( \count( $indexables ) === 0 ) {
			throw No_Outdated_Posts_Found_Exception::because_no_outdated_posts_queried();
		}

		$indexable_list = new Outdated_Post_Indexables_List();
		foreach ( $indexables as $indexable ) {
			$indexable_list->add_post_indexable( $indexable );
		}

		return $indexable_list;
	}
}
