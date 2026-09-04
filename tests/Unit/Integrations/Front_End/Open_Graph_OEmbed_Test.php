<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use RuntimeException;
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
final class Open_Graph_OEmbed_Test extends TestCase {

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
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->meta = Mockery::mock( Meta_Surface::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$this->instance = new Open_Graph_OEmbed( $this->meta );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class, Open_Graph_Conditional::class ],
			Open_Graph_OEmbed::get_conditionals(),
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertEquals( $this->meta, $this->getPropertyValue( $this->instance, 'meta' ) );
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Filters\has( 'oembed_response_data', [ $this->instance, 'set_oembed_data' ] ) );
	}

	/**
	 * Tests the addition of the data with no data set.
	 *
	 * @covers ::set_oembed_data
	 * @covers ::set_title
	 * @covers ::set_description
	 * @covers ::set_image
	 *
	 * @dataProvider set_oembed_data
	 *
	 * @param array $expected  The expected value.
	 * @param array $meta_data The meta data to use.
	 *
	 * @return void
	 */
	public function test_set_oembed_data_with_no_data_set( $expected, $meta_data ) {
		$post = (object) [ 'ID' => 1337 ];

		$this->meta
			->expects( 'for_post' )
			->once()
			->with( 1337 )
			->andReturn( (object) $meta_data );

		$this->assertEquals( $expected, $this->instance->set_oembed_data( $expected, $post ) );
	}

	/**
	 * Tests that a recursive invocation of `set_oembed_data()` returns the
	 * unaltered data instead of re-running the meta lookup, and that the outer
	 * call still enriches the result.
	 *
	 * @covers ::set_oembed_data
	 *
	 * @return void
	 */
	public function test_set_oembed_data_bails_on_reentry() {
		$post         = (object) [ 'ID' => 1337 ];
		$inner_data   = [ 'title' => 'core-title' ];
		$inner_result = null;

		// Simulate the recursive path: the meta lookup itself triggers a nested
		// `oembed_response_data` filter callback via `set_oembed_data()`.
		$this->meta
			->expects( 'for_post' )
			->once()
			->with( 1337 )
			->andReturnUsing(
				function () use ( $post, $inner_data, &$inner_result ) {
					$inner_result = $this->instance->set_oembed_data( $inner_data, $post );
					return (object) [
						'open_graph_title'       => 'yoast-title',
						'open_graph_description' => 'yoast-description',
						'open_graph_images'      => [],
					];
				},
			);

		$outer_result = $this->instance->set_oembed_data( [], $post );

		// Inner call: returned unaltered.
		$this->assertSame( $inner_data, $inner_result );
		// Outer call: enriched.
		$this->assertEquals(
			[
				'title'       => 'yoast-title',
				'description' => 'yoast-description',
			],
			$outer_result,
		);
	}

	/**
	 * Tests that the reentrancy flag is reset between calls so subsequent
	 * non-recursive invocations still enrich the response data.
	 *
	 * @covers ::set_oembed_data
	 *
	 * @return void
	 */
	public function test_set_oembed_data_resets_flag_between_calls() {
		$post = (object) [ 'ID' => 1337 ];

		$this->meta
			->expects( 'for_post' )
			->twice()
			->with( 1337 )
			->andReturn(
				(object) [
					'open_graph_title'       => 'title',
					'open_graph_description' => 'description',
					'open_graph_images'      => [],
				],
				(object) [
					'open_graph_title'       => 'title',
					'open_graph_description' => 'description',
					'open_graph_images'      => [],
				],
			);

		$first  = $this->instance->set_oembed_data( [], $post );
		$second = $this->instance->set_oembed_data( [], $post );

		$this->assertEquals(
			[
				'title'       => 'title',
				'description' => 'description',
			],
			$first,
		);
		$this->assertEquals(
			[
				'title'       => 'title',
				'description' => 'description',
			],
			$second,
		);
	}

	/**
	 * Tests that the reentrancy flag is reset after the meta lookup throws,
	 * so a follow-up (non-recursive) call still runs the meta lookup and
	 * returns the enriched data.
	 *
	 * @covers ::set_oembed_data
	 *
	 * @return void
	 */
	public function test_set_oembed_data_resets_flag_after_throw() {
		$post     = (object) [ 'ID' => 1337 ];
		$invoked  = 0;
		$enriched = (object) [
			'open_graph_title'       => 'title',
			'open_graph_description' => 'description',
			'open_graph_images'      => [],
		];

		// First invocation throws, second returns the meta object. Mockery does
		// not have a fluent API for per-call exception returns, so drive it via
		// a counter and `andReturnUsing`.
		$this->meta
			->expects( 'for_post' )
			->twice()
			->with( 1337 )
			->andReturnUsing(
				static function () use ( &$invoked, $enriched ) {
					$invoked++;
					if ( $invoked === 1 ) {
						throw new RuntimeException( 'boom' );
					}
					return $enriched;
				},
			);

		try {
			$this->instance->set_oembed_data( [], $post );
			$this->fail( 'Expected RuntimeException was not thrown.' );
		} catch ( RuntimeException $e ) {
			$this->assertSame( 'boom', $e->getMessage() );
		}

		// The flag must have been reset by the `finally` block, so this call
		// reaches `for_post` and returns the enriched data.
		$this->assertEquals(
			[
				'title'       => 'title',
				'description' => 'description',
			],
			$this->instance->set_oembed_data( [], $post ),
		);
	}

	/**
	 * Returns the data to test with.
	 *
	 * @return array
	 */
	public static function set_oembed_data() {
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
