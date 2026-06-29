<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Field_Map;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Surfaces\Values\Meta;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Post_SEO_Field_Map class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Post_SEO_Field_Map
 */
final class Post_SEO_Field_Map_Test extends TestCase {

	/**
	 * The meta surface.
	 *
	 * @var Mockery\MockInterface|Meta_Surface
	 */
	private $meta_surface;

	/**
	 * The instance under test.
	 *
	 * @var Post_SEO_Field_Map
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
		$this->instance     = new Post_SEO_Field_Map( $this->meta_surface );
	}

	/**
	 * Tests that to_seo_array maps an indexable to the full output shape,
	 * including the rendered front-end companions.
	 *
	 * @covers ::__construct
	 * @covers ::to_seo_array
	 * @covers ::rendered
	 * @covers ::inclusive_language_rank
	 *
	 * @return void
	 */
	public function test_to_seo_array() {
		$indexable = $this->make_indexable();

		$this->meta_surface->expects( 'for_post' )->once()->with( 42 )->andReturn(
			$this->make_meta(
				[
					'title'                  => 'Rendered SEO title',
					'meta_description'       => 'Rendered meta description',
					'canonical'              => 'https://example.com/hello-world/',
					'open_graph_title'       => 'Rendered OG title',
					'open_graph_description' => 'Rendered OG description',
					'twitter_title'          => 'Rendered Twitter title',
					'twitter_description'    => 'Rendered Twitter description',
				],
			),
		);

		$result = $this->instance->to_seo_array( $indexable );

		$this->assertSame(
			[
				'post_id'                         => 42,
				'post_title'                      => 'Hello world',
				'permalink'                       => 'https://example.com/hello-world/',
				'post_type'                       => 'post',
				'post_status'                     => 'publish',
				'seo_title'                       => 'My SEO title',
				'seo_title_rendered'              => 'Rendered SEO title',
				'meta_description'                => 'My meta description',
				'meta_description_rendered'       => 'Rendered meta description',
				'focus_keyphrase'                 => 'hello world',
				'canonical'                       => 'https://example.com/canonical/',
				'canonical_rendered'              => 'https://example.com/hello-world/',
				'is_cornerstone'                  => true,
				'noindex'                         => null,
				'nofollow'                        => false,
				'noimageindex'                    => false,
				'noarchive'                       => true,
				'nosnippet'                       => false,
				'open_graph_title'                => 'OG title',
				'open_graph_title_rendered'       => 'Rendered OG title',
				'open_graph_description'          => 'OG description',
				'open_graph_description_rendered' => 'Rendered OG description',
				'twitter_title'                   => 'Twitter title',
				'twitter_title_rendered'          => 'Rendered Twitter title',
				'twitter_description'             => 'Twitter description',
				'twitter_description_rendered'    => 'Rendered Twitter description',
				'schema_page_type'                => 'WebPage',
				'schema_article_type'             => 'BlogPosting',
				'seo_score'                       => 'good',
				'readability_score'               => 'ok',
				'inclusive_language_score'        => 'na',
			],
			$result,
		);
	}

	/**
	 * Tests that the rendered companions are null when no meta is available for the post.
	 *
	 * @covers ::to_seo_array
	 * @covers ::rendered
	 *
	 * @return void
	 */
	public function test_to_seo_array_without_meta() {
		$indexable = $this->make_indexable();

		$this->meta_surface->expects( 'for_post' )->once()->with( 42 )->andReturnFalse();

		$result = $this->instance->to_seo_array( $indexable );

		$this->assertNull( $result['seo_title_rendered'] );
		$this->assertNull( $result['meta_description_rendered'] );
		$this->assertNull( $result['canonical_rendered'] );
		$this->assertNull( $result['open_graph_title_rendered'] );
		$this->assertNull( $result['open_graph_description_rendered'] );
		$this->assertNull( $result['twitter_title_rendered'] );
		$this->assertNull( $result['twitter_description_rendered'] );

		// The raw stored values are still mapped from the indexable.
		$this->assertSame( 'My SEO title', $result['seo_title'] );
	}

	/**
	 * Tests that an empty presented value is normalised to null rather than an empty string.
	 *
	 * @covers ::rendered
	 *
	 * @return void
	 */
	public function test_to_seo_array_empty_rendered_value_is_null() {
		$indexable = $this->make_indexable();

		$this->meta_surface->expects( 'for_post' )->once()->with( 42 )->andReturn(
			$this->make_meta(
				[
					'title'                  => 'Rendered SEO title',
					'meta_description'       => '',
					'canonical'              => 'https://example.com/hello-world/',
					'open_graph_title'       => 'Rendered OG title',
					'open_graph_description' => 'Rendered OG description',
					'twitter_title'          => 'Rendered Twitter title',
					'twitter_description'    => 'Rendered Twitter description',
				],
			),
		);

		$result = $this->instance->to_seo_array( $indexable );

		$this->assertNull( $result['meta_description_rendered'] );
	}

