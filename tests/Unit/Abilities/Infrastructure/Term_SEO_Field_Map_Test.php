<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Field_Map;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Surfaces\Values\Meta_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Term_SEO_Field_Map class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Field_Map
 */
final class Term_SEO_Field_Map_Test extends TestCase {

	/**
	 * The meta surface.
	 *
	 * @var Mockery\MockInterface|Meta_Surface
	 */
	private $meta_surface;

	/**
	 * The instance under test.
	 *
	 * @var Term_SEO_Field_Map
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->meta_surface = Mockery::mock( Meta_Surface::class );
		$this->instance     = new Term_SEO_Field_Map( $this->meta_surface );
	}

	/**
	 * Tests that to_seo_array maps a term indexable to the full output shape,
	 * including the rendered front-end companions.
	 *
	 * @covers ::__construct
	 * @covers ::to_seo_array
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::get_shared_seo_fields
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::rendered
	 *
	 * @return void
	 */
	public function test_to_seo_array() {
		$indexable = $this->make_indexable();

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Term_Archive' )->andReturn(
			new Meta_Double(
				[
					'title'                  => 'Rendered SEO title',
					'meta_description'       => 'Rendered meta description',
					'canonical'              => 'https://example.com/category/news/',
					'open_graph_title'       => 'Rendered OG title',
					'open_graph_description' => 'Rendered OG description',
					'twitter_title'          => 'Rendered Twitter title',
					'twitter_description'    => '',
				],
			),
		);

		$this->assertSame(
			[
				'term_id'                         => 7,
				'term_name'                       => 'News',
				'permalink'                       => 'https://example.com/category/news/',
				'taxonomy'                        => 'category',
				'seo_title'                       => 'My SEO title',
				'seo_title_rendered'              => 'Rendered SEO title',
				'meta_description'                => 'My meta description',
				'meta_description_rendered'       => 'Rendered meta description',
				'focus_keyphrase'                 => 'news',
				'canonical'                       => null,
				'canonical_rendered'              => 'https://example.com/category/news/',
				'is_cornerstone'                  => false,
				'noindex'                         => true,
				'open_graph_title'                => 'OG title',
				'open_graph_title_rendered'       => 'Rendered OG title',
				'open_graph_description'          => 'OG description',
				'open_graph_description_rendered' => 'Rendered OG description',
				'twitter_title'                   => 'Twitter title',
				'twitter_title_rendered'          => 'Rendered Twitter title',
				'twitter_description'             => null,
				// An empty presented value is normalised to null.
				'twitter_description_rendered'    => null,
				'seo_score'                       => 'good',
				'readability_score'               => 'ok',
				'inclusive_language_score'        => 'na',
			],
			$this->instance->to_seo_array( $indexable ),
		);
	}

	/**
	 * Tests that the rendered companions are null when no meta is available for the term.
	 *
	 * @covers ::to_seo_array
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::get_shared_seo_fields
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::rendered
	 *
	 * @return void
	 */
	public function test_to_seo_array_without_meta() {
		$indexable = $this->make_indexable();

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Term_Archive' )->andReturnFalse();

		$result = $this->instance->to_seo_array( $indexable );

		$this->assertNull( $result['seo_title_rendered'] );
		$this->assertNull( $result['canonical_rendered'] );
		$this->assertSame( 'My SEO title', $result['seo_title'] );
	}

	/**
	 * Tests that the term field map writes the term fields and reports the touched columns.
	 *
	 * @covers ::get_string_fields
	 * @covers ::get_boolean_fields
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$changed = $this->instance->apply_to_indexable(
			[
				'seo_title'           => 'New title',
				'meta_description'    => '',
				'twitter_description' => 'X description',
				'is_cornerstone'      => true,
				'noindex'             => null,
			],
			$indexable,
		);

		$this->assertSame( 'New title', $indexable->title );
		$this->assertNull( $indexable->description );
		$this->assertSame( 'X description', $indexable->twitter_description );
		$this->assertTrue( $indexable->is_cornerstone );
		$this->assertNull( $indexable->is_robots_noindex );
		$this->assertSame( [ 'title', 'description', 'twitter_description', 'is_cornerstone', 'is_robots_noindex' ], $changed );
	}

	/**
	 * Tests that post-only fields are not applied to a term, as terms have no storage for them.
	 *
	 * @covers ::get_string_fields
	 * @covers ::get_boolean_fields
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_ignores_post_only_fields() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$changed = $this->instance->apply_to_indexable(
			[
				'nofollow'            => true,
				'noimageindex'        => true,
				'noarchive'           => true,
				'nosnippet'           => true,
				'schema_page_type'    => 'WebPage',
				'schema_article_type' => 'BlogPosting',
			],
			$indexable,
		);

		$this->assertSame( [], $changed );
	}

	/**
	 * Builds a term indexable mock populated with representative SEO data.
	 *
	 * @return Mockery\MockInterface The indexable mock.
	 */
	private function make_indexable() {
		$indexable                        = Mockery::mock();
		$indexable->object_id             = 7;
		$indexable->breadcrumb_title      = 'News';
		$indexable->permalink             = 'https://example.com/category/news/';
		$indexable->object_sub_type       = 'category';
		$indexable->title                 = 'My SEO title';
		$indexable->description           = 'My meta description';
		$indexable->primary_focus_keyword = 'news';
		$indexable->canonical             = null;
		// The term builder stores the raw '0'/'1' term meta value.
		$indexable->is_cornerstone              = '0';
		$indexable->is_robots_noindex           = true;
		$indexable->open_graph_title            = 'OG title';
		$indexable->open_graph_description      = 'OG description';
		$indexable->twitter_title               = 'Twitter title';
		$indexable->twitter_description         = null;
		$indexable->primary_focus_keyword_score = 78;
		$indexable->readability_score           = 45;
		$indexable->inclusive_language_score    = 0;

		return $indexable;
	}
}
