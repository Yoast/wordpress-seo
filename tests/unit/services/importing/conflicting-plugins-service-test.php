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

	public function set_up()
	{
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
			->with('active_plugins')
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
	public function test_detect_deactivating_conflicting_plugins() {
		// Arrange.
		Monkey\Functions\expect( 'get_option' )
			->with('active_plugins')
			->once()
			->andReturn( [ 'a', 'b', 'c' ] );
		Monkey\Functions\expect( 'filter_input' )
			->with('action')
			->once()
			->andReturn('deactivate');
		Monkey\Functions\expect('filter_input')
			->with('plugin')
			->once()
			->andReturn('a');


		=>>>>> Patchwork\Exceptions\NotUserDefined : Please include {"redefinable-internals": ["filter_input"]} in your patchwork.json.
		// Act.
		$result = $this->conflicting_plugins_service->detect_conflicting_plugins();

		// Assert.
		$this->assertEquals( [], $result );
	}


	/*
	 * public function detect_conflicting_plugins() {
		$all_active_plugins = $this->get_active_plugins();

		// Search for active plugins.
		return $this->get_active_conflicting_plugins( $all_active_plugins );
	}

	public function deactivate_conflicting_plugins( $plugins = false ) {
		// If no plugins are specified, deactivate any known conflicting plugins that are active.
		if ( ! $plugins ) {
			$plugins = $this->detect_conflicting_plugins();
		}

		// In case of a single plugin, wrap it in an array.
		if ( \is_string( $plugins ) ) {
			$plugins = [ $plugins ];
		}

		if ( ! is_array( $plugins ) ) {
			return;
		}

		// Deactivate all specified plugins across the network, while retaining their deactivation hook
		\deactivate_plugins( $plugins, false, true );
	}

	protected function get_active_conflicting_plugins( $all_active_plugins ) {
		$active_conflicting_plugins = [];

		foreach ( $this->conflicting_plugins as $plugin ) {
			if ( \in_array( $plugin, $all_active_plugins, true ) ) {

				if ( ! \in_array( $plugin, $active_conflicting_plugins, true ) ) {
					$active_conflicting_plugins[] = $plugin;
				}
			}
		}

		return $active_conflicting_plugins;
	}

	protected function get_active_plugins() {
		// request a list of active plugins from WordPress.
		$all_active_plugins = \get_option('active_plugins');

		return $this->ignore_deactivating_plugin( $all_active_plugins );
	}

	protected function ignore_deactivating_plugin( $all_active_plugins ) {
		if ( \filter_input( INPUT_GET, 'action' ) === 'deactivate' ) {
			$deactivated_plugin = \filter_input( INPUT_GET, 'plugin' );
			$key_to_remove      = \array_search( $deactivated_plugin, $all_active_plugins, true );

			if ( $key_to_remove ) {
				\unset( $all_active_plugins[ $key_to_remove ] );
			}
		}

		return $all_active_plugins;
	}
	 */
}
