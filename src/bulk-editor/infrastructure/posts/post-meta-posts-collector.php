<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts;

use WP_Query;
use Yoast\WP\SEO\Bulk_Editor\Application\Posts\Posts_Collector_Interface;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Post;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_List;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Page;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Query;

/**
 * Collects bulk editor posts by reading raw Yoast post meta.
 *
 * This is the fallback used when indexables are disabled.
 */
class Post_Meta_Posts_Collector implements Posts_Collector_Interface {

	use Post_Title_Trait;
	use Searchable_Fields_Trait;

	/**
	 * The Yoast post meta key prefix.
	 */
	private const META_PREFIX = '_yoast_wpseo_';

	/**
	 * The query var that flags our own query so the search filter only touches it.
	 */
	private const SEARCH_FLAG = 'yoast_bulk_editor_search';

	/**
	 * The prepared WHERE clause to append while our search query runs.
	 *
	 * @var string
	 */
	private $search_where = '';

	/**
	 * The resolver for the per-post edit permission.
	 *
	 * @var Post_Editability_Resolver
	 */
	private $post_editability_resolver;

	/**
	 * The constructor.
	 *
	 * @param Post_Editability_Resolver $post_editability_resolver The resolver for the per-post edit permission.
	 */
	public function __construct( Post_Editability_Resolver $post_editability_resolver ) {
		$this->post_editability_resolver = $post_editability_resolver;
	}

	/**
	 * Collects a page of posts for the given query.
	 *
	 * A single page is fetched and counted through WP_Query; the per-post edit permission is then resolved
	 * for that page so posts the user cannot edit are returned locked and without their SEO data.
	 *
	 * @param Posts_Query $query The query describing the page to collect.
	 *
	 * @return Posts_Page The collected posts together with the totals for pagination.
	 */
	public function get_posts( Posts_Query $query ): Posts_Page {
		$wp_query = $this->run_query( $query );
		$post_ids = \array_map( 'intval', $wp_query->posts );

		$editability = $this->post_editability_resolver->resolve( $post_ids );

		$posts_list = new Posts_List();
		foreach ( $post_ids as $post_id ) {
			$posts_list->add( $this->build_post( $post_id, ( $editability[ $post_id ] ?? false ) ) );
		}

		return new Posts_Page( $posts_list, (int) $wp_query->found_posts, $query->get_page(), $query->get_per_page() );
	}

	/**
	 * Runs the WP_Query for the given query.
	 *
	 * When a search term is set, the catch-all clause is injected through a scoped posts_where filter:
	 * WP_Query AND-joins its own 's' and 'meta_query', which would miss posts matching only one side, so
	 * a single OR clause covering the post title and the Yoast meta is added instead.
	 *
	 * @param Posts_Query $query The query describing the page to collect.
	 *
	 * @return WP_Query The executed query.
	 */
	protected function run_query( Posts_Query $query ): WP_Query {
		$args = $this->build_query_args( $query );

		if ( ! $query->has_search() ) {
			return new WP_Query( $args );
		}

		$args[ self::SEARCH_FLAG ] = true;
		$this->search_where        = $this->build_search_where( $query->get_search() );

		\add_filter( 'posts_where', [ $this, 'filter_posts_where' ], 10, 2 );
		$wp_query = new WP_Query( $args );
		\remove_filter( 'posts_where', [ $this, 'filter_posts_where' ], 10 );

		$this->search_where = '';

		return $wp_query;
	}