	/**
	 * Tests that string fields are set from their value and cleared to null when emptied.
	 *
	 * @covers ::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_string_fields_set_and_clear() {
		$indexable = Mockery::mock();

		$this->instance->apply_to_indexable(
			[
				'seo_title'        => 'New title',
				'meta_description' => '',
				'canonical'        => null,
				'focus_keyphrase'  => 'a phrase',
			],
			$indexable,
		);

		$this->assertSame( 'New title', $indexable->title );
		$this->assertNull( $indexable->description );
		$this->assertNull( $indexable->canonical );
		$this->assertSame( 'a phrase', $indexable->primary_focus_keyword );
	}

	/**
	 * Tests that boolean flags are cast and written to their indexable column.
	 *
	 * @covers ::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_boolean_flags() {
		$indexable = Mockery::mock();

		$this->instance->apply_to_indexable(
			[
				'is_cornerstone' => true,
				'nofollow'       => false,
				'noimageindex'   => true,
				'noarchive'      => false,
				'nosnippet'      => true,
			],
			$indexable,
		);

		$this->assertTrue( $indexable->is_cornerstone );
		$this->assertFalse( $indexable->is_robots_nofollow );
		$this->assertTrue( $indexable->is_robots_noimageindex );
		$this->assertFalse( $indexable->is_robots_noarchive );
		$this->assertTrue( $indexable->is_robots_nosnippet );
	}

	/**
	 * Tests the tri-state noindex mapping: true and false set a boolean, null resets to the default.
	 *
	 * @covers ::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_noindex() {
		$noindex = Mockery::mock();
		$index   = Mockery::mock();
		$default = Mockery::mock();

		$this->instance->apply_to_indexable( [ 'noindex' => true ], $noindex );
		$this->instance->apply_to_indexable( [ 'noindex' => false ], $index );
		$this->instance->apply_to_indexable( [ 'noindex' => null ], $default );

		$this->assertTrue( $noindex->is_robots_noindex );
		$this->assertFalse( $index->is_robots_noindex );
		$this->assertNull( $default->is_robots_noindex );
	}

	/**
	 * Tests that fields absent from the input leave the indexable untouched.
	 *
	 * @covers ::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_ignores_absent_fields() {
		$indexable        = Mockery::mock();
		$indexable->title = 'Untouched';

		$this->instance->apply_to_indexable( [], $indexable );

		$this->assertSame( 'Untouched', $indexable->title );
	}

	/**
	 * Builds an indexable mock populated with representative SEO data.
	 *
	 * @return Mockery\MockInterface The indexable mock.
	 */
	private function make_indexable() {
		$indexable                              = Mockery::mock();
		$indexable->object_id                   = 42;
		$indexable->breadcrumb_title            = 'Hello world';
		$indexable->permalink                   = 'https://example.com/hello-world/';
		$indexable->object_sub_type             = 'post';
		$indexable->post_status                 = 'publish';
		$indexable->title                       = 'My SEO title';
		$indexable->description                 = 'My meta description';
		$indexable->primary_focus_keyword       = 'hello world';
		$indexable->canonical                   = 'https://example.com/canonical/';
		$indexable->is_cornerstone              = true;
		$indexable->is_robots_noindex           = null;
		$indexable->is_robots_nofollow          = false;
		$indexable->is_robots_noimageindex      = false;
		$indexable->is_robots_noarchive         = true;
		$indexable->is_robots_nosnippet         = false;
		$indexable->open_graph_title            = 'OG title';
		$indexable->open_graph_description      = 'OG description';
		$indexable->twitter_title               = 'Twitter title';
		$indexable->twitter_description         = 'Twitter description';
		$indexable->schema_page_type            = 'WebPage';
		$indexable->schema_article_type         = 'BlogPosting';
		$indexable->primary_focus_keyword_score = 78;
		$indexable->readability_score           = 45;
		$indexable->inclusive_language_score    = 0;

		return $indexable;
	}

	/**
	 * Builds a Meta double that returns the given rendered values through its getter.
	 *
	 * The real Meta resolves properties through presenters and rejects writes, so a
	 * lightweight subclass that overrides the getter is used instead of a mock.
	 *
	 * @param array<string, string> $values The rendered values, keyed by Meta property name.
	 *
	 * @return Meta The Meta double.
	 */
	private function make_meta( array $values ): Meta {
		return new class( $values ) extends Meta {

			/**
			 * The canned rendered values, keyed by property name.
			 *
			 * @var array<string, string>
			 */
			private $rendered_values;

			/**
			 * Constructor.
			 *
			 * @param array<string, string> $values The canned rendered values.
			 */
			public function __construct( array $values ) {
				$this->rendered_values = $values;
			}

			/**
			 * Returns the canned rendered value for a property.
			 *
			 * @param string $name The property name.
			 *
			 * @return string|null The canned value, or null when not set.
			 */
			public function __get( $name ) {
				return ( $this->rendered_values[ $name ] ?? null );
			}
		};
	}
}
