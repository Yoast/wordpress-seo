<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Tracking;

use Brain\Monkey;
use Mockery;
use WPSEO_Options;
use WPSEO_Tracking;
use Yoast\WP\SEO\Analytics\Application\Missing_Indexables_Collector;
use Yoast\WP\SEO\Analytics\Application\To_Be_Cleaned_Indexables_Collector;
use Yoast\WP\SEO\Helpers\Environment_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group tracking
 */
final class Tracking_Test extends TestCase {

	/**
	 * Tests the constructor on a non-production setup.
	 *
	 * @covers WPSEO_Tracking::__construct
	 *
	 * @return void
	 */
	public function test_constructor_empty_if_not_in_production() {
		Monkey\Functions\stubs(
			[
				'wp_get_environment_type' => 'development',
			]
		);

		WPSEO_Options::set( 'tracking', true );

		$environment_helper = Mockery::mock( Environment_Helper::class );
		$environment_helper->expects( 'is_production_mode' )->once()->andReturn( false );

		$container = $this->create_container_with( [ Environment_Helper::class => $environment_helper ] );

		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( (object) [ 'helpers' => $this->create_helper_surface( $container ) ] );

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
	 *
	 * @return void
	 */
	public function test_constructor_not_empty_if_in_production() {
		Monkey\Functions\stubs(
			[
				'wp_get_environment_type' => 'production',
			]
		);
		WPSEO_Options::set( 'tracking', true );

		$environment_helper = Mockery::mock( Environment_Helper::class );
		$environment_helper->expects( 'is_production_mode' )->once()->andReturn( true );

		$container = $this->create_container_with( [ Environment_Helper::class => $environment_helper ] );

		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( (object) [ 'helpers' => $this->create_helper_surface( $container ) ] );

		$instance = new WPSEO_Tracking( 'https://tracking.yoast.com/stats', ( \WEEK_IN_SECONDS * 2 ) );

		$this->assertEquals( ( \WEEK_IN_SECONDS * 2 ), $this->getPropertyValue( $instance, 'threshold' ) );
		$this->assertEquals( 'https://tracking.yoast.com/stats', $this->getPropertyValue( $instance, 'endpoint' ) );
		$this->assertEquals( \time(), $this->getPropertyValue( $instance, 'current_time' ) );

		WPSEO_Options::clear_cache();
	}

	/**
	 * Tests get_collector method.
	 *
	 * @covers WPSEO_Tracking::get_collector
	 *
	 * @return void
	 */
	public function test_get_collector() {

		$container = $this->create_container_with(
			[
				Missing_Indexables_Collector::class       => Mockery::mock( Missing_Indexables_Collector::class ),
				To_Be_Cleaned_Indexables_Collector::class => Mockery::mock( To_Be_Cleaned_Indexables_Collector::class ),
			]
		);

		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( (object) [ 'classes' => $this->create_classes_surface( $container ) ] );

		$instance = new WPSEO_Tracking( 'https://tracking.yoast.com/stats', ( \WEEK_IN_SECONDS * 2 ) );
		$result   = $instance->get_collector();
	}
}
