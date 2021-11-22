<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Importing;

use Brain\Monkey;
use Yoast\WP\SEO\Services\Importing\Conflicting_Plugins_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Importable_Detector_Test.
 *
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Importing\Conflicting_Plugins_Service
 */
class Conflicting_Plugins_Service_Test extends TestCase {

	/**
	 * The class under test.
	 *
	 * @var Conflicting_Plugins_Service
	 */
	protected $conflicting_plugins_service;

	/**
	 * {@inheritDoc}
	 */
	public function set_up() {
		$this->conflicting_plugins_service = new Conflicting_Plugins_Service();
	}

	/**
	 * Test the detect_conflicting_plugins method
	 *
	 * @covers ::detect_conflicting_plugins
	 * @covers ::get_active_plugins
	 * @covers ::ignore_deactivating_plugin
	 */
	public function test_detect_no_conflicting_plugins() {
		// Arrange.
		Monkey\Functions\expect( 'get_option' )
			->with( 'active_plugins' )
			->once()
			->andReturn( [ 'a', 'b', 'c' ] );

		// Act.
		$result = $this->conflicting_plugins_service->detect_conflicting_plugins();

		// Assert.
		$this->assertEquals( [], $result );
	}

	/**
	 * Test the detect_conflicting_plugins method
	 *
	 * @covers ::detect_conflicting_plugins
	 * @covers ::get_active_plugins
	 * @covers ::ignore_deactivating_plugin
	 */
	public function test_detect_conflicting_plugins() {
		// Arrange.
		Monkey\Functions\expect( 'get_option' )
			->with( 'active_plugins' )
			->once()
			->andReturn(
				[
					'xml-sitemaps/xml-sitemaps.php',
					'not-conflicting/plugin.php',
				]
			);

		// Act.
		$result = $this->conflicting_plugins_service->detect_conflicting_plugins();

		// Assert.
		$this->assertEquals( [ 'xml-sitemaps/xml-sitemaps.php' ], $result );
	}

	/**
	 * Test the detect_conflicting_plugins method
	 *
	 * @covers ::detect_conflicting_plugins
	 * @covers ::get_active_plugins
	 * @covers ::ignore_deactivating_plugin
	 */
	public function test_detect_deactivating_conflicting_plugins() {
		// Arrange.
		Monkey\Functions\expect( 'get_option' )
			->with( 'active_plugins' )
			->once()
			->andReturn(
				[
					'xml-sitemaps/xml-sitemaps.php',
					'not-conflicting/plugin.php',
				]
			);
		Monkey\Functions\expect( 'wp_unslash' )
			->andReturnFirstArg();
		Monkey\Functions\expect( 'check_admin_referer' )
			->with( 'deactivate-plugin_xml-sitemaps/xml-sitemaps.php' )
			->once();

		$_GET['action'] = 'deactivate';
		$_GET['plugin'] = 'xml-sitemaps/xml-sitemaps.php';

		// Act.
		$result = $this->conflicting_plugins_service->detect_conflicting_plugins();

		// Assert.
		$this->assertEquals( [], $result );
	}
}
