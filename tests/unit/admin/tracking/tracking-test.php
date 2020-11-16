<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Tracking;

use Brain\Monkey;
use WPSEO_Options;
use WPSEO_Tracking;
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
	protected function set_up() {
		parent::set_up();
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

		$this->assertEquals( 0, $this->getPropertyValue( $instance, 'threshold' ) );
		$this->assertEquals( '', $this->getPropertyValue( $instance, 'endpoint' ) );
		$this->assertEquals( null, $this->getPropertyValue( $instance, 'current_time' ) );

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

		$this->assertEquals( ( \WEEK_IN_SECONDS * 2 ), $this->getPropertyValue( $instance, 'threshold' ) );
		$this->assertEquals( 'https://tracking.yoast.com/stats', $this->getPropertyValue( $instance, 'endpoint' ) );
		$this->assertEquals( \time(), $this->getPropertyValue( $instance, 'current_time' ) );

		WPSEO_Options::clear_cache();
	}
}
