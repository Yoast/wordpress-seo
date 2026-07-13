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

	use Post_Title_Trait;
	use Searchable_Fields_Trait;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The resolver for the per-post edit permission.
	 *
	 * @var Post_Editability_Resolver
	 */
	private $post_editability_resolver;

	/**
	 * The constructor.
	 *
	 * @param Indexable_Repository      $indexable_repository      The indexable repository.
	 * @param Post_Editability_Resolver $post_editability_resolver The resolver for the per-post edit permission.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Post_Editability_Resolver $post_editability_resolver
	) {
		$this->indexable_repository      = $indexable_repository;
		$this->post_editability_resolver = $post_editability_resolver;
	}

	/**
	 * Collects a page of posts for the given query.
	 *
	 * A single page is fetched and counted through the database; the per-post edit permission is then
	 * resolved for that page so posts the user cannot edit are returned locked and without their SEO data.
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

		// Deduplicate on the post, keeping the query order.
		$indexables_by_id = [];
		foreach ( $indexables as $indexable ) {
			$indexables_by_id[ (int) $indexable->object_id ] = $indexable;
		}

		$total = $this->resolve_total( $query, \count( $indexables ), \count( $indexables_by_id ) );

		$editability = $this->post_editability_resolver->resolve( \array_keys( $indexables_by_id ) );

		$posts_list = new Posts_List();
		foreach ( $indexables_by_id as $object_id => $indexable ) {
			$posts_list->add( $this->build_post( $indexable, ( $editability[ $object_id ] ?? false ) ) );
		}

		return new Posts_Page( $posts_list, $total, $query->get_page(), $query->get_per_page() );
	}

	/**
	 * Resolves the total number of matching posts.
	 *
	 * A partially-filled page means the result set ended within it, so the total is known without a
	 * second query: the offset plus the distinct posts on this page. Whether the page ended is judged
	 * on the number of rows fetched, before duplicates are removed, since that is what reveals the
	 * database had no more rows. A full or empty page does not reveal the total, so it falls back to a
	 * count query. Non-editable posts are shown locked rather than removed, so they still count.
	 *
	 * @param Posts_Query $query    The query that produced the page.
	 * @param int         $fetched  The number of rows the page returned, before duplicates are removed.
	 * @param int         $distinct The number of distinct posts on the page, after duplicates are removed.
	 *
	 * @return int The total number of matching posts.
	 */
	private function resolve_total( Posts_Query $query, int $fetched, int $distinct ): int {
		if ( $fetched > 0 && $fetched < $query->get_per_page() ) {
			return ( $query->get_offset() + $distinct );
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
			->where_in( 'post_status', $query->get_statuses() )
			// Password-protected posts (is_protected) are not shown in bulk editing.
			->where( 'is_protected', 0 );

		if ( $query->has_author_filter() ) {
			$builder->where( 'author_id', $query->get_author_id() );
		}

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
	 * The SEO data and edit link of a post the current user cannot edit are withheld, so the post is
	 * shown in the list but stays locked and does not expose its metadata.
	 *
	 * @param Indexable $indexable The indexable.
	 * @param bool      $editable  Whether the current user may edit the post.
	 *
	 * @return Post The post.
	 */
	private function build_post( Indexable $indexable, bool $editable ): Post {
		$object_id = (int) $indexable->object_id;
		$title     = $this->get_normalized_title( $object_id );

		if ( ! $editable ) {
			return new Post( $object_id, $title, (string) $indexable->post_status, '', '', '', '', '', '', false );
		}

		return new Post(
			$object_id,
			$title,
			(string) $indexable->post_status,
			(string) \get_edit_post_link( $object_id, 'raw' ),
			(string) $indexable->primary_focus_keyword,
			(string) $indexable->title,
			(string) $indexable->description,
			(string) $indexable->open_graph_title,
			(string) $indexable->open_graph_description,
			true,
		);
	}
}
