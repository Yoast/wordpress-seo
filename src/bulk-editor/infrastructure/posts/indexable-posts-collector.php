<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts;

use Yoast\WP\SEO\Bulk_Editor\Application\Posts\Posts_Collector_Interface;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Post;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_List;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Collects bulk editor posts by reading from the indexable table.
 *
 * This is the default used when indexables are active.
 */
class Indexable_Posts_Collector implements Posts_Collector_Interface {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Collects a page of posts for the given content type.
	 *
	 * @param string $content_type The content type to collect posts for.
	 * @param int    $per_page     The number of posts to collect.
	 *
	 * @return Posts_List The collected posts.
	 */
	public function get_posts( string $content_type, int $per_page ): Posts_List {
		$indexables = $this->indexable_repository->query()
			->where( 'object_type', 'post' )
			->where( 'object_sub_type', $content_type )
			->where_in( 'post_status', Posts_Collector_Interface::STATUSES )
			->order_by_desc( 'object_id' )
			->limit( $per_page )
			->find_many();

		$unique_indexables = [];
		foreach ( $indexables as $indexable ) {
			$unique_indexables[ (int) $indexable->object_id ] = $indexable;
		}

		if ( $unique_indexables !== [] ) {
			// Prime the post cache so get_the_title()/get_edit_post_link() read from cache instead of one query per post.
			\_prime_post_caches( \array_keys( $unique_indexables ), false, false );
		}

		$posts_list = new Posts_List();

		foreach ( $unique_indexables as $indexable ) {
			$posts_list->add( $this->build_post( $indexable ) );
		}

		return $posts_list;
	}

	/**
	 * Builds a post from an indexable.
	 *
	 * The indexable does not store the post title or edit link, so those are read from WordPress.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return Post The post.
	 */
	private function build_post( Indexable $indexable ): Post {
		$object_id = (int) $indexable->object_id;

		return new Post(
			$object_id,
			\get_the_title( $object_id ),
			(string) $indexable->post_status,
			(string) \get_edit_post_link( $object_id, 'raw' ),
			(string) $indexable->primary_focus_keyword,
			(string) $indexable->title,
			(string) $indexable->description,
			(string) $indexable->open_graph_title,
			(string) $indexable->open_graph_description,
		);
	}
}
