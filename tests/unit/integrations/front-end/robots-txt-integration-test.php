<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Robots_Txt_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Robots_Txt_Helper;
use Yoast\WP\SEO\Integrations\Front_End\Robots_Txt_Integration;
use Yoast\WP\SEO\Presenters\Robots_Txt_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Robots_Txt_Integration class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Robots_Txt_Integration
 *
 * @group integrations
 * @group front-end
 */
class Robots_Txt_Integration_Test extends TestCase {

	/**
	 * Holds the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Holds the robots txt helper.
	 *
	 * @var Mockery\MockInterface|Robots_Txt_Helper
	 */
	protected $robots_txt_helper;

	/**
	 * Represents the instance to test.
	 *
	 * @var Robots_Txt_Integration
	 */
	protected $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();

		$this->options_helper    = Mockery::mock( Options_Helper::class );
		$this->robots_txt_helper = Mockery::mock( Robots_Txt_Helper::class );
		$this->instance          = new Robots_Txt_Integration( $this->options_helper, $this->robots_txt_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf( Robots_Txt_Integration::class, $this->instance );
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			Robots_Txt_Helper::class,
			$this->getPropertyValue( $this->instance, 'robots_txt_helper' )
		);
		$this->assertInstanceOf(
			Robots_Txt_Presenter::class,
			$this->getPropertyValue( $this->instance, 'robots_txt_presenter' )
		);
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Robots_Txt_Conditional::class ],
			Robots_Txt_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_filter( 'robots_txt', [ $this->instance, 'filter_robots' ] ) );
	}

	/**
	 * Tests the robots filter for a public site, with sitemaps.
	 *
	 * @covers ::filter_robots
	 * @covers ::change_default_robots
	 * @covers ::add_xml_sitemap
	 */
	public function test_public_site_with_sitemaps() {
		global $wp_rewrite;

		$wp_rewrite = Mockery::mock();
		$wp_rewrite->expects( 'using_index_permalinks' )->andReturnFalse();

		Monkey\Functions\expect( 'home_url' )
			->once()
			->andReturn( 'https://example.com/sitemap_index.xml' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->andReturn( 'https' );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'enable_xml_sitemap', false )
			->andReturnTrue();

		$this->robots_txt_helper
			->expects( 'add_sitemap' )
			->with( 'https://example.com/sitemap_index.xml' )
			->once()
			->andReturn();

		$this->robots_txt_helper
			->expects( 'get_robots_txt_user_agents' )
			->andReturn( [] );

		$this->robots_txt_helper
			->expects( 'get_sitemap_rules' )
			->andReturn( [ 'http://basic.wordpress.test/sitemap_index.xml' ] );

		$this->assertSame(
			'# START YOAST INTERNAL SEARCH BLOCK
# ---------------------------
User-agent: *
Disallow:

Sitemap: http://basic.wordpress.test/sitemap_index.xml
# ---------------------------
# END YOAST INTERNAL SEARCH BLOCK',
			$this->instance->filter_robots( '' )
		);
	}

	/**
	 * Tests the robots filter for multisite installations.
	 *
	 * @dataProvider multisite_provider
	 *
	 * @covers ::filter_robots
	 * @covers ::change_default_robots
	 * @covers ::add_xml_sitemap
	 * @covers ::add_subdirectory_multisite_xml_sitemaps
	 * @covers ::get_xml_sitemaps_enabled
	 * @covers ::is_sitemap_allowed
	 * @covers ::get_blog_ids
	 * @covers ::is_sitemap_enabled_for
	 * @covers ::is_yoast_active_on
	 * @covers ::is_yoast_active_for_network
	 *
	 * @param array $multisite The multisite data.
	 */
	public function test_multisite_sitemaps( $multisite ) {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'enable_xml_sitemap', false )
			->andReturnTrue();

		global $wp_rewrite;

		$wp_rewrite = Mockery::mock();
		$wp_rewrite->expects( 'using_index_permalinks' )->andReturnFalse();

		Monkey\Functions\expect( 'home_url' )
			->once()
			->andReturn( 'https://example.com/sitemap_index.xml' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->andReturn( 'https' );

		$this->robots_txt_helper
			->expects( 'add_sitemap' )
			->with( 'https://example.com/sitemap_index.xml' )
			->once()
			->andReturn();

		Monkey\Functions\when( 'is_multisite' )->justReturn( true );
		Monkey\Functions\when( 'is_subdomain_install' )->justReturn( ! $multisite['is_subdirectory'] );
		Monkey\Functions\when( 'get_current_network_id' )->justReturn( 1 );
		Monkey\Functions\when( 'is_plugin_active_for_network' )->justReturn( true );
		Monkey\Functions\expect( 'get_sites' )->andReturn( \array_keys( $multisite['sites'] ) );
		Monkey\Functions\when( 'get_network_option' )->justReturn(
			[
				'allow_enable_xml_sitemap' => true,
				'wordpress-seo/wp-seo.php' => true,
			]
		);

		foreach ( $multisite['sites'] as $blog_id => $site ) {
			Monkey\Functions\when( 'get_blog_option' )
				->justReturn( [ 'enable_xml_sitemap' => $site ] );
			Monkey\Functions\expect( 'get_home_url' )
				->atMost()
				->times( 1 )
				->with( $blog_id, 'sitemap_index.xml' )
				->andReturn( $site . 'sitemap_index.xml' );
			if ( $multisite['is_subdirectory'] && ! in_array( false, $multisite['sites'], true ) ) {
				$this->robots_txt_helper
					->expects( 'add_sitemap' )
					->with( $site . 'sitemap_index.xml' )
					->andReturn();
			}
		}

		$this->robots_txt_helper
			->expects( 'get_robots_txt_user_agents' )
			->andReturn( [] );

		$this->robots_txt_helper
			->expects( 'get_sitemap_rules' )
			->andReturn( [ 'http://basic.wordpress.test/sitemap_index.xml' ] );

		$this->assertSame(
			'# START YOAST INTERNAL SEARCH BLOCK
# ---------------------------
User-agent: *
Disallow:

Sitemap: http://basic.wordpress.test/sitemap_index.xml
# ---------------------------
# END YOAST INTERNAL SEARCH BLOCK',
			$this->instance->filter_robots( '' )
		);
	}

	/**
	 * Tests the robots filter for multisite installations, other site without Yoast SEO activated.
	 *
	 * @covers ::filter_robots
	 * @covers ::change_default_robots
	 * @covers ::add_xml_sitemap
	 * @covers ::add_subdirectory_multisite_xml_sitemaps
	 * @covers ::get_xml_sitemaps_enabled
	 * @covers ::is_sitemap_allowed
	 * @covers ::get_blog_ids
	 * @covers ::is_sitemap_enabled_for
	 * @covers ::is_yoast_active_on
	 * @covers ::is_yoast_active_for_network
	 */
	public function test_multisite_sitemaps_without_yoast_seo_active() {
		global $wp_rewrite;

		$wp_rewrite = Mockery::mock();
		$wp_rewrite->expects( 'using_index_permalinks' )->andReturnFalse();

		Monkey\Functions\expect( 'home_url' )
			->once()
			->andReturn( 'https://example.com/sitemap_index.xml' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->andReturn( 'https' );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'enable_xml_sitemap', false )
			->andReturnTrue();

		$this->robots_txt_helper
			->expects( 'add_sitemap' )
			->with( 'https://example.com/sitemap_index.xml' )
			->twice()
			->andReturn();

		Monkey\Functions\when( 'is_multisite' )->justReturn( true );
		Monkey\Functions\when( 'is_subdomain_install' )->justReturn( false );
		Monkey\Functions\when( 'get_current_network_id' )->justReturn( 1 );
		Monkey\Functions\when( 'get_network_option' )->justReturn(
			[
				'allow_enable_xml_sitemap' => true,
			]
		);
		Monkey\Functions\expect( 'get_sites' )->andReturn( [ 1, 2 ] );
		Monkey\Functions\expect( 'get_home_url' )
			->once()
			->with( 1, 'sitemap_index.xml' )
			->andReturn( 'https://example.com/sitemap_index.xml' );
		Monkey\Functions\expect( 'get_blog_option' )
			->once()
			->with( 1, 'active_plugins', [] )
			->andReturn( [ 'wordpress-seo/wp-seo.php' ] );
		Monkey\Functions\expect( 'get_blog_option' )
			->once()
			->with( 2, 'active_plugins', [] )
			->andReturn( [] );

		$this->robots_txt_helper
			->expects( 'get_robots_txt_user_agents' )
			->andReturn( [] );

		$this->robots_txt_helper
			->expects( 'get_sitemap_rules' )
			->andReturn( [ 'http://basic.wordpress.test/sitemap_index.xml' ] );

		$this->assertSame(
			'# START YOAST INTERNAL SEARCH BLOCK
# ---------------------------
User-agent: *
Disallow:

Sitemap: http://basic.wordpress.test/sitemap_index.xml
# ---------------------------
# END YOAST INTERNAL SEARCH BLOCK',
			$this->instance->filter_robots( '' )
		);
	}

	/**
	 * Tests the robots filter for a multisite subdirectory installation without any existing option rows.
	 *
	 * @covers ::filter_robots
	 * @covers ::change_default_robots
	 * @covers ::add_xml_sitemap
	 * @covers ::add_subdirectory_multisite_xml_sitemaps
	 * @covers ::get_xml_sitemaps_enabled
	 * @covers ::is_sitemap_allowed
	 * @covers ::get_blog_ids
	 * @covers ::is_sitemap_enabled_for
	 * @covers ::is_yoast_active_on
	 * @covers ::is_yoast_active_for_network
	 */
	public function test_multisite_sitemaps_option_not_found() {
		global $wp_rewrite;

		$wp_rewrite = Mockery::mock();
		$wp_rewrite->expects( 'using_index_permalinks' )->andReturnFalse();

		Monkey\Functions\expect( 'home_url' )
			->once()
			->andReturn( 'https://example.com/sitemap_index.xml' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->andReturn( 'https' );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'enable_xml_sitemap', false )
			->andReturnTrue();

		$this->robots_txt_helper
			->expects( 'add_sitemap' )
			->with( 'https://example.com/sitemap_index.xml' )
			->twice()
			->andReturn();

		$this->robots_txt_helper
			->expects( 'add_sitemap' )
			->with( 'https://example.com/site2/sitemap_index.xml' )
			->once()
			->andReturn();

		Monkey\Functions\when( 'is_multisite' )->justReturn( true );
		Monkey\Functions\when( 'is_subdomain_install' )->justReturn( false );
		Monkey\Functions\when( 'get_current_network_id' )->justReturn( 1 );
		Monkey\Functions\when( 'get_blog_option' )->justReturn( false );
		Monkey\Functions\when( 'get_network_option' )->justReturn( [ 'wordpress-seo/wp-seo.php' => true ] );
		Monkey\Functions\expect( 'get_sites' )->andReturn( [ 1, 2 ] );
		Monkey\Functions\expect( 'get_home_url' )
			->once()
			->with( 1, 'sitemap_index.xml' )
			->andReturn( 'https://example.com/sitemap_index.xml' );
		Monkey\Functions\expect( 'get_home_url' )
			->once()
			->with( 2, 'sitemap_index.xml' )
			->andReturn( 'https://example.com/site2/sitemap_index.xml' );

		$this->robots_txt_helper
			->expects( 'get_robots_txt_user_agents' )
			->andReturn( [] );

		$this->robots_txt_helper
			->expects( 'get_sitemap_rules' )
			->andReturn( [ 'http://basic.wordpress.test/sitemap_index.xml' ] );

		$this->assertSame(
			'# START YOAST INTERNAL SEARCH BLOCK
# ---------------------------
User-agent: *
Disallow:

Sitemap: http://basic.wordpress.test/sitemap_index.xml
# ---------------------------
# END YOAST INTERNAL SEARCH BLOCK',
			$this->instance->filter_robots( '' )
		);
	}

	/**
	 * Tests the robots filter for a public site, without sitemaps.
	 *
	 * @covers ::filter_robots
	 * @covers ::change_default_robots
	 * @covers ::add_xml_sitemap
	 */
	public function test_public_site_without_sitemaps() {
		$this->options_helper
			->expects( 'get' )
			->with( 'enable_xml_sitemap', false )
			->once()
			->andReturnFalse();

		$this->robots_txt_helper
			->expects( 'get_robots_txt_user_agents' )
			->andReturn( [] );

		$this->robots_txt_helper
			->expects( 'get_sitemap_rules' )
			->andReturn( [] );

		$this->assertSame(
			'# START YOAST INTERNAL SEARCH BLOCK
# ---------------------------
User-agent: *
Disallow:

# ---------------------------
# END YOAST INTERNAL SEARCH BLOCK',
			$this->instance->filter_robots( '' )
		);
	}

	/**
	 * Provides the test with multisite data.
	 *
	 * @return array The multisite to test.
	 */
	public function multisite_provider() {
		return [
			'Multisite subdomain' => [
				'data' => [
					'is_subdirectory' => false,
					'sitemap'         => "Input\n",
					'sites'           => [
						1 => 'https://example.com/',
					],
				],
			],
			'Multisite subdirectory' => [
				'data' => [
					'is_subdirectory' => true,
					'sitemap'         => "Input\n",
					'sites'           => [
						1 => 'https://example.com/',
						2 => 'https://example.com/test/',
					],
				],
			],
			'Multisite subdirectory with only 1 active' => [
				'data' => [
					'is_subdirectory' => true,
					'sitemap'         => "Input\n",
					'sites'           => [
						1 => 'https://example.com/',
						2 => false,
					],
				],
			],
		];
	}
}
