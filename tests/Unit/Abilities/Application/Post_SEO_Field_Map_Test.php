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
	 * Tests that to_post_seo_data maps an indexable to the full output shape,
	 * including the rendered front-end companions.
	 *
	 * @covers ::__construct
	 * @covers ::to_post_seo_data
	 * @covers ::rendered
	 * @covers ::inclusive_language_rank
	 *
	 * @return void
	 */
	public function test_to_post_seo_data() {
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

		$result = $this->instance->to_post_seo_data( $indexable )->to_array();

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
	 * @covers ::to_post_seo_data
	 * @covers ::rendered
	 *
	 * @return void
	 */
	public function test_to_post_seo_data_without_meta() {
		$indexable = $this->make_indexable();

		$this->meta_surface->expects( 'for_post' )->once()->with( 42 )->andReturnFalse();

		$result = $this->instance->to_post_seo_data( $indexable )->to_array();

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
	public function test_to_post_seo_data_empty_rendered_value_is_null() {
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

		$result = $this->instance->to_post_seo_data( $indexable )->to_array();

		$this->assertNull( $result['meta_description_rendered'] );
	}

	/**
	 * Tests that a simple field is set when given a value and deleted when emptied.
	 *
	 * @covers ::to_meta_operations
	 *
	 * @return void
	 */
	public function test_to_meta_operations_simple_set_and_clear() {
		$current = $this->make_indexable();

		$this->assertSame(
			[
				[
					'key'    => 'title',
					'action' => 'set',
					'value'  => 'New title',
				],
				[
					'key'    => 'metadesc',
					'action' => 'delete',
					'value'  => null,
				],
				[
					'key'    => 'canonical',
					'action' => 'delete',
					'value'  => null,
				],
			],
			$this->instance->to_meta_operations(
				[
					'seo_title'        => 'New title',
					'meta_description' => '',
					'canonical'        => null,
				],
				$current,
			),
		);
	}

	/**
	 * Tests that the cornerstone flag is set or deleted.
	 *
	 * @covers ::to_meta_operations
	 *
	 * @return void
	 */
	public function test_to_meta_operations_cornerstone() {
		$current = $this->make_indexable();

		$this->assertSame(
			[
				[
					'key'    => 'is_cornerstone',
					'action' => 'set',
					'value'  => '1',
				],
			],
			$this->instance->to_meta_operations( [ 'is_cornerstone' => true ], $current ),
		);

		$this->assertSame(
			[
				[
					'key'    => 'is_cornerstone',
					'action' => 'delete',
					'value'  => null,
				],
			],
			$this->instance->to_meta_operations( [ 'is_cornerstone' => false ], $current ),
		);
	}

	/**
	 * Tests the noindex encoding for true, false, and null.
	 *
	 * @covers ::to_meta_operations
	 * @covers ::noindex_operation
	 *
	 * @return void
	 */
	public function test_to_meta_operations_noindex() {
		$current = $this->make_indexable();

		$this->assertSame(
			[
				[
					'key'    => 'meta-robots-noindex',
					'action' => 'set',
					'value'  => 1,
				],
			],
			$this->instance->to_meta_operations( [ 'noindex' => true ], $current ),
		);

		$this->assertSame(
			[
				[
					'key'    => 'meta-robots-noindex',
					'action' => 'set',
					'value'  => 2,
				],
			],
			$this->instance->to_meta_operations( [ 'noindex' => false ], $current ),
		);

		$this->assertSame(
			[
				[
					'key'    => 'meta-robots-noindex',
					'action' => 'delete',
					'value'  => null,
				],
			],
			$this->instance->to_meta_operations( [ 'noindex' => null ], $current ),
		);
	}

	/**
	 * Tests the nofollow encoding for true and false.
	 *
	 * @covers ::to_meta_operations
	 *
	 * @return void
	 */
	public function test_to_meta_operations_nofollow() {
		$current = $this->make_indexable();

		$this->assertSame(
			[
				[
					'key'    => 'meta-robots-nofollow',
					'action' => 'set',
					'value'  => 1,
				],
			],
			$this->instance->to_meta_operations( [ 'nofollow' => true ], $current ),
		);

		$this->assertSame(
			[
				[
					'key'    => 'meta-robots-nofollow',
					'action' => 'delete',
					'value'  => null,
				],
			],
			$this->instance->to_meta_operations( [ 'nofollow' => false ], $current ),
		);
	}

	/**
	 * Tests that advanced robots flags are merged with the current indexable state.
	 *
	 * @covers ::to_meta_operations
	 * @covers ::advanced_robots_operation
	 *
	 * @return void
	 */
	public function test_to_meta_operations_advanced_robots_merges_current() {
		// Current indexable already has noarchive on; patching nosnippet on must preserve noarchive.
		$current                         = $this->make_indexable();
		$current->is_robots_noarchive    = true;
		$current->is_robots_nosnippet    = false;
		$current->is_robots_noimageindex = false;

		$this->assertSame(
			[
				[
					'key'    => 'meta-robots-adv',
					'action' => 'set',
					'value'  => 'noarchive,nosnippet',
				],
			],
			$this->instance->to_meta_operations( [ 'nosnippet' => true ], $current ),
		);
	}

	/**
	 * Tests that advanced robots are deleted when the merged set is empty.
	 *
	 * @covers ::to_meta_operations
	 * @covers ::advanced_robots_operation
	 *
	 * @return void
	 */
	public function test_to_meta_operations_advanced_robots_cleared() {
		$current                         = $this->make_indexable();
		$current->is_robots_noarchive    = false;
		$current->is_robots_nosnippet    = false;
		$current->is_robots_noimageindex = false;

		$this->assertSame(
			[
				[
					'key'    => 'meta-robots-adv',
					'action' => 'delete',
					'value'  => null,
				],
			],
			$this->instance->to_meta_operations( [ 'noarchive' => false ], $current ),
		);
	}

	/**
	 * Tests that fields not present in the input produce no operations.
	 *
	 * @covers ::to_meta_operations
	 *
	 * @return void
	 */
	public function test_to_meta_operations_ignores_absent_fields() {
		$current = $this->make_indexable();

		$this->assertSame( [], $this->instance->to_meta_operations( [], $current ) );
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
