<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc\Sitemaps;

use Brain\Monkey;
use Mockery;
use WPSEO_Options;
use WPSEO_Sitemaps_Admin;
use Yoast\WP\SEO\Tests\Unit\Doubles\Inc\Options\Options_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group sitemaps
 */
class WPSEO_Sitemaps_Admin_Test extends TestCase {

	/**
	 * Class instance to use for the test.
	 *
	 * @var Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * The mock post to use for the test.
	 *
	 * @var Mockery\Mock
	 */
	protected $mock_post;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance             = new WPSEO_Sitemaps_Admin();
		$this->mock_post            = Mockery::mock( '\WP_Post' )->makePartial();
		$this->mock_post->post_type = 'post';
	}

	/**
	 * Tests the status transition on a development setup.
	 *
	 * @covers WPSEO_Sitemaps_Admin::status_transition
	 */
	public function test_status_transition_on_development() {
		Monkey\Functions\stubs(
			[
				'wp_get_environment_type' => 'development',
			]
		);

		Monkey\Functions\expect( 'get_post_type' )
			->with( $this->mock_post )
			->andReturn( 'post' );

		Monkey\Functions\expect( 'wp_cache_delete' )
			->andReturn( true );

		Monkey\Functions\expect( 'YoastSEO' )
			->once()
			->andReturn( (object) [ 'helpers' => (object) [ 'options' => self::get_options_helper_mock( 1, 0 ) ] ] );

		Monkey\Filters\expectApplied( 'wpseo_allow_xml_sitemap_ping' )
			->never();

		$this->instance->status_transition( 'publish', 'draft', $this->mock_post );
	}

	/**
	 * Tests the status transition on a production setup.
	 *
	 * @covers WPSEO_Sitemaps_Admin::status_transition
	 */
	public function test_status_transition_on_production() {
		Monkey\Functions\stubs(
			[
				'wp_get_environment_type' => 'production',
			]
		);

		Monkey\Functions\expect( 'get_post_type' )
			->with( $this->mock_post )
			->andReturn( 'post' );

		Monkey\Functions\expect( 'wp_cache_delete' )
			->andReturn( true );

		Monkey\Functions\expect( 'YoastSEO' )
			->once()
			->andReturn( (object) [ 'helpers' => (object) [ 'options' => self::get_options_helper_mock( 1, 0 ) ] ] );

		Monkey\Filters\expectApplied( 'wpseo_allow_xml_sitemap_ping' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->once()
			->andReturn( false );

		$start = \time();

		Monkey\Functions\expect( 'wp_schedule_single_event' )
			->once()
			->withArgs(
				static function ( $timestamp, $function_name ) use ( $start ) {
					if ( $function_name === 'wpseo_ping_search_engines' ) {
						return ( $timestamp < $start + 600 );
					}

					return false;
				}
			);

		$this->instance->status_transition( 'publish', 'draft', $this->mock_post );
	}
}
