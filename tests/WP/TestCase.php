<?php

namespace Yoast\WP\SEO\Tests\WP;

use Yoast\WP\SEO\Initializers\Migration_Runner;
use Yoast\WPTestUtils\WPIntegration\TestCase as WPTestUtils_TestCase;

/**
 * TestCase base class for convenience methods.
 */
abstract class TestCase extends WPTestUtils_TestCase {

	/**
	 * Plugin basename for any plugin dependencies the test may have.
	 *
	 * @var string
	 */
	public $prereq_plugin_basename = '';

	/**
	 * Whether the inclusion of a prereq plugin succeeded.
	 *
	 * @var bool
	 */
	protected $prereq_plugin_include_failed = false;

	/**
	 * Make sure to do migrations before WP_UnitTestCase starts messing with the DB.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Run migrations.
		$migration_runner = \YoastSEO()->classes->get( Migration_Runner::class );
		$migration_runner->run_migrations( 'free' );

		$this->activate_prereq_plugin();

		if ( $this->prereq_plugin_include_failed === true ) {
			$this->markTestSkipped(
				"\n" . 'Couldn\'t include the required plugin file(s): ' . $this->prereq_plugin_basename . '. Skipping all tests in class ' . static::class . '.'
			);
		}
	}

	/**
	 * (Re-)Set the base WP environment and de-activate a prereq plugin
	 *
	 * @return void
	 */
	public function tear_down() {
		$this->deactivate_prereq_plugin();
		parent::tear_down();
	}

	/**
	 * Activate one or more plugins, include the base-file(s)
	 *
	 * @return void
	 */
	public function activate_prereq_plugin() {
		static $_plugins_dir;

		$_plugins_dir = dirname( WPSEO_FILE ) . '/vendor/';

		$files = (array) $this->prereq_plugin_basename;
		foreach ( $files as $file ) {
			if ( \is_string( $file ) && $file !== '' ) {
				$file = $_plugins_dir . $file;

				if ( \file_exists( $file ) ) {
					require_once $file;
				}
				else {
					$this->prereq_plugin_include_failed = true;
				}
			}
		}
	}

	/**
	 * Deactivate one or more plugin(s) and reset the related properties
	 *
	 * @return void
	 */
	public function deactivate_prereq_plugin() {
		$this->prereq_plugin_basename       = '';
		$this->prereq_plugin_include_failed = false;
	}
}
