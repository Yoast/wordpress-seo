<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Open_Graph_Conditional;
use Yoast\WP\SEO\Integrations\Front_End\Open_Graph_OEmbed;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_OEmbed_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Open_Graph_OEmbed
 *
 * @group integrations
 * @group front-end
 */
class Open_Graph_OEmbed_Test extends TestCase {

	/**
	 * The meta surface.
	 *
	 * @var Mockery\MockInterface|Meta_Surface
	 */
	protected $meta;

	/**
	 * The instance to test against.
	 *
	 * @var Open_Graph_OEmbed
	 */
	protected $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	public function setUp() {
		parent::setUp();

		$this->meta = Mockery::mock( Meta_Surface::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$this->instance = new Open_Graph_OEmbed( $this->meta );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class, Open_Graph_Conditional::class ],
			Open_Graph_OEmbed::get_conditionals()
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeEquals( $this->meta, 'meta', $this->instance );
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertTrue( Monkey\Filters\has( 'oembed_response_data', [ $this->instance, 'set_oembed_data' ] ) );
	}

	/**
	 * Tests the addition of the data with no data set.
	 *
	 * @covers ::set_oembed_data
	 * @covers ::set_title
	 * @covers ::set_description
	 * @covers ::set_image
	 *
	 * @param array $expected  The expected value.
	 * @param array $meta_data The meta data to use.
	 *
	 * @dataProvider set_oembed_data
	 */
	public function test_set_oembed_data_with_no_data_set( $expected, $meta_data ) {
		$post = (object) [ 'ID' => 1337 ];

		$this->meta
			->expects( 'for_post' )
			->times( 3 )
			->with( 1337 )
			->andReturn( (object) $meta_data );

		$this->assertEquals( $expected, $this->instance->set_oembed_data( $expected, $post ) );
	}

	/**
	 * Returns the data to test with.
	 */
	public function set_oembed_data() {
		return [
			'with-no-data-set'            => [
				'expected'  => [],
				'meta_data' => [
					'open_graph_title'       => '',
					'open_graph_description' => '',
					'open_graph_images'      => [],
				],
			],
			'with-data-set-except-images' => [
				'expected'  => [
					'title'       => 'title',
					'description' => 'description',
				],
				'meta_data' => [
					'open_graph_title'       => 'title',
					'open_graph_description' => 'description',
					'open_graph_images'      => [],
				],
			],
			'with-image-without-url-set'  => [
				'expected'  => [],
				'meta_data' => [
					'open_graph_title'       => '',
					'open_graph_description' => '',
					'open_graph_images'      => [
						[
							'image' => 'image.jpeg',
						],
					],
				],
			],
			'with-image-url-set'          => [
				'expected'  => [
					'thumbnail_url'    => 'image.jpeg',
					'thumbnail_width'  => 500,
					'thumbnail_height' => 500,
				],
				'meta_data' => [
					'open_graph_title'       => '',
					'open_graph_description' => '',
					'open_graph_images'      => [
						[
							'url'    => 'image.jpeg',
							'width'  => 500,
							'height' => 500,
						],
					],
				],
			],
		];
	}
}
