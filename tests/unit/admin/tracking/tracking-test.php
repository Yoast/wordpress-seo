<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Tracking;

use WPSEO_Options;
use WPSEO_Tracking;
use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group tracking
 */
class WPSEO_Tracking_Test extends TestCase {

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();
	}

	/**
	 * Tests the constructor on a non-production setup.
	 *
	 * @covers WPSEO_Tracking::__construct
	 */
	public function test_constructor_empty_if_not_in_production() {
		Monkey\Functions\stubs(
			[
				'wp_get_environment_type' => 'development',
			]
		);

		WPSEO_Options::set( 'tracking', true );

		$instance = new WPSEO_Tracking( 'https://tracking.yoast.com/stats', ( \WEEK_IN_SECONDS * 2 ) );

		$this->assertAttributeEquals( 0, 'threshold', $instance );
		$this->assertAttributeEquals( '', 'endpoint', $instance );
		$this->assertAttributeEquals( null, 'current_time', $instance );

		WPSEO_Options::clear_cache();
	}

	/**
	 * Tests the constructor on a non-production setup.
	 *
	 * @covers WPSEO_Tracking::__construct
	 */
	public function test_constructor_not_empty_if_in_production() {
		Monkey\Functions\stubs(
			[
				'wp_get_environment_type' => 'production',
			]
		);
		WPSEO_Options::set( 'tracking', true );

		$instance = new WPSEO_Tracking( 'https://tracking.yoast.com/stats', ( \WEEK_IN_SECONDS * 2 ) );

		$this->assertAttributeEquals( ( \WEEK_IN_SECONDS * 2 ), 'threshold', $instance );
		$this->assertAttributeEquals( 'https://tracking.yoast.com/stats', 'endpoint', $instance );
		$this->assertAttributeEquals( \time(), 'current_time', $instance );

		WPSEO_Options::clear_cache();
	}
}