	/**
	 * Builds the WP_Query arguments for the given query.
	 *
	 * @param Posts_Query $query The query describing the page to collect.
	 *
	 * @return array<string, string|int|bool|array<string>> The WP_Query arguments.
	 */
	private function build_query_args( Posts_Query $query ): array {
		$args = [
			'post_type'              => $query->get_content_type(),
			'post_status'            => $query->get_statuses(),
			// Exclude password-protected posts from bulk editing.
			'has_password'           => false,
			'fields'                 => 'ids',
			'posts_per_page'         => $query->get_per_page(),
			'paged'                  => $query->get_page(),
			// Order by post ID so the result matches the indexable collector's ordering.
			'orderby'                => 'ID',
			'order'                  => 'DESC',
			'ignore_sticky_posts'    => true,
			// We render the title, status and Yoast meta, but never the terms, so don't prime the term cache.
			'update_post_term_cache' => false,
		];

		if ( $query->has_author_filter() ) {
			$args['author'] = $query->get_author_id();
		}

		return $args;
	}

	/**
	 * Appends the prepared search clause to our own query's WHERE.
	 *
	 * @param string   $where    The WHERE clause so far.
	 * @param WP_Query $wp_query The query being filtered.
	 *
	 * @return string The WHERE clause, with the search clause appended for our query.
	 *
	 * @internal Only public because it is registered as a posts_where filter callback.
	 */
	public function filter_posts_where( $where, $wp_query ): string {
		if ( $wp_query->get( self::SEARCH_FLAG ) ) {
			$where .= $this->search_where;
		}

		return $where;
	}

	/**
	 * Builds a post from its ID.
	 *
	 * The SEO data and edit link of a post the current user cannot edit are withheld, so the post is
	 * shown in the list but stays locked and does not expose its metadata.
	 *
	 * @param int  $post_id  The post ID.
	 * @param bool $editable Whether the current user may edit the post.
	 *
	 * @return Post The post.
	 */
	private function build_post( int $post_id, bool $editable ): Post {
		$post   = \get_post( $post_id );
		$status = ( $post !== null ) ? (string) $post->post_status : '';
		$title  = $this->get_normalized_title( $post_id );

		if ( ! $editable ) {
			return new Post( $post_id, $title, $status, '', '', '', '', '', '', false );
		}

		return new Post(
			$post_id,
			$title,
			$status,
			(string) \get_edit_post_link( $post_id, 'raw' ),
			$this->get_meta( $post_id, 'focuskw' ),
			$this->get_meta( $post_id, 'title' ),
			$this->get_meta( $post_id, 'metadesc' ),
			$this->get_meta( $post_id, 'opengraph-title' ),
			$this->get_meta( $post_id, 'opengraph-description' ),
			true,
		);
	}

	/**
	 * Builds the prepared catch-all search WHERE clause.
	 *
	 * @param string $search The search term.
	 *
	 * @return string The prepared WHERE clause.
	 */
	private function build_search_where( string $search ): string {
		global $wpdb;

		$like      = '%' . $wpdb->esc_like( $search ) . '%';
		$meta_keys = \array_map(
			static function ( $suffix ) {
				return self::META_PREFIX . $suffix;
			},
			\array_values( $this->searchable_fields() ),
		);

		// phpcs:disable WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber -- Reason: we're passing an array instead.
		return $wpdb->prepare(
			' AND ( %i.post_title LIKE %s'
			. ' OR %i.ID IN ( SELECT post_id FROM %i'
			. ' WHERE meta_key IN ( ' . \implode( ', ', \array_fill( 0, \count( $meta_keys ), '%s' ) ) . ' ) AND meta_value LIKE %s ) )',
			\array_merge( [ $wpdb->posts, $like, $wpdb->posts, $wpdb->postmeta ], $meta_keys, [ $like ] ),
		);
		// phpcs:enable
	}

	/**
	 * Reads a raw Yoast post meta value.
	 *
	 * Reads the raw meta directly so the stored value round-trips with the bulk update endpoint,
	 * regardless of which social options are enabled.
	 *
	 * @param int    $post_id The post ID.
	 * @param string $key     The meta key, without the Yoast prefix.
	 *
	 * @return string The meta value.
	 */
	private function get_meta( int $post_id, string $key ): string {
		return (string) \get_post_meta( $post_id, self::META_PREFIX . $key, true );
	}
}
