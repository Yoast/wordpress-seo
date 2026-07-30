<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Map;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Surfaces\Values\Meta;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Post_SEO_Field_Map class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Map
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

		$this->stubTranslationFunctions();

		// The editable-fields and article-type enums are built from documented filters; return the defaults unfiltered.
		Monkey\Functions\when( 'apply_filters' )->returnArg( 2 );

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
	 *
	 * @return void
	 */
	public function test_to_seo_array() {
		$indexable = $this->make_indexable();

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Post_Type' )->andReturn(
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

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Post_Type' )->andReturnFalse();

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

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Post_Type' )->andReturn(
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
	 * Tests that indexables_to_arrays primes the post cache once for all posts and
	 * maps every indexable to its SEO data array.
	 *
	 * @covers ::indexables_to_arrays
	 *
	 * @return void
	 */
	public function test_indexables_to_arrays_primes_post_caches_once() {
		$first             = $this->make_indexable();
		$second            = $this->make_indexable();
		$second->object_id = 43;

		Monkey\Functions\expect( '_prime_post_caches' )
			->once()
			->with( [ 42, 43 ], false, false );

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $first, 'Post_Type' )->andReturnFalse();
		$this->meta_surface->expects( 'for_indexable' )->once()->with( $second, 'Post_Type' )->andReturnFalse();

		$result = $this->instance->indexables_to_arrays( [ $first, $second ] );

		$this->assertCount( 2, $result );
		$this->assertSame( 42, $result[0]['post_id'] );
		$this->assertSame( 43, $result[1]['post_id'] );
	}

	/**
	 * Tests that indexables_to_arrays does not prime the post cache when there is nothing to map.
	 *
	 * @covers ::indexables_to_arrays
	 *
	 * @return void
	 */
	public function test_indexables_to_arrays_empty() {
		Monkey\Functions\expect( '_prime_post_caches' )->never();

		$this->assertSame( [], $this->instance->indexables_to_arrays( [] ) );
	}

	/**
	 * Tests that string fields are set from their value and cleared to null when emptied.
	 *
	 * @covers ::apply_to_indexable
	 * @covers ::get_editable_string_fields
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_string_fields_set_and_clear() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$changed = $this->instance->apply_to_indexable(
			[
				'canonical'           => 'https://example.com/canonical/',
				'schema_page_type'    => '',
				'schema_article_type' => null,
			],
			$indexable,
		);

		$this->assertSame( 'https://example.com/canonical/', $indexable->canonical );
		$this->assertNull( $indexable->schema_page_type );
		$this->assertNull( $indexable->schema_article_type );
		// The order follows the field declaration order, not the input order.
		$this->assertSame( [ 'canonical', 'schema_page_type', 'schema_article_type' ], $changed );
	}

	/**
	 * Tests that string fields outside the default editable set are not applied.
	 *
	 * The title, description, Open Graph, and Twitter fields are only editable when a
	 * plugin (Premium) adds them through the editable-fields filter, and the focus
	 * keyphrase is not editable at all.
	 *
	 * @covers ::apply_to_indexable
	 * @covers ::get_editable_string_fields
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_ignores_non_default_string_fields() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$changed = $this->instance->apply_to_indexable(
			[
				'seo_title'              => 'New title',
				'meta_description'       => 'New description',
				'focus_keyphrase'        => 'a phrase',
				'open_graph_title'       => 'New OG title',
				'open_graph_description' => 'New OG description',
				'twitter_title'          => 'New Twitter title',
				'twitter_description'    => 'New Twitter description',
			],
			$indexable,
		);

		$this->assertSame( [], $changed );
	}

	/**
	 * Tests the default editable string field definitions: each maps to its indexable
	 * column and carries the input-schema fragment the ability exposes.
	 *
	 * @covers ::get_editable_string_fields
	 * @covers ::nullable_enum_schema
	 * @covers ::get_schema_article_types
	 *
	 * @return void
	 */
	public function test_get_editable_string_fields_defaults() {
		$fields = $this->instance->get_editable_string_fields();

		$this->assertSame( [ 'canonical', 'schema_page_type', 'schema_article_type' ], \array_keys( $fields ) );
		$this->assertSame( 'canonical', $fields['canonical']['column'] );
		$this->assertSame( [ 'type' => [ 'string', 'null' ] ], $fields['canonical']['schema'] );
		$this->assertSame( 'schema_page_type', $fields['schema_page_type']['column'] );
		$this->assertSame(
			\array_merge( \array_keys( Schema_Types::PAGE_TYPES ), [ '', null ] ),
			$fields['schema_page_type']['schema']['enum'],
		);
		$this->assertSame( 'schema_article_type', $fields['schema_article_type']['column'] );
		$this->assertSame(
			\array_merge( \array_keys( Schema_Types::ARTICLE_TYPES ), [ '', null ] ),
			$fields['schema_article_type']['schema']['enum'],
		);
	}

	/**
	 * Tests that a string field added through the editable-fields filter is applied to
	 * the indexable like a default field.
	 *
	 * This is the extension point Premium uses to make its fields editable.
	 *
	 * @covers ::apply_to_indexable
	 * @covers ::get_editable_string_fields
	 * @covers ::is_valid_string_field
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_applies_filtered_fields() {
		Monkey\Functions\when( 'apply_filters' )->alias(
			static function ( $hook_name, $value ) {
				if ( $hook_name === 'wpseo_editable_post_seo_data_string_fields' ) {
					$value['seo_title'] = [
						'column' => 'title',
						'schema' => [ 'type' => [ 'string', 'null' ] ],
					];
				}

				return $value;
			},
		);

		$indexable = Mockery::mock( Indexable_Mock::class );

		$changed = $this->instance->apply_to_indexable( [ 'seo_title' => 'New title' ], $indexable );

		$this->assertSame( 'New title', $indexable->title );
		$this->assertSame( [ 'title' ], $changed );
	}

	/**
	 * Tests that malformed or reserved filtered field definitions are discarded.
	 *
	 * @covers ::get_editable_string_fields
	 * @covers ::is_valid_string_field
	 *
	 * @return void
	 */
	public function test_get_editable_string_fields_discards_invalid_definitions() {
		$hijack_definition = [
			'column' => 'title',
			'schema' => [ 'type' => [ 'string', 'null' ] ],
		];
		$invalid_fields    = [
			'no_column'    => [ 'schema' => [ 'type' => [ 'string', 'null' ] ] ],
			'no_schema'    => [ 'column' => 'title' ],
			'empty_column' => [
				'column' => '',
				'schema' => [ 'type' => [ 'string', 'null' ] ],
			],
			'not_an_array' => 'title',
			// Reserved input fields cannot be hijacked into string writes.
			'post_id'      => $hijack_definition,
			'noindex'      => $hijack_definition,
			'nofollow'     => $hijack_definition,
		];

		Monkey\Functions\when( 'apply_filters' )->alias(
			static function ( $hook_name, $value ) use ( $invalid_fields ) {
				if ( $hook_name === 'wpseo_editable_post_seo_data_string_fields' ) {
					return \array_merge( $value, $invalid_fields );
				}

				return $value;
			},
		);

		$this->assertSame(
			[ 'canonical', 'schema_page_type', 'schema_article_type' ],
			\array_keys( $this->instance->get_editable_string_fields() ),
		);
	}

	/**
	 * Tests that the default definitions are kept when the filter does not return an array.
	 *
	 * @covers ::get_editable_string_fields
	 *
	 * @return void
	 */
	public function test_get_editable_string_fields_falls_back_on_broken_filter() {
		Monkey\Functions\when( 'apply_filters' )->alias(
			static function ( $hook_name, $value ) {
				if ( $hook_name === 'wpseo_editable_post_seo_data_string_fields' ) {
					return null;
				}

				return $value;
			},
		);

		$this->assertSame(
			[ 'canonical', 'schema_page_type', 'schema_article_type' ],
			\array_keys( $this->instance->get_editable_string_fields() ),
		);
	}

	/**
	 * Tests that boolean flags are cast and written to their indexable column.
	 *
	 * @covers ::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_boolean_flags() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$changed = $this->instance->apply_to_indexable(
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

		// The field map reports the raw indexable columns it touched; collapsing the advanced-robots
		// flags into a shared post meta key is the helper's concern, not the field map's.
		$this->assertSame(
			[ 'is_cornerstone', 'is_robots_nofollow', 'is_robots_noimageindex', 'is_robots_noarchive', 'is_robots_nosnippet' ],
			$changed,
		);
	}

	/**
	 * Tests the tri-state noindex mapping: true and false set a boolean, null resets to the default.
	 *
	 * @covers ::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_noindex() {
		$noindex = Mockery::mock( Indexable_Mock::class );
		$index   = Mockery::mock( Indexable_Mock::class );
		$default = Mockery::mock( Indexable_Mock::class );

		$changed_noindex = $this->instance->apply_to_indexable( [ 'noindex' => true ], $noindex );
		$this->instance->apply_to_indexable( [ 'noindex' => false ], $index );
		$this->instance->apply_to_indexable( [ 'noindex' => null ], $default );

		$this->assertTrue( $noindex->is_robots_noindex );
		$this->assertFalse( $index->is_robots_noindex );
		$this->assertNull( $default->is_robots_noindex );
		$this->assertSame( [ 'is_robots_noindex' ], $changed_noindex );
	}

	/**
	 * Tests that fields absent from the input leave the indexable untouched.
	 *
	 * @covers ::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_ignores_absent_fields() {
		$indexable        = Mockery::mock( Indexable_Mock::class );
		$indexable->title = 'Untouched';

		$changed = $this->instance->apply_to_indexable( [], $indexable );

		$this->assertSame( 'Untouched', $indexable->title );
		$this->assertSame( [], $changed );
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
