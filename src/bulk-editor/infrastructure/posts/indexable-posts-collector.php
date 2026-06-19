<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Bulk_Editor\Application\Posts\Posts_Collector_Interface;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Post;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_List;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Page;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Query;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Collects bulk editor posts by reading from the indexable table.
 *
 * This is the default used when indexables are active.
 */
class Indexable_Posts_Collector implements Posts_Collector_Interface {

	use Searchable_Fields_Trait;

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
	 * Collects a page of posts for the given query.
	 *
	 * @param Posts_Query $query The query describing the page to collect.
	 *
	 * @return Posts_Page The collected posts together with the totals for pagination.
	 */
	public function get_posts( Posts_Query $query ): Posts_Page {
		$indexables = $this->build_query( $query )
			->order_by_desc( 'object_id' )
			->limit( $query->get_per_page() )
			->offset( $query->get_offset() )
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

		$total = $this->resolve_total( $query, \count( $indexables ) );

		return new Posts_Page( $posts_list, $total, $query->get_page(), $query->get_per_page() );
	}

	/**
	 * Resolves the total number of matching posts.
	 *
	 * A partially-filled page means the result set ended within it, so the total is known without a
	 * second query. A full or empty page does not reveal the total, so it falls back to a count query.
	 *
	 * @param Posts_Query $query The query that produced the page.
	 * @param int         $found The number of rows the page returned.
	 *
	 * @return int The total number of matching posts.
	 */
	private function resolve_total( Posts_Query $query, int $found ): int {
		if ( $found > 0 && $found < $query->get_per_page() ) {
			return ( $query->get_offset() + $found );
		}

		return (int) $this->build_query( $query )->count();
	}

	/**
	 * Builds the filtered indexable query for the given query, without ordering or paging.
	 *
	 * Built fresh for each use so the same filters back both the total count and the page of rows.
	 *
	 * @param Posts_Query $query The query describing the filters to apply.
	 *
	 * @return ORM The filtered query.
	 */
	private function build_query( Posts_Query $query ): ORM {
		$builder = $this->indexable_repository->query()
			->where( 'object_type', 'post' )
			->where( 'object_sub_type', $query->get_content_type() )
			->where_in( 'post_status', $query->get_statuses() );

		if ( $query->has_search() ) {
			$this->apply_search( $builder, $query->get_search() );
		}

		return $builder;
	}

	/**
	 * Adds the catch-all search clause to the query.
	 *
	 * The post title lives in the posts table, so it is matched through a subquery while the remaining
	 * fields are matched directly on the indexable. All clauses are OR-ed inside a single group so they
	 * do not interfere with the other filters.
	 *
	 * @param ORM    $builder The query to add the search clause to.
	 * @param string $search  The search term.
	 *
	 * @return void
	 */
	private function apply_search( ORM $builder, string $search ): void {
		global $wpdb;

		$like = '%' . $wpdb->esc_like( $search ) . '%';

		// The post title lives in the posts table, so match it through a subquery; the rest are indexable columns.
		$clauses = [ 'object_id IN ( SELECT ID FROM ' . $wpdb->posts . ' WHERE post_title LIKE %s )' ];
		foreach ( \array_keys( $this->searchable_fields() ) as $column ) {
			$clauses[] = $column . ' LIKE %s';
		}

		// The ORM binds each %s through $wpdb->prepare; one bound value per clause.
		$builder->where_raw(
			'( ' . \implode( ' OR ', $clauses ) . ' )',
			\array_fill( 0, \count( $clauses ), $like ),
		);
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
