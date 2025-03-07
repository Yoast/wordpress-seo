<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Score_Groups;

use Brain\Monkey\Functions;
use Generator;
use Mockery;
use WP_Taxonomy;
use WP_Term;
use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Score_Groups_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\Ok_SEO_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\Dashboard\Infrastructure\Score_Groups\Score_Group_Link_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the get_view_link method.
 *
 * @group  Score_Group_Link_Collector
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Score_Groups\Score_Group_Link_Collector::get_view_link
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_View_Link_Score_Group_Link_Collector_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Score_Group_Link_Collector
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function set_up() {
		$this->instance = new Score_Group_Link_Collector();
	}

	/**
	 * Tests if the correct view link is generated.
	 *
	 * @dataProvider generate_get_view_link_provider
	 *
	 * @param string|null            $expected           The expected value.
	 * @param Score_Groups_Interface $score_group        The score groups the link is generated for.
	 * @param Content_Type           $content_type       The content type.
	 * @param Taxonomy|null          $taxonomy           The taxonomy of the term we might be filtering.
	 * @param string|bool            $taxonomy_query_var The taxonomy query var portion of the taxonomy.
	 * @param int|null               $term_id            The ID of the term we might be filtering.
	 *
	 * @return void
	 */
	public function test_get_view_link(
		?string $expected,
		Score_Groups_Interface $score_group,
		Content_Type $content_type,
		?Taxonomy $taxonomy,
		$taxonomy_query_var,
		?int $term_id
	) {
		$post_page = 'edit.php';
		Functions\expect( 'admin_url' )
			->with( 'edit.php' )
			->andReturn( $post_page );

		if ( $taxonomy === null || $term_id === null ) {
			Functions\expect( 'add_query_arg' )
				->with(
					[
						'post_status'                  => 'publish',
						'post_type'                    => $content_type->get_name(),
						$score_group->get_filter_key() => $score_group->get_filter_value(),
					]
				)
				->andReturn( 'edit.php?post_status=publish&page_type=' . $content_type->get_name() . '&' . $score_group->get_filter_key() . '=' . $score_group->get_filter_value() );
		}
		if ( $taxonomy !== null ) {
			$wp_tax            = Mockery::mock( WP_Taxonomy::class )->makePartial();
			$wp_tax->query_var = $taxonomy_query_var;
			$wp_term           = Mockery::mock( WP_Term::class )->makePartial();
			$wp_term->slug     = 'slug';
			Functions\expect( 'get_taxonomy' )
				->with( $taxonomy->get_name() )
				->andReturn( $wp_tax );

			if ( $taxonomy_query_var !== false ) {
				Functions\expect( 'get_term' )
					->with( $term_id )
					->andReturn( $wp_term );

				Functions\expect( 'add_query_arg' )
					->with(
						[
							'post_status'                  => 'publish',
							'post_type'                    => $content_type->get_name(),
							$score_group->get_filter_key() => $score_group->get_filter_value(),
						]
					)
					->andReturn( 'edit.php?post_status=publish&page_type=' . $content_type->get_name() . '&' . $score_group->get_filter_key() . '=' . $score_group->get_filter_value() . '&' . $taxonomy_query_var . '=slug' );
			}
		}

		$this->assertSame( $expected, $this->instance->get_view_link( $score_group, $content_type, $taxonomy, $term_id ) );
	}

	/**
	 * Provides data testing if the Site Kit GA plugin is enabled.
	 *
	 * @return Generator Test data to use.
	 */
	public static function generate_get_view_link_provider() {
		yield 'No term or tax' => [
			'expected'           => 'edit.php?post_status=publish&page_type=ok&seo_filter=ok',
			'score_group'        => new Ok_SEO_Score_Group(),
			'content_type'       => new Content_Type( 'ok', 'OK' ),
			'taxonomy'           => null,
			'taxonomy_query_var' => '',
			'term_id'            => null,
		];
		yield 'Taxonomy but no term_id' => [
			'expected'           => 'edit.php?post_status=publish&page_type=ok&seo_filter=ok',
			'score_group'        => new Ok_SEO_Score_Group(),
			'content_type'       => new Content_Type( 'ok', 'OK' ),
			'taxonomy'           => new Taxonomy( 'no query', 'No query', '' ),
			'taxonomy_query_var' => '',
			'term_id'            => null,
		];
		yield 'Empty taxonomy' => [
			'expected'           => null,
			'score_group'        => new Ok_SEO_Score_Group(),
			'content_type'       => new Content_Type( 'ok', 'OK' ),
			'taxonomy'           => new Taxonomy( 'no query', 'No query', '' ),
			'taxonomy_query_var' => false,
			'term_id'            => 1,
		];
		yield 'Taxonomy and term' => [
			'expected'           => 'edit.php?post_status=publish&page_type=ok&seo_filter=ok&query=slug',
			'score_group'        => new Ok_SEO_Score_Group(),
			'content_type'       => new Content_Type( 'ok', 'OK' ),
			'taxonomy'           => new Taxonomy( 'query', 'Query', '' ),
			'taxonomy_query_var' => 'query',
			'term_id'            => 1,
		];
		yield 'Empty query var' => [
			'expected'           => null,
			'score_group'        => new Ok_SEO_Score_Group(),
			'content_type'       => new Content_Type( 'ok', 'OK' ),
			'taxonomy'           => new Taxonomy( 'query', 'Query', '' ),
			'taxonomy_query_var' => '',
			'term_id'            => 1,
		];
	}
}
