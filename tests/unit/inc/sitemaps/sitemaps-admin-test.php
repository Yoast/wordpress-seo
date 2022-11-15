<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc\Sitemaps;

use Brain\Monkey;
use Mockery;
use WP_Post;
use WPSEO_Options;
use WPSEO_Sitemaps_Admin;
use Yoast\WP\SEO\Helpers\Environment_Helper;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;
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
	private $mock_post;

	/**
	 * The options mock to use for the test.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Options_Double
	 */
	private $options_mock;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance             = new WPSEO_Sitemaps_Admin();
		$this->options_mock         = Mockery::mock( WPSEO_Options::class )->shouldAllowMockingProtectedMethods();
		$this->mock_post            = Mockery::mock( WP_Post::class )->makePartial();
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

		$this->options_mock
			->shouldReceive( 'is_multisite' )
			->andReturn( false );

		Monkey\Filters\expectApplied( 'wpseo_allow_xml_sitemap_ping' )
			->never();

		$environment_helper = Mockery::mock( Environment_Helper::class );
		$environment_helper->expects( 'is_production_mode' )->once()->andReturn( false );

		$helper_surface              = Mockery::mock( Helpers_Surface::class );
		$helper_surface->environment = $environment_helper;

		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( (object) [ 'helpers' => $helper_surface ] );

		$this->instance->status_transition( 'publish', 'draft', $this->mock_post );
	}

	/**
	 * Tests the status transition on a production setup.
	 *
	 * @covers WPSEO_Sitemaps_Admin::status_transition
	 */
	public function test_status_transition_on_production() {
		global $wp_rewrite;

		$wp_rewrite = Mockery::mock();
		$wp_rewrite->expects( 'using_index_permalinks' )->andReturnFalse();

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

		Monkey\Filters\expectApplied( 'wpseo_allow_xml_sitemap_ping' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'home_url' )
			->once()
			->andReturn( 'https://example.com' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->andReturn( 'https' );

		Monkey\Functions\expect( 'wp_remote_get' );

		$environment_helper = Mockery::mock( Environment_Helper::class );
		$environment_helper->expects( 'is_production_mode' )->once()->andReturn( true );

		$helper_surface              = Mockery::mock( Helpers_Surface::class );
		$helper_surface->environment = $environment_helper;

		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( (object) [ 'helpers' => $helper_surface ] );

		$this->instance->status_transition( 'publish', 'draft', $this->mock_post );
	}
}
