<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Robots_Txt_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Front_End\Robots_Txt_Integration;
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

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Robots_Txt_Integration( $this->options_helper );
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
	 * @dataProvider sitemap_provider
	 *
	 * @covers ::filter_robots
	 * @covers ::change_default_robots
	 * @covers ::add_xml_sitemap
	 *
	 * @param string $sitemap  The initial sitemap.
	 * @param string $expected The expected output/sitemap.
	 */
	public function test_public_site_with_sitemaps( $sitemap, $expected ) {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'enable_xml_sitemap', false )
			->andReturnTrue();

		Mockery::mock( 'overload:WPSEO_Sitemaps_Router' )
			->expects( 'get_base_url' )
			->once()
			->with( 'sitemap_index.xml' )
			->andReturn( 'https://example.com/sitemap_index.xml' );

		$this->assertEquals(
			$expected,
			$this->instance->filter_robots( $sitemap, '1' )
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
	 *
	 * @param array  $multisite The multisite data.
	 * @param string $expected  The expected output/sitemap.
	 */
	public function test_multisite_sitemaps( $multisite, $expected ) {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'enable_xml_sitemap', false )
			->andReturnTrue();

		Mockery::mock( 'overload:WPSEO_Sitemaps_Router' )
			->expects( 'get_base_url' )
			->once()
			->with( 'sitemap_index.xml' )
			->andReturn( 'https://example.com/sitemap_index.xml' );

		Monkey\Functions\when( 'is_multisite' )->justReturn( $multisite['is_subdirectory'] );
		Monkey\Functions\when( 'is_subdomain_install' )->justReturn( false );
		Monkey\Functions\when( 'get_current_network_id' )->justReturn( 1 );
		Monkey\Functions\when( 'get_home_url' )->justReturn( $multisite['site'] );
		Monkey\Functions\expect( 'get_sites' )->andReturn( [ 1 ] );

		$this->assertEquals(
			$expected,
			$this->instance->filter_robots( $multisite['sitemap'], '1' )
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

		$this->assertEquals( 'Input', $this->instance->filter_robots( 'Input', '1' ) );
	}

	/**
	 * Tests the robots filter for a non-public site.
	 *
	 * @covers ::filter_robots
	 */
	public function test_nonpublic_site() {
		$this->assertEquals( 'Input', $this->instance->filter_robots( 'Input', '0' ) );
	}

	/**
	 * Provides the test with sitemap data.
	 *
	 * @return array The sitemaps to test.
	 */
	public function sitemap_provider() {
		return [
			'Default output is filtered' => [
				'sitemap'  => "User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n",
				'expected' => "User-agent: *\nDisallow:\n\nSitemap: https://example.com/sitemap_index.xml\n",
			],
			'Without any sitemap' => [
				'sitemap'  => "Input\n",
				'expected' => "Input\n\nSitemap: https://example.com/sitemap_index.xml\n",
			],
			'With another sitemap' => [
				'sitemap'  => "Input\n\nSitemap: https://example.com/other_sitemap.xml\n",
				'expected' => "Input\n\nSitemap: https://example.com/other_sitemap.xml\n\nSitemap: https://example.com/sitemap_index.xml\n",
			],
			'With our sitemap (do not add our sitemap twice)' => [
				'sitemap'  => "Input\n\nSitemap: https://example.com/sitemap_index.xml\n",
				'expected' => "Input\n\nSitemap: https://example.com/sitemap_index.xml\n",
			],
			'With another and our sitemap (do not add our sitemap twice)' => [
				'sitemap'  => "Input\n\nSitemap: https://example.com/sitemap_index.xml\n\n\nSitemap: https://example.com/other_sitemap.xml\n",
				'expected' => "Input\n\nSitemap: https://example.com/sitemap_index.xml\n\n\nSitemap: https://example.com/other_sitemap.xml\n",
			],
		];
	}

	/**
	 * Provides the test with multisite data.
	 *
	 * @return array The multisite to test.
	 */
	public function multisite_provider() {
		return [
			'Multisite subdomain' => [
				'data'     => [
					'is_subdirectory' => false,
					'sitemap'         => "Input\n",
					'site'            => '',
				],
				'expected' => "Input\n\nSitemap: https://example.com/sitemap_index.xml\n",
			],
			'Multisite subdirectory' => [
				'data'     => [
					'is_subdirectory' => true,
					'sitemap'         => "Input\n",
					'site'            => 'https://example.com/test/sitemap_index.xml',
				],
				'expected' => "Input\n\nSitemap: https://example.com/sitemap_index.xml\n\nSitemap: https://example.com/test/sitemap_index.xml\n",
			],
			'Multisite subdirectory exclude duplicates' => [
				'data'     => [
					'is_subdirectory' => true,
					'sitemap'         => "Input\n",
					'site'            => 'https://example.com/sitemap_index.xml',
				],
				'expected' => "Input\n\nSitemap: https://example.com/sitemap_index.xml\n\n",
			],
		];
	}
}
