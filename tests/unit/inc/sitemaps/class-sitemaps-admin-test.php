<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc;

use Brain\Monkey;
use Mockery;
use WPSEO_Sitemaps_Admin;
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
	 * @var Mockery\Mock
	 */
	private $mock_post;
	/**
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Options_Double
	 */
	private $options_mock;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public function setUp() {
		$this->instance = Mockery::mock( WPSEO_Sitemaps_Admin::class )->makePartial();

		$this->options_mock = Mockery::mock( 'alias:' . \WPSEO_Options::class )->shouldAllowMockingProtectedMethods();
		$this->options_mock->expects( 'get_instance' )->andReturnNull();

		$this->mock_post               = Mockery::mock( '\WP_Post' )->makePartial();
		$this->mock_post->post_type    = 'post';

		parent::setUp();
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

		$this->options_mock
			->shouldReceive( 'is_multisite' )
			->andReturn( false );

		$this->options_mock
			->shouldReceive( 'get' )
			->once()
			->with( 'noindex-post', false )
			->andReturnFalse();

		Monkey\Functions\expect( 'apply_filters' )
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

		$this->options_mock
			->shouldReceive( 'is_multisite' )
			->andReturn( false );

		$this->options_mock
			->shouldReceive( 'get' )
			->once()
			->with( 'noindex-post', false )
			->andReturnFalse();

		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'wp_schedule_single_event' )
			->once()
			->with( ( time() + 300 ), 'wpseo_ping_search_engines' );

		$this->instance->status_transition( 'publish', 'draft', $this->mock_post );
	}
}
