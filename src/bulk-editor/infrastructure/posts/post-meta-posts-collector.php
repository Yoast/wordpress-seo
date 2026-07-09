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
	 * Maps each "needs improvement" field key to its Yoast meta key suffix.
	 *
	 * @var array<string, string>
	 */
	private const FIELD_META_SUFFIXES = [
		'seo_title'          => 'title',
		'meta_description'   => 'metadesc',
		'social_title'       => 'opengraph-title',
		'social_description' => 'opengraph-description',
	];

	/**
	 * Maps the fields with a persisted per-field score to their score meta key suffix.
	 *
	 * The social fields have no assessors, so they match on emptiness only.
	 *
	 * @var array<string, string>
	 */
	private const FIELD_SCORE_META_SUFFIXES = [
		'seo_title'        => 'seo_title_score',
		'meta_description' => 'meta_description_score',
	];

	/**
	 * The per-field score range that counts as "needs improvement": the bad + ok score groups.
	 *
	 * 0 (and a missing meta row) means "never scored" and is deliberately outside the range, so
	 * unscored posts only match through the empty check.
	 *
	 * @var array<int>
	 */
	private const NEEDS_IMPROVEMENT_SCORE_RANGE = [ 1, 70 ];

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
	 * Collects a page of posts for the given query.
	 *
	 * @param Posts_Query $query The query describing the page to collect.
	 *
	 * @return Posts_Page The collected posts together with the totals for pagination.
	 */
	public function get_posts( Posts_Query $query ): Posts_Page {
		$wp_query = $this->run_query( $query );

		$posts_list = new Posts_List();
		foreach ( $wp_query->posts as $post ) {
			$posts_list->add(
				new Post(
					$post->ID,
					$this->get_normalized_title( $post->ID ),
					$post->post_status,
					(string) \get_edit_post_link( $post->ID, 'raw' ),
					$this->get_meta( $post->ID, 'focuskw' ),
					$this->get_meta( $post->ID, 'title' ),
					$this->get_meta( $post->ID, 'metadesc' ),
					$this->get_meta( $post->ID, 'opengraph-title' ),
					$this->get_meta( $post->ID, 'opengraph-description' ),
				),
			);
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
		$args = [
			'post_type'              => $query->get_content_type(),
			'post_status'            => $query->get_statuses(),
			// Exclude password-protected posts from bulk editing.
			'has_password'           => false,
			'posts_per_page'         => $query->get_per_page(),
			'paged'                  => $query->get_page(),
			// Order by post ID so the result matches the indexable collector's ordering.
			'orderby'                => 'ID',
			'order'                  => 'DESC',
			'ignore_sticky_posts'    => true,
			// We render the title, status and Yoast meta, but never the terms, so don't prime the term cache.
			'update_post_term_cache' => false,
		];

		$meta_query = $this->build_needs_improvement_meta_query( $query->get_needs_improvement() );
		if ( $meta_query !== [] ) {
			$args['meta_query'] = $meta_query;
		}

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
	 * Builds the meta_query for the "needs improvement" filter.
	 *
	 * A field needs improvement when its meta row is missing or stores an empty string, or — for fields
	 * with a persisted per-field score — when that score falls in the bad/ok range. The selected fields
	 * are OR-ed so they broaden the result, and unknown field keys are ignored.
	 *
	 * @param array<string> $fields The fields that need improvement.
	 *
	 * @return array<mixed> The meta_query, or an empty array when no known field is selected.
	 */
	private function build_needs_improvement_meta_query( array $fields ): array {
		$clauses = [];
		foreach ( $fields as $field ) {
			if ( ! isset( self::FIELD_META_SUFFIXES[ $field ] ) ) {
				continue;
			}

			$meta_key  = self::META_PREFIX . self::FIELD_META_SUFFIXES[ $field ];
			$clauses[] = [
				'key'     => $meta_key,
				'compare' => 'NOT EXISTS',
			];
			$clauses[] = [
				'key'     => $meta_key,
				'value'   => '',
				'compare' => '=',
			];

			if ( isset( self::FIELD_SCORE_META_SUFFIXES[ $field ] ) ) {
				$clauses[] = [
					'key'     => self::META_PREFIX . self::FIELD_SCORE_META_SUFFIXES[ $field ],
					'value'   => self::NEEDS_IMPROVEMENT_SCORE_RANGE,
					'compare' => 'BETWEEN',
					'type'    => 'NUMERIC',
				];
			}
		}

		if ( $clauses === [] ) {
			return [];
		}

		return \array_merge( [ 'relation' => 'OR' ], $clauses );
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
