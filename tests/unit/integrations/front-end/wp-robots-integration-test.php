<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\WP_Robots_Conditional;
use Yoast\WP\SEO\Integrations\Front_End\WP_Robots_Integration;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class WP_Robots_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\WP_Robots_Integration
 *
 * @group integrations
 * @group front-end
 */
class WP_Robots_Integration_Test extends TestCase {

	/**
	 * Represents the meta tags context memoizer.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Memoizer
	 */
	protected $context_memoizer;

	/**
	 * Represents the instance to test.
	 *
	 * @var WP_Robots_Integration
	 */
	protected $instance;

	/**
	 * Method that runs before each test case.
	 */
	protected function set_up() {
		parent::set_up();

		$this->context_memoizer = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		$this->instance         = new WP_Robots_Integration( $this->context_memoizer );
	}

	/**
	 * Tests if the dependencies are set correct.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		static::assertInstanceOf(
			Meta_Tags_Context_Memoizer::class,
			static::getPropertyValue( $this->instance, 'context_memoizer' )
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		static::assertNotFalse( has_filter( 'wp_robots', [ $this->instance, 'add_robots' ] ) );
	}

	/**
	 * Tests the retrieval of the current conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals(
			[
				Front_End_Conditional::class,
				WP_Robots_Conditional::class,
			],
			WP_Robots_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the add robots with having the robots input value being a string.
	 *
	 * @covers ::add_robots
	 * @covers ::get_robots_value
	 */
	public function test_add_robots_string_given() {
		$context = (object) [
			'presentation' => (object) [
				'robots' => [
					'index'  => 'index',
					'follow' => 'follow',
				],
			],
		];

		Monkey\Functions\expect( 'wp_reset_query' )->once();

		$this->context_memoizer
			->expects( 'for_current_page' )
			->once()
			->andReturn( $context );

		static::assertEquals(
			[
				'index'  => true,
				'follow' => true,
			],
			$this->instance->add_robots( 'robots_string' )
		);
	}

	/**
	 * Tests the add robots with having the robots input being overwritten by our data.
	 *
	 * @covers ::add_robots
	 * @covers ::get_robots_value
	 * @covers ::format_robots
	 * @covers ::filter_robots_no_index
	 */
	public function test_add_robots() {
		$context = (object) [
			'presentation' => (object) [
				'robots' => [
					'index'             => 'index',
					'follow'            => 'follow',
					'max-image-preview' => 'max-image-preview:large',
					'imageindex'        => 'noimageindex',
				],
			],
		];

		Monkey\Functions\expect( 'wp_reset_query' )->once();

		$this->context_memoizer
			->expects( 'for_current_page' )
			->once()
			->andReturn( $context );

		static::assertEquals(
			[
				'follow'            => true,
				'index'             => true,
				'noimageindex'      => true,
				'max-image-preview' => 'large',
			],
			$this->instance->add_robots(
				[
					'index'  => true,
					'follow' => true,
				]
			)
		);
	}

	/**
	 * Tests the add robots with having the robots input being overwritten by our data.
	 *
	 * @covers ::add_robots
	 * @covers ::get_robots_value
	 * @covers ::format_robots
	 * @covers ::filter_robots_no_index
	 */
	public function test_add_robots_with_noindex_set() {
		$context = (object) [
			'presentation' => (object) [
				'robots' => [
					'index'             => 'noindex',
					'follow'            => 'follow',
					'max-image-preview' => 'max-image-preview:large',
					'imageindex'        => 'noimageindex',
				],
			],
		];

		Monkey\Functions\expect( 'wp_reset_query' )->once();

		$this->context_memoizer
			->expects( 'for_current_page' )
			->once()
			->andReturn( $context );

		static::assertEquals(
			[
				'follow'  => true,
				'noindex' => true,
			],
			$this->instance->add_robots(
				[
					'index'  => true,
					'follow' => true,
				]
			)
		);
	}
}
