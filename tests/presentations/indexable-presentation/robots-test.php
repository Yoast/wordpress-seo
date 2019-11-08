<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Robots_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
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
	 */
	public function test_generate_robots() {
		$this->robots_helper
			->expects( 'get_base_values' )
			->andReturn( [
				'index' => 'index',
				'follow' => 'follow',
			] );

		$this->robots_helper
			->expects( 'after_generate' )
			->with( [
				'index' => 'index',
				'follow' => 'follow',
			] )
			->andReturnUsing( function ( $robots ) {
				$robots['index'] = 'noindex';

				return $robots;
			} );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index' => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $actual, $expected );
	}
}
