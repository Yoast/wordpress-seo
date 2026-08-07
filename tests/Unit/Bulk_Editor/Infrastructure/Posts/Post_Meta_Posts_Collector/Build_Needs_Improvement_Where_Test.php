<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Editability_Resolver;
use Yoast\WP\SEO\Tests\Unit\Doubles\Bulk_Editor\Post_Meta_Posts_Collector_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the "needs improvement" WHERE clause the post-meta collector appends.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector::build_needs_improvement_where
 */
final class Build_Needs_Improvement_Where_Test extends TestCase {

	/**
	 * The collector, wrapped in a double that exposes the protected WHERE builder.
	 *
	 * @var Post_Meta_Posts_Collector_Double
	 */
	private $instance;

	/**
	 * The default template resolver mock.
	 *
	 * @var Default_Template_Resolver&\Mockery\MockInterface
	 */
	private $default_template_resolver;

	/**
	 * Sets up the test fixtures.
	 *
	 * A minimal $wpdb stands in: prepare() interpolates its arguments so the generated SQL can be asserted
	 * directly (`%i` as a backticked identifier, `%s` quoted, `%d` as a raw integer).
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		global $wpdb;
		$wpdb           = Mockery::mock();
		$wpdb->posts    = 'wp_posts';
		$wpdb->postmeta = 'wp_postmeta';
		$wpdb->allows( 'prepare' )->andReturnUsing( [ $this, 'interpolate_query' ] );

		$this->default_template_resolver = Mockery::mock( Default_Template_Resolver::class );

		// Return empty string by default — no fallback template configured — so the empty-value clause is kept.
		$this->default_template_resolver->allows( 'resolve_seo_title' )->andReturn( '' )->byDefault();
		$this->default_template_resolver->allows( 'resolve_meta_description' )->andReturn( '' )->byDefault();
		$this->default_template_resolver->allows( 'resolve_social_title' )->andReturn( '' )->byDefault();
		$this->default_template_resolver->allows( 'resolve_social_description' )->andReturn( '' )->byDefault();

		$this->instance = new Post_Meta_Posts_Collector_Double(
			Mockery::mock( Post_Editability_Resolver::class ),
			$this->default_template_resolver,
		);
	}

	/**
	 * Stands in for $wpdb->prepare by interpolating its arguments into the query.
	 *
	 * `%i` becomes a backticked identifier, `%s` a quoted string and `%d` a raw integer, so the generated
	 * SQL can be asserted directly.
	 *
	 * @param string           $query   The query with placeholders.
	 * @param string|int|float ...$args The values to interpolate, in order.
	 *
	 * @return string The interpolated query.
	 */
	public function interpolate_query( $query, ...$args ): string {
		foreach ( $args as $arg ) {
			$query = \preg_replace_callback(
				'/%[isd]/',
				static function ( $placeholder ) use ( $arg ) {
					if ( $placeholder[0] === '%i' ) {
						return '`' . $arg . '`';
					}
					if ( $placeholder[0] === '%d' ) {
						return (string) (int) $arg;
					}

					return "'" . $arg . "'";
				},
				$query,
				1,
			);
		}

		return $query;
	}

	/**
	 * Tests that a search field matches a missing meta row, a present-but-empty row, or a weak score.
	 *
	 * @return void
	 */
	public function test_matches_empty_or_weak_score_when_scoring_enabled() {
		$where = $this->instance->expose_build_needs_improvement_where( [ 'seo_title' ], true );

		// The NOT IN subquery covers both a missing row and a present-but-empty one.
		$this->assertStringContainsString(
			"`wp_posts`.ID NOT IN ( SELECT post_id FROM `wp_postmeta` WHERE meta_key = '_yoast_wpseo_title' AND meta_value <> '' )",
			$where,
		);
		// The score half matches the bad/ok band only.
		$this->assertStringContainsString(
			"`wp_posts`.ID IN ( SELECT post_id FROM `wp_postmeta` WHERE meta_key = '_yoast_wpseo_seo_title_score' AND CAST( meta_value AS SIGNED ) BETWEEN 1 AND 70 )",
			$where,
		);
	}

