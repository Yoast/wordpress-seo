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
	 * The query var that flags our own query so the posts_where filter only touches it.
	 */
	private const QUERY_FLAG = 'yoast_bulk_editor_query';

	/**
	 * The prepared search WHERE clause to append while our query runs.
	 *
	 * @var string
	 */
	private $search_where = '';

	/**
	 * The prepared "needs improvement" WHERE clause to append while our query runs.
	 *
	 * @var string
	 */
	private $needs_improvement_where = '';

	/**
	 * The resolver for the per-post edit permission.
	 *
	 * @var Post_Editability_Resolver
	 */
	private $post_editability_resolver;

	/**
	 * The resolver for the post type's default SEO title / meta description template.
	 *
	 * @var Default_Template_Resolver
	 */
	private $default_template_resolver;

	/**
	 * The constructor.
	 *
	 * @param Post_Editability_Resolver $post_editability_resolver The resolver for the per-post edit permission.
	 * @param Default_Template_Resolver $default_template_resolver The resolver for the default SEO title / meta description template.
	 */
	public function __construct(
		Post_Editability_Resolver $post_editability_resolver,
		Default_Template_Resolver $default_template_resolver
	) {
		$this->post_editability_resolver = $post_editability_resolver;
		$this->default_template_resolver = $default_template_resolver;
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
			$posts_list->add( $this->build_post( $post_id, ( $editability[ $post_id ] ?? false ), $query->are_scores_enabled() ) );
		}

		return new Posts_Page( $posts_list, (int) $wp_query->found_posts, $query->get_page(), $query->get_per_page() );
	}

	/**
	 * Runs the WP_Query for the given query.
	 *
	 * The catch-all search and "needs improvement" clauses are both injected through a scoped posts_where
	 * filter rather than WP_Query's own 's'/'meta_query'. WP_Query AND-joins those, which would miss posts
	 * matching only one side, and WP_Meta_Query's INNER JOINs drop the very missing-meta-row posts the
	 * "needs improvement" filter targets; a hand-built OR clause of correlated subqueries avoids both.
	 *
	 * @param Posts_Query $query The query describing the page to collect.
	 *
	 * @return WP_Query The executed query.
	 */
	protected function run_query( Posts_Query $query ): WP_Query {
		$args = $this->build_query_args( $query );

		$this->search_where            = $query->has_search() ? $this->build_search_where( $query->get_search() ) : '';
		$this->needs_improvement_where = $this->build_needs_improvement_where( $query->get_needs_improvement(), $query->are_scores_enabled(), $query->get_content_type() );

		if ( $this->search_where === '' && $this->needs_improvement_where === '' ) {
			return new WP_Query( $args );
		}

		$args[ self::QUERY_FLAG ] = true;

		\add_filter( 'posts_where', [ $this, 'filter_posts_where' ], 10, 2 );
		$wp_query = new WP_Query( $args );
		\remove_filter( 'posts_where', [ $this, 'filter_posts_where' ], 10 );

		$this->search_where            = '';
		$this->needs_improvement_where = '';

		return $wp_query;
	}

	/**
	 * Builds the WP_Query arguments for the given query.
	 *
	 * @param Posts_Query $query The query describing the page to collect.
	 *
	 * @return array<string, string|int|bool|array<string>|array<int>> The WP_Query arguments.
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

		if ( $query->has_include() ) {
			$args['post__in'] = $query->get_include_ids();
		}

		return $args;
	}

	/**
	 * Appends the prepared search and "needs improvement" clauses to our own query's WHERE.
	 *
	 * @param string   $where    The WHERE clause so far.
	 * @param WP_Query $wp_query The query being filtered.
	 *
	 * @return string The WHERE clause, with our clauses appended for our own query.
	 *
	 * @internal Only public because it is registered as a posts_where filter callback.
	 */
	public function filter_posts_where( $where, $wp_query ): string {
		if ( $wp_query->get( self::QUERY_FLAG ) ) {
			$where .= $this->search_where;
			$where .= $this->needs_improvement_where;
		}

		return $where;
	}

	/**
	 * Builds a post from its ID.
	 *
	 * The SEO data and edit link of a post the current user cannot edit are withheld, so the post is
	 * shown in the list but stays locked and does not expose its metadata.
	 *
	 * @param int  $post_id        The post ID.
	 * @param bool $editable       Whether the current user may edit the post.
	 * @param bool $scores_enabled Whether the per-field scores may back the needs-improvement verdict.
	 *
	 * @return Post The post.
	 */
	private function build_post( int $post_id, bool $editable, bool $scores_enabled ): Post {
		$post      = \get_post( $post_id );
		$status    = ( $post !== null ) ? (string) $post->post_status : '';
		$post_type = ( $post !== null ) ? (string) $post->post_type : '';
		$title     = $this->get_normalized_title( $post_id );

		if ( ! $editable ) {
			return new Post( $post_id, $title, $status, '', '', '', '', '', '', false );
		}

		// Read each field's value once from its meta suffix, keyed by field param, so the values can be reused for
		// the needs-improvement filter. Built from the suffix map to keep a single source of truth.
		$fields = [];
		foreach ( self::FIELD_META_SUFFIXES as $field => $suffix ) {
			$fields[ $field ] = $this->get_meta( $post_id, $suffix );
		}

		$raw_seo_title          = $fields['seo_title'];
		$raw_meta_description   = $fields['meta_description'];
		$raw_social_title       = $fields['social_title'];
		$raw_social_description = $fields['social_description'];

		// Resolve templates for needs-improvement scoring and as display fallbacks when the stored value is empty.
		$fields['seo_title']          = $this->default_template_resolver->resolve_seo_title( $post_id, $post_type, $raw_seo_title );
		$fields['meta_description']   = $this->default_template_resolver->resolve_meta_description( $post_id, $post_type, $raw_meta_description );
		$fields['social_title']       = $this->default_template_resolver->resolve_social_title( $post_id, $post_type, $raw_social_title );
		$fields['social_description'] = $this->default_template_resolver->resolve_social_description( $post_id, $post_type, $raw_social_description );

		return new Post(
			$post_id,
			$title,
			$status,
			(string) \get_edit_post_link( $post_id, 'raw' ),
			$this->get_meta( $post_id, 'focuskw' ),
			$raw_seo_title,
			$raw_meta_description,
			$raw_social_title,
			$raw_social_description,
			true,
			$this->build_needs_improvement( $post_id, $fields, $scores_enabled ),
			( $raw_seo_title === '' ) ? $fields['seo_title'] : '',
			( $raw_meta_description === '' ) ? $fields['meta_description'] : '',
			( $raw_social_title === '' ) ? $fields['social_title'] : '',
			( $raw_social_description === '' ) ? $fields['social_description'] : '',
		);
	}

	/**
	 * Builds the per-field needs-improvement verdict for a post, keyed by field param.
	 *
	 * A field needs improvement when its value is empty, or when its score falls in the bad/ok range.
	 *
	 * @param int                   $post_id        The post ID.
	 * @param array<string, string> $fields         The field values, keyed by field param.
	 * @param bool                  $scores_enabled Whether the per-field scores may back the verdict.
	 *
	 * @return array<string, bool> Whether each field needs improvement, keyed by field param.
	 */
	private function build_needs_improvement( int $post_id, array $fields, bool $scores_enabled ): array {
		$needs_improvement = [];
		foreach ( \array_keys( self::FIELD_META_SUFFIXES ) as $field ) {
			$is_empty = ( ( $fields[ $field ] ?? '' ) === '' );

			$is_bad_score = false;
			if ( $scores_enabled && isset( self::FIELD_SCORE_META_SUFFIXES[ $field ] ) ) {
				$score        = (int) $this->get_meta( $post_id, self::FIELD_SCORE_META_SUFFIXES[ $field ] );
				$is_bad_score = ( $score >= self::NEEDS_IMPROVEMENT_MIN_SCORE && $score <= self::NEEDS_IMPROVEMENT_MAX_SCORE );
			}

			$needs_improvement[ $field ] = ( $is_empty || $is_bad_score );
		}

		return $needs_improvement;
	}

	/**
	 * Builds the prepared "needs improvement" WHERE clause.
	 *
	 * A field needs improvement when its meta row is missing or stores an empty string, or — for fields
	 * with a persisted per-field score and while scoring is enabled — when that score falls in the bad/ok
	 * range. The selected fields are OR-ed so they broaden the result, and unknown field keys are ignored.
	 *
	 * Each field is matched through correlated subqueries rather than WP_Query's meta_query. A `NOT IN`
	 * subquery over the non-empty rows matches both a missing meta row and a present-but-empty one in one
	 * shot; a meta_query cannot, because WP_Meta_Query gives its value comparisons their own INNER JOIN,
	 * which eliminates the missing-row posts before the OR-ed `NOT EXISTS` branch is ever evaluated.
	 *
	 * @param array<string> $fields         The fields that need improvement.
	 * @param bool          $scores_enabled Whether the per-field scores may back the filter.
	 * @param string        $post_type      The post type slug.
	 *
	 * @return string The prepared WHERE clause, or an empty string when no known field is selected.
	 */
	protected function build_needs_improvement_where( array $fields, bool $scores_enabled, string $post_type = '' ): string {
		global $wpdb;

		$has_fallback = [
			'seo_title'          => $this->default_template_resolver->resolve_seo_title( 0, $post_type, '' ) !== '',
			'meta_description'   => $this->default_template_resolver->resolve_meta_description( 0, $post_type, '' ) !== '',
			'social_title'       => $this->default_template_resolver->resolve_social_title( 0, $post_type, '' ) !== '',
			'social_description' => $this->default_template_resolver->resolve_social_description( 0, $post_type, '' ) !== '',
		];

		$clauses = [];
		foreach ( $fields as $field ) {
			if ( ! isset( self::FIELD_META_SUFFIXES[ $field ] ) ) {
				continue;
			}

			$meta_key      = self::META_PREFIX . self::FIELD_META_SUFFIXES[ $field ];
			$field_clauses = [];

			if ( ! ( $has_fallback[ $field ] ?? false ) ) {
				$field_clauses[] = $wpdb->prepare(
					'%i.ID NOT IN ( SELECT post_id FROM %i WHERE meta_key = %s AND meta_value <> %s )',
					$wpdb->posts,
					$wpdb->postmeta,
					$meta_key,
					'',
				);
			}

			if ( $scores_enabled && isset( self::FIELD_SCORE_META_SUFFIXES[ $field ] ) ) {
				$field_clauses[] = $wpdb->prepare(
					'%i.ID IN ( SELECT post_id FROM %i WHERE meta_key = %s AND CAST( meta_value AS SIGNED ) BETWEEN %d AND %d )',
					$wpdb->posts,
					$wpdb->postmeta,
					self::META_PREFIX . self::FIELD_SCORE_META_SUFFIXES[ $field ],
					self::NEEDS_IMPROVEMENT_MIN_SCORE,
					self::NEEDS_IMPROVEMENT_MAX_SCORE,
				);
			}

			// Always add a clause per field — use a false condition when no real predicate applies so the
			// field still participates in the outer OR group without incorrectly matching every row.
			$clauses[] = '( ' . ( ( $field_clauses !== [] ) ? \implode( ' OR ', $field_clauses ) : '0 = 1' ) . ' )';
		}

		if ( $clauses === [] ) {
			return '';
		}

		return ' AND ( ' . \implode( ' OR ', $clauses ) . ' )';
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
