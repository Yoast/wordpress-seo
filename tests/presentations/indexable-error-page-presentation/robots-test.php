<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Error_Page_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Robots_Test.
 *
 * @group presentations
 * @group robots
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Error_Page_Presentation
 */
class Robots_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();

		$this->robots_helper
			->expects( 'get_base_values' )
			->once()
			->andReturn( [
				'index'  => 'index',
				'follow' => 'follow',
			] );

		$this->robots_helper
			->expects( 'after_generate' )
			->once()
			->andReturnUsing( function ( $robots ) {
				return array_filter( $robots );
			} );
	}

	/**
	 * Tests that the robots is set to no index.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_dont_index() {
		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}
}
