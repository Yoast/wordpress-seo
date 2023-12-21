<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Importing;

use Brain\Monkey;
use Yoast\WP\SEO\Services\Importing\Conflicting_Plugins_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Conflicting_Plugins_Service_Test.
 *
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Importing\Conflicting_Plugins_Service
 */
final class Conflicting_Plugins_Service_Test extends TestCase {

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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
		Monkey\Functions\expect( 'sanitize_text_field' )
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

	/**
	 * Test the ignore_deactivating_plugin when GET variables are not set correctly.
	 *
	 * @dataProvider detect_deactivating_conflicting_plugins_dataprovider
	 *
	 * @covers ::ignore_deactivating_plugin
	 *
	 * @param mixed $action   The value of $_GET['action'].
	 * @param mixed $plugin   The value of $_GET['plugin'].
	 * @param array $expected The expected return value of detect_conflicting_plugins.
	 *
	 * @return void
	 */
	public function test_detect_deactivating_conflicting_plugins_plugin_is_int( $action, $plugin, $expected ) {
		Monkey\Functions\expect( 'get_option' )
			->with( 'active_plugins' )
			->once()
			->andReturn(
				[
					'xml-sitemaps/xml-sitemaps.php',
					'not-conflicting/plugin.php',
				]
			);

		$_GET['action'] = $action;
		$_GET['plugin'] = $plugin;

		$result = $this->conflicting_plugins_service->detect_conflicting_plugins();

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Data provider for test_detect_deactivating_conflicting_plugins_plugin_is_int.
	 *
	 * @return array[] Data to use for test_detect_deactivating_conflicting_plugins_plugin_is_int.
	 */
	public static function detect_deactivating_conflicting_plugins_dataprovider() {
		$action_is_null       = [
			'action'   => null,
			'plugin'   => 'xml-sitemaps/xml-sitemaps.php',
			'expected' => [ 'xml-sitemaps/xml-sitemaps.php' ],
		];
		$action_is_not_string = [
			'action'   => 13,
			'plugin'   => 'xml-sitemaps/xml-sitemaps.php',
			'expected' => [ 'xml-sitemaps/xml-sitemaps.php' ],
		];
		$plugin_is_null       = [
			'action'   => 'deactivate',
			'plugin'   => null,
			'expected' => [ 'xml-sitemaps/xml-sitemaps.php' ],
		];
		$plugin_is_not_string = [
			'action'   => 'deactivate',
			'plugin'   => 13,
			'expected' => [ 'xml-sitemaps/xml-sitemaps.php' ],
		];
		return [
			'Action is null'       => $action_is_null,
			'Action is not string' => $action_is_not_string,
			'Plugin is null'       => $plugin_is_null,
			'Plugin is not string' => $plugin_is_not_string,
		];
	}
}
