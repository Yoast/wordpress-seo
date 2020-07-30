<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Robots_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group robots
 */
class Robots_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper.
	 *
	 * @covers ::generate_robots
	 * @covers ::get_base_robots
	 * @covers ::filter_robots
	 */
	public function test_generate_robots() {
		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'index',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper,
	 * using the wpseo_robots filter, with the filter returning false.
	 *
	 * @covers ::generate_robots
	 * @covers ::get_base_robots
	 * @covers ::filter_robots
	 */
	public function test_generate_robots_with_filter_return_false() {
		Monkey\Filters\expectApplied( 'wpseo_robots' )
			->once()
			->with( 'index, follow', $this->instance )
			->andReturn( false );

		$this->assertEquals( [], $this->instance->generate_robots() );
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper,
	 * using the wpseo_robots filter, with the filter returning duplicate types.
	 *
	 * @covers ::generate_robots
	 * @covers ::get_base_robots
	 * @covers ::filter_robots
	 */
	public function test_generate_robots_with_filter_returning_duplicates() {
		Monkey\Filters\expectApplied( 'wpseo_robots' )
			->once()
			->with( 'index, follow', $this->instance )
			->andReturn( 'index, noindex, follow' );

		$this->assertEquals(
			[
				'index'  => 'noindex',
				'follow' => 'follow',
			],
			$this->instance->generate_robots()
		);
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper,
	 * using the wpseo_robots_array filter.
	 *
	 * @covers ::generate_robots
	 * @covers ::get_base_robots
	 * @covers ::filter_robots
	 */
	public function test_generate_robots_with_array_filter() {
		Monkey\Filters\expectApplied( 'wpseo_robots_array' )
			->once()
			->with(
				[
					'index'  => 'index',
					'follow' => 'follow',
				],
				$this->instance
			)
			->andReturn(
				[
					'index'  => 'noindex',
					'follow' => 'nofollow',
				]
			);

		$this->assertEquals(
			[
				'index'  => 'noindex',
				'follow' => 'nofollow',
			],
			$this->instance->generate_robots()
		);
	}
}
