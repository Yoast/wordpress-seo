<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Validators\Post_SEO_Field_Validator_Interface;
use Yoast\WP\SEO\Conditionals\Woo_SEO_Inactive_Conditional;
use Yoast\WP\SEO\Helpers\Schema\Graph_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;
use Yoast\WP\SEO\Schema\Application\Configuration\Schema_Configuration;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Surfaces\Values\Meta_Double;
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
	 * The main Schema ID of the post, which is the ID of its WebPage piece.
	 *
	 * @var string
	 */
	private const MAIN_SCHEMA_ID = 'https://example.com/hello-world/';

	/**
	 * The meta surface.
	 *
	 * @var Mockery\MockInterface|Meta_Surface
	 */
	private $meta_surface;

	/**
	 * The Yoast WooCommerce SEO inactive conditional.
	 *
	 * @var Mockery\MockInterface|Woo_SEO_Inactive_Conditional
	 */
	private $woo_seo_inactive_conditional;

	/**
	 * The WooCommerce helper.
	 *
	 * @var Mockery\MockInterface|Woocommerce_Helper
	 */
	private $woocommerce_helper;

	/**
	 * The Schema configuration.
	 *
	 * @var Mockery\MockInterface|Schema_Configuration
	 */
	private $schema_configuration;

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

		// The inputs are real booleans, which WordPress returns as is.
		Monkey\Functions\when( 'rest_sanitize_boolean' )->alias( 'boolval' );

		$this->meta_surface                 = Mockery::mock( Meta_Surface::class );
		$this->woo_seo_inactive_conditional = Mockery::mock( Woo_SEO_Inactive_Conditional::class );
		$this->woocommerce_helper           = Mockery::mock( Woocommerce_Helper::class );
		$this->schema_configuration         = Mockery::mock( Schema_Configuration::class );

		// Schema output is on, Yoast WooCommerce SEO is inactive and the post is not the checkout page, unless a test says otherwise.
		$this->schema_configuration->allows( 'is_schema_output_disabled' )->andReturnFalse()->byDefault();
		$this->woo_seo_inactive_conditional->allows( 'is_met' )->andReturnTrue()->byDefault();
		$this->woocommerce_helper->allows( 'get_checkout_page_id' )->andReturn( 99 )->byDefault();

		// The graph helper is pure, so the real one is used to test the post SEO data against real-shaped graphs.
		$this->instance = new Post_SEO_Field_Map(
			$this->meta_surface,
			new Graph_Helper(),
			$this->woo_seo_inactive_conditional,
			$this->woocommerce_helper,
			$this->schema_configuration,
		);
	}

	/**
	 * Tests that to_seo_array maps an indexable to the full output shape,
	 * including the rendered front-end companions.
	 *
	 * @covers ::__construct
	 * @covers ::to_seo_array
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::get_shared_seo_fields
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::rendered
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::rendered_noindex
	 * @covers ::rendered_schema_page_type
	 * @covers ::rendered_schema_article_type
	 *
	 * @return void
	 */
	public function test_to_seo_array() {
		$indexable = $this->make_indexable();

		$this->woo_seo_inactive_conditional->expects( 'is_met' )->once()->andReturnTrue();

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Post_Type' )->andReturn(
			new Meta_Double(
				[
					'title'                  => 'Rendered SEO title',
					'meta_description'       => 'Rendered meta description',
					'canonical'              => 'https://example.com/hello-world/',
					'open_graph_title'       => 'Rendered OG title',
					'open_graph_description' => 'Rendered OG description',
					'twitter_title'          => 'Rendered Twitter title',
					'twitter_description'    => 'Rendered Twitter description',
					// No noindex is stored for the post, so this comes from the post-type default.
					'robots'                 => [
						'index'  => 'noindex',
						'follow' => 'follow',
					],
					'main_schema_id'         => self::MAIN_SCHEMA_ID,
					'schema'                 => $this->make_schema(
						$this->make_webpage_piece( [ 'WebPage' ] ),
						self::make_article_piece( [ 'Article', 'BlogPosting' ] ),
					),
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
				'noindex_rendered'                => true,
				'open_graph_title'                => 'OG title',
				'open_graph_title_rendered'       => 'Rendered OG title',
				'open_graph_description'          => 'OG description',
				'open_graph_description_rendered' => 'Rendered OG description',
				'twitter_title'                   => 'Twitter title',
				'twitter_title_rendered'          => 'Rendered Twitter title',
				'twitter_description'             => 'Twitter description',
				'twitter_description_rendered'    => 'Rendered Twitter description',
				'seo_score'                       => 'good',
				'readability_score'               => 'ok',
				'inclusive_language_score'        => 'na',
				'nofollow'                        => false,
				'noimageindex'                    => false,
				'noarchive'                       => true,
				'nosnippet'                       => false,
				'schema_page_type'                => 'WebPage',
				'schema_page_type_rendered'       => [ 'WebPage' ],
				'schema_article_type'             => 'BlogPosting',
				'schema_article_type_rendered'    => [ 'Article', 'BlogPosting' ],
			],
			$result,
		);
	}

	/**
	 * Tests that the rendered companions are null when no meta is available for the post.
	 *
	 * @covers ::to_seo_array
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::get_shared_seo_fields
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::rendered
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::rendered_noindex
	 * @covers ::rendered_schema_page_type
	 * @covers ::rendered_schema_article_type
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
		$this->assertNull( $result['noindex_rendered'] );
		$this->assertNull( $result['schema_page_type_rendered'] );
		$this->assertNull( $result['schema_article_type_rendered'] );

		// The raw stored values are still mapped from the indexable.
		$this->assertSame( 'My SEO title', $result['seo_title'] );
	}

	/**
	 * Tests that an empty presented value is normalised to null rather than an empty string.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::rendered
	 *
	 * @return void
	 */
	public function test_to_seo_array_empty_rendered_value_is_null() {
		$indexable = $this->make_indexable();

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Post_Type' )->andReturn(
			new Meta_Double(
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
	 * Tests that noindex_rendered reflects the noindex directive of the presented robots value.
	 *
	 * @dataProvider provider_to_seo_array_noindex_rendered
	 *
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::rendered_noindex
	 *
	 * @param array<int|string, string> $robots   The presented robots value.
	 * @param bool                      $expected The expected noindex_rendered value.
	 *
	 * @return void
	 */
	public function test_to_seo_array_noindex_rendered( $robots, $expected ) {
		$indexable = $this->make_indexable();

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Post_Type' )->andReturn(
			new Meta_Double( [ 'robots' => $robots ] ),
		);

		$this->assertSame( $expected, $this->instance->to_seo_array( $indexable )['noindex_rendered'] );
	}

	/**
	 * Data provider for test_to_seo_array_noindex_rendered.
	 *
	 * @return array<string, array<string, array<int|string, string>|bool>>
	 */
	public static function provider_to_seo_array_noindex_rendered() {
		return [
			'noindex' => [
				'robots'   => [
					'index'  => 'noindex',
					'follow' => 'nofollow',
				],
				'expected' => true,
			],
			'index' => [
				'robots'   => [
					'index'  => 'index',
					'follow' => 'follow',
				],
				'expected' => false,
			],
			'noindex added under a numeric key' => [
				'robots'   => [
					'index' => 'index',
					0       => 'noindex',
				],
				'expected' => true,
			],
			'noimageindex is not noindex' => [
				'robots'   => [
					'index'      => 'index',
					'imageindex' => 'noimageindex',
				],
				'expected' => false,
			],
			'robots emptied by the wpseo_robots filter' => [
				'robots'   => [],
				'expected' => false,
			],
		];
	}

	/**
	 * Tests that schema_page_type_rendered lists the types of the WebPage piece, applying the page types Yoast
	 * WooCommerce SEO gives products and the checkout page while it is active.
	 *
	 * @dataProvider provider_to_seo_array_schema_page_type_rendered
	 *
	 * @covers ::rendered_schema_page_type
	 * @covers ::add_woo_seo_page_types
	 *
	 * @param string|array<string>|null $type             The type of the WebPage piece.
	 * @param string                    $post_type        The post type of the post.
	 * @param int                       $post_id          The ID of the post.
	 * @param bool                      $woo_seo_inactive Whether Yoast WooCommerce SEO is inactive.
	 * @param array<string>             $expected         The expected schema_page_type_rendered value.
	 *
	 * @return void
	 */
	public function test_to_seo_array_schema_page_type_rendered( $type, $post_type, $post_id, $woo_seo_inactive, $expected ) {
		$indexable                  = $this->make_indexable();
		$indexable->object_sub_type = $post_type;
		$indexable->object_id       = $post_id;

		$this->expect_meta( $indexable, $this->make_schema( $this->make_webpage_piece( $type ) ) );
		$this->woo_seo_inactive_conditional->expects( 'is_met' )->once()->andReturn( $woo_seo_inactive );

		$this->assertSame( $expected, $this->instance->to_seo_array( $indexable )['schema_page_type_rendered'] );
	}

	/**
	 * Data provider for test_to_seo_array_schema_page_type_rendered.
	 *
	 * @return array<string, array<string, string|array<string>|int|bool|null>>
	 */
	public static function provider_to_seo_array_schema_page_type_rendered() {
		return [
			'post'                                  => [
				'type'             => [ 'WebPage', 'FAQPage' ],
				'post_type'        => 'post',
				'post_id'          => 42,
				'woo_seo_inactive' => false,
				'expected'         => [ 'WebPage', 'FAQPage' ],
			],
			'single type returned by a filter'      => [
				'type'             => 'ContactPage',
				'post_type'        => 'page',
				'post_id'          => 42,
				'woo_seo_inactive' => true,
				'expected'         => [ 'ContactPage' ],
			],
			'product without Woo SEO'               => [
				'type'             => [ 'WebPage' ],
				'post_type'        => 'product',
				'post_id'          => 42,
				'woo_seo_inactive' => true,
				'expected'         => [ 'WebPage' ],
			],
			'product with Woo SEO'                  => [
				'type'             => [ 'WebPage', 'FAQPage' ],
				'post_type'        => 'product',
				'post_id'          => 42,
				'woo_seo_inactive' => false,
				'expected'         => [ 'WebPage', 'FAQPage', 'ItemPage' ],
			],
			'product with Woo SEO and ItemPage set' => [
				'type'             => [ 'WebPage', 'ItemPage' ],
				'post_type'        => 'product',
				'post_id'          => 42,
				'woo_seo_inactive' => false,
				'expected'         => [ 'WebPage', 'ItemPage' ],
			],
			'checkout page without Woo SEO'         => [
				'type'             => [ 'WebPage', 'FAQPage' ],
				'post_type'        => 'page',
				'post_id'          => 99,
				'woo_seo_inactive' => true,
				'expected'         => [ 'WebPage', 'FAQPage' ],
			],
			'checkout page with Woo SEO'            => [
				'type'             => [ 'WebPage', 'FAQPage' ],
				'post_type'        => 'page',
				'post_id'          => 99,
				'woo_seo_inactive' => false,
				'expected'         => [ 'CheckoutPage' ],
			],
			'filter returned no type'               => [
				'type'             => null,
				'post_type'        => 'post',
				'post_id'          => 42,
				'woo_seo_inactive' => true,
				'expected'         => [],
			],
		];
	}

	/**
	 * Tests that schema_page_type_rendered is empty, without ItemPage, when the graph has no WebPage piece.
	 *
	 * @covers ::rendered_schema_page_type
	 *
	 * @return void
	 */
	public function test_to_seo_array_schema_page_type_rendered_without_webpage_piece() {
		$indexable                  = $this->make_indexable();
		$indexable->object_sub_type = 'product';

		$this->expect_meta( $indexable, $this->make_schema() );
		$this->woo_seo_inactive_conditional->expects( 'is_met' )->never();

		$this->assertSame( [], $this->instance->to_seo_array( $indexable )['schema_page_type_rendered'] );
	}

	/**
	 * Tests that schema_article_type_rendered lists the types of the Article piece of the post, or none when there is
	 * no such piece.
	 *
	 * @dataProvider provider_to_seo_array_schema_article_type_rendered
	 *
	 * @covers ::rendered_schema_article_type
	 *
	 * @param array<array<string, string|array<string>>> $pieces   The graph pieces besides the WebPage piece.
	 * @param array<string>                              $expected The expected schema_article_type_rendered value.
	 *
	 * @return void
	 */
	public function test_to_seo_array_schema_article_type_rendered( $pieces, $expected ) {
		$indexable = $this->make_indexable();

		$this->expect_meta( $indexable, $this->make_schema( $this->make_webpage_piece( [ 'WebPage' ] ), ...$pieces ) );

		$this->assertSame( $expected, $this->instance->to_seo_array( $indexable )['schema_article_type_rendered'] );
	}

	/**
	 * Data provider for test_to_seo_array_schema_article_type_rendered.
	 *
	 * @return array<string, array<string, array<array<string, string|array<string>>>|array<string>>>
	 */
	public static function provider_to_seo_array_schema_article_type_rendered() {
		return [
			'Article subtype' => [
				'pieces'   => [ self::make_article_piece( 'NewsArticle' ) ],
				'expected' => [ 'NewsArticle' ],
			],
			'type next to Article' => [
				'pieces'   => [ self::make_article_piece( [ 'Article', 'BlogPosting' ] ) ],
				'expected' => [ 'Article', 'BlogPosting' ],
			],
			'no Article piece' => [
				'pieces'   => [],
				'expected' => [],
			],
		];
	}

	/**
	 * Tests that both rendered schema types are empty, without ItemPage, while Schema output is turned off.
	 *
	 * @covers ::rendered_schema_page_type
	 * @covers ::rendered_schema_article_type
	 * @covers ::get_graph_pieces
	 *
	 * @return void
	 */
	public function test_to_seo_array_schema_types_rendered_schema_disabled() {
		$indexable                  = $this->make_indexable();
		$indexable->object_sub_type = 'product';

		$this->expect_meta(
			$indexable,
			$this->make_schema( $this->make_webpage_piece( [ 'WebPage' ] ), self::make_article_piece( 'Article' ) ),
		);
		$this->schema_configuration->allows( 'is_schema_output_disabled' )->andReturnTrue();
		$this->woo_seo_inactive_conditional->expects( 'is_met' )->never();

		$result = $this->instance->to_seo_array( $indexable );

		$this->assertSame( [], $result['schema_page_type_rendered'] );
		$this->assertSame( [], $result['schema_article_type_rendered'] );
	}

	/**
	 * Tests that indexables_to_arrays primes the post, term and post meta caches once for all posts, the post and post
	 * meta caches once for their featured images and the user caches once for their authors, and maps every indexable
	 * to its SEO data array.
	 *
	 * @covers ::indexables_to_arrays
	 * @covers ::prime_caches
	 *
	 * @return void
	 */
	public function test_indexables_to_arrays_primes_caches_once() {
		$first             = $this->make_indexable();
		$second            = $this->make_indexable();
		$second->object_id = 43;
		$third             = $this->make_indexable();
		$third->object_id  = 44;
		$third->author_id  = 6;

		Monkey\Functions\expect( '_prime_post_caches' )
			->once()
			->with( [ 42, 43, 44 ], true, true );

		Monkey\Functions\expect( 'get_post_thumbnail_id' )->once()->with( 42 )->andReturn( 7 );
		Monkey\Functions\expect( 'get_post_thumbnail_id' )->once()->with( 43 )->andReturnFalse();
		Monkey\Functions\expect( 'get_post_thumbnail_id' )->once()->with( 44 )->andReturn( 8 );

		Monkey\Functions\expect( '_prime_post_caches' )
			->once()
			->with( [ 7, 8 ], false, true );

		Monkey\Functions\expect( 'cache_users' )
			->once()
			->with( [ 5, 5, 6 ] );

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $first, 'Post_Type' )->andReturnFalse();
		$this->meta_surface->expects( 'for_indexable' )->once()->with( $second, 'Post_Type' )->andReturnFalse();
		$this->meta_surface->expects( 'for_indexable' )->once()->with( $third, 'Post_Type' )->andReturnFalse();

		$result = $this->instance->indexables_to_arrays( [ $first, $second, $third ] );

		$this->assertCount( 3, $result );
		$this->assertSame( 42, $result[0]['post_id'] );
		$this->assertSame( 43, $result[1]['post_id'] );
		$this->assertSame( 44, $result[2]['post_id'] );
	}

	/**
	 * Tests that indexables_to_arrays does not prime any featured image cache when no post has a featured image.
	 *
	 * @covers ::indexables_to_arrays
	 * @covers ::prime_caches
	 *
	 * @return void
	 */
	public function test_indexables_to_arrays_without_featured_images() {
		$indexable = $this->make_indexable();

		Monkey\Functions\expect( '_prime_post_caches' )
			->once()
			->with( [ 42 ], true, true );
		Monkey\Functions\expect( 'get_post_thumbnail_id' )->once()->with( 42 )->andReturn( 0 );
		Monkey\Functions\expect( 'cache_users' )->once()->with( [ 5 ] );

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Post_Type' )->andReturnFalse();

		$this->assertCount( 1, $this->instance->indexables_to_arrays( [ $indexable ] ) );
	}

	/**
	 * Tests that indexables_to_arrays does not prime any user cache when no post has an author.
	 *
	 * @covers ::indexables_to_arrays
	 * @covers ::prime_caches
	 *
	 * @return void
	 */
	public function test_indexables_to_arrays_without_authors() {
		$indexable            = $this->make_indexable();
		$indexable->author_id = 0;

		Monkey\Functions\expect( '_prime_post_caches' )
			->once()
			->with( [ 42 ], true, true );
		Monkey\Functions\expect( 'get_post_thumbnail_id' )->once()->with( 42 )->andReturn( 0 );
		Monkey\Functions\expect( 'cache_users' )->never();

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Post_Type' )->andReturnFalse();

		$this->assertCount( 1, $this->instance->indexables_to_arrays( [ $indexable ] ) );
	}

	/**
	 * Tests that indexables_to_arrays only primes the post cache while the Schema output is turned off.
	 *
	 * @covers ::indexables_to_arrays
	 * @covers ::prime_caches
	 *
	 * @return void
	 */
	public function test_indexables_to_arrays_schema_output_disabled() {
		$indexable = $this->make_indexable();

		$this->schema_configuration->allows( 'is_schema_output_disabled' )->andReturnTrue();

		Monkey\Functions\expect( '_prime_post_caches' )
			->once()
			->with( [ 42 ], false, false );
		Monkey\Functions\expect( 'get_post_thumbnail_id' )->never();
		Monkey\Functions\expect( 'cache_users' )->never();

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Post_Type' )->andReturnFalse();

		$this->assertCount( 1, $this->instance->indexables_to_arrays( [ $indexable ] ) );
	}

	/**
	 * Tests that indexables_to_arrays does not prime any cache when there is nothing to map.
	 *
	 * @covers ::indexables_to_arrays
	 *
	 * @return void
	 */
	public function test_indexables_to_arrays_empty() {
		Monkey\Functions\expect( '_prime_post_caches' )->never();
		Monkey\Functions\expect( 'get_post_thumbnail_id' )->never();
		Monkey\Functions\expect( 'cache_users' )->never();

		$this->assertSame( [], $this->instance->indexables_to_arrays( [] ) );
	}

	/**
	 * Tests that string fields are set from their value and cleared to null when emptied.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_string_fields_set_and_clear() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$changed = $this->instance->apply_to_indexable(
			[
				'seo_title'        => 'New title',
				'meta_description' => '',
				'canonical'        => null,
			],
			$indexable,
		);

		$this->assertSame( 'New title', $indexable->title );
		$this->assertNull( $indexable->description );
		$this->assertNull( $indexable->canonical );
		// The order follows the STRING_FIELDS declaration order, not the input order.
		$this->assertSame( [ 'title', 'description', 'canonical' ], $changed );
	}

	/**
	 * Tests that boolean flags are cast and written to their indexable column.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::apply_to_indexable
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
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::apply_to_indexable
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
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::apply_to_indexable
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
	 * Creates a validator mock for the given field.
	 *
	 * @param string $field_name The name of the field the validator validates.
	 *
	 * @return Mockery\MockInterface|Post_SEO_Field_Validator_Interface The validator mock.
	 */
	private function make_validator( string $field_name ) {
		$validator = Mockery::mock( Post_SEO_Field_Validator_Interface::class );
		$validator->allows( 'get_field_name' )->andReturn( $field_name );

		return $validator;
	}

	/**
	 * Tests that only the fields their validator rejects are returned, with the warning of the validator, and that
	 * fields absent from the input are not validated.
	 *
	 * @covers ::__construct
	 * @covers ::get_skipped_fields
	 *
	 * @return void
	 */
	public function test_get_skipped_fields() {
		$indexable = Mockery::mock( Indexable_Mock::class );
		$input     = [
			'post_id'          => 42,
			'seo_title'        => 'A title',
			'schema_page_type' => 'CollectionPage',
		];

		$rejecting_validator = $this->make_validator( 'schema_page_type' );
		$rejecting_validator->expects( 'validate' )->once()->with( 'CollectionPage', $indexable )->andReturn( 'A warning.' );

		$accepting_validator = $this->make_validator( 'seo_title' );
		$accepting_validator->expects( 'validate' )->once()->with( 'A title', $indexable )->andReturnNull();

		$absent_field_validator = $this->make_validator( 'canonical' );
		$absent_field_validator->expects( 'validate' )->never();

		$instance = new Post_SEO_Field_Map( $this->meta_surface, new Graph_Helper(), $this->woo_seo_inactive_conditional, $this->woocommerce_helper, $this->schema_configuration, $rejecting_validator, $accepting_validator, $absent_field_validator );

		$this->assertSame( [ 'schema_page_type' => 'A warning.' ], $instance->get_skipped_fields( $input, $indexable ) );
	}

	/**
	 * Tests that a field that a validator rejected is not validated again by another validator of the same field.
	 *
	 * @covers ::get_skipped_fields
	 *
	 * @return void
	 */
	public function test_get_skipped_fields_first_rejection_wins() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$first_validator = $this->make_validator( 'schema_page_type' );
		$first_validator->expects( 'validate' )->once()->andReturn( 'The first warning.' );

		$second_validator = $this->make_validator( 'schema_page_type' );
		$second_validator->expects( 'validate' )->never();

		$instance = new Post_SEO_Field_Map( $this->meta_surface, new Graph_Helper(), $this->woo_seo_inactive_conditional, $this->woocommerce_helper, $this->schema_configuration, $first_validator, $second_validator );

		$this->assertSame(
			[ 'schema_page_type' => 'The first warning.' ],
			$instance->get_skipped_fields( [ 'schema_page_type' => 'CollectionPage' ], $indexable ),
		);
	}

	/**
	 * Tests that no field is skipped without validators.
	 *
	 * @covers ::get_skipped_fields
	 *
	 * @return void
	 */
	public function test_get_skipped_fields_without_validators() {
		$this->assertSame(
			[],
			$this->instance->get_skipped_fields( [ 'schema_page_type' => 'CollectionPage' ], Mockery::mock( Indexable_Mock::class ) ),
		);
	}

	/**
	 * Builds an indexable mock populated with representative SEO data.
	 *
	 * @return Mockery\MockInterface The indexable mock.
	 */
	private function make_indexable() {
		$indexable                              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id                   = 42;
		$indexable->author_id                   = 5;
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
	 * Expects the meta of the indexable to be requested once, carrying the given schema.
	 *
	 * @param Mockery\MockInterface $indexable The indexable.
	 * @param mixed                 $schema    The schema of the post.
	 *
	 * @return void
	 */
	private function expect_meta( $indexable, $schema ) {
		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Post_Type' )->andReturn(
			new Meta_Double(
				[
					'main_schema_id' => self::MAIN_SCHEMA_ID,
					'schema'         => $schema,
				],
			),
		);
	}

	/**
	 * Builds a schema graph out of the given pieces, next to a piece the post SEO data does not read.
	 *
	 * @param array<string, string|array<string>> ...$pieces The graph pieces.
	 *
	 * @return array<string, string|array<array<string, string|array<string>>>> The schema.
	 */
	private function make_schema( array ...$pieces ) {
		$pieces[] = [
			'@type' => 'Organization',
			'@id'   => 'https://example.com/#organization',
		];

		return [
			'@context' => 'https://schema.org',
			'@graph'   => $pieces,
		];
	}

	/**
	 * Builds the WebPage piece of the post.
	 *
	 * @param string|array<string>|null $type The type of the piece.
	 *
	 * @return array<string, string|array<string>|null> The piece.
	 */
	private function make_webpage_piece( $type ) {
		return [
			'@type' => $type,
			'@id'   => self::MAIN_SCHEMA_ID,
		];
	}

	/**
	 * Builds the Article piece of the post.
	 *
	 * @param string|array<string> $type The type of the piece.
	 *
	 * @return array<string, string|array<string>> The piece.
	 */
	private static function make_article_piece( $type ) {
		return [
			'@type'    => $type,
			'@id'      => self::MAIN_SCHEMA_ID . '#article',
			'isPartOf' => [ '@id' => self::MAIN_SCHEMA_ID ],
		];
	}
}