	/**
	 * Tests that the score half is dropped for search fields when scoring is disabled.
	 *
	 * @return void
	 */
	public function test_omits_score_clause_when_scoring_disabled() {
		$where = $this->instance->expose_build_needs_improvement_where( [ 'seo_title' ], false );

		$this->assertStringContainsString( "meta_key = '_yoast_wpseo_title' AND meta_value <> ''", $where );
		$this->assertStringNotContainsString( 'BETWEEN', $where );
		$this->assertStringNotContainsString( 'seo_title_score', $where );
	}

	/**
	 * Tests that social fields match on emptiness only, even when scoring is enabled.
	 *
	 * @return void
	 */
	public function test_social_fields_match_on_emptiness_only() {
		$where = $this->instance->expose_build_needs_improvement_where( [ 'social_title', 'social_description' ], true );

		$this->assertStringContainsString( "meta_key = '_yoast_wpseo_opengraph-title' AND meta_value <> ''", $where );
		$this->assertStringContainsString( "meta_key = '_yoast_wpseo_opengraph-description' AND meta_value <> ''", $where );
		$this->assertStringNotContainsString( 'BETWEEN', $where );
	}

	/**
	 * Tests that the selected fields are OR-ed inside a single AND group.
	 *
	 * @return void
	 */
	public function test_ors_the_selected_fields() {
		$where = $this->instance->expose_build_needs_improvement_where( [ 'seo_title', 'meta_description' ], true );

		$this->assertStringStartsWith( ' AND ( ', $where );
		$this->assertStringContainsString( ' ) OR ( ', $where );
		$this->assertStringContainsString( '_yoast_wpseo_title', $where );
		$this->assertStringContainsString( '_yoast_wpseo_metadesc', $where );
	}

	/**
	 * Tests that unknown and empty field selections produce no clause.
	 *
	 * @return void
	 */
	public function test_returns_empty_string_for_no_known_fields() {
		$this->assertSame( '', $this->instance->expose_build_needs_improvement_where( [], true ) );
		$this->assertSame( '', $this->instance->expose_build_needs_improvement_where( [ 'unknown_field' ], true ) );
	}

	/**
	 * Tests that a field with a post-type fallback template is excluded from the empty-value clause.
	 *
	 * When the post type has a configured template for a field, template-defaulted posts are not genuinely
	 * empty and should not appear in the "needs improvement" filter. The empty-value clause is replaced
	 * with a false condition so those posts are excluded while the OR-group structure is preserved.
	 *
	 * @return void
	 */
	public function test_skips_empty_clause_when_post_type_has_fallback_template() {
		$this->default_template_resolver->allows( 'resolve_seo_title' )
			->with( 0, 'post', '' )
			->andReturn( '%%title%% %%sep%% %%sitename%%' );

		$where = $this->instance->expose_build_needs_improvement_where( [ 'seo_title' ], false, 'post' );

		$this->assertStringNotContainsString( '_yoast_wpseo_title', $where );
		$this->assertStringContainsString( '0 = 1', $where );
	}

	/**
	 * Tests that only the score clause is kept for a field with a template when scoring is enabled.
	 *
	 * @return void
	 */
	public function test_keeps_score_clause_for_templated_field_when_scoring_enabled() {
		$this->default_template_resolver->allows( 'resolve_seo_title' )
			->with( 0, 'post', '' )
			->andReturn( '%%title%% %%sep%% %%sitename%%' );

		$where = $this->instance->expose_build_needs_improvement_where( [ 'seo_title' ], true, 'post' );

		$this->assertStringNotContainsString( "meta_key = '_yoast_wpseo_title' AND meta_value <> ''", $where );
		$this->assertStringContainsString( '_yoast_wpseo_seo_title_score', $where );
		$this->assertStringContainsString( 'BETWEEN', $where );
	}
}
