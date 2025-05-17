<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Import;

use Brain\Monkey;
use WPSEO_Import_Settings;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests WPSEO_Import_Settings class.
 *
 * @coversDefaultClass WPSEO_Import_Settings
 */
final class Import_Settings_Test extends TestCase {

	/**
	 * Holds the test instance.
	 *
	 * @var WPSEO_Import_Settings
	 */
	private $instance;

	/**
	 * Set up test class.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new WPSEO_Import_Settings();
	}

	/**
	 * Test the import function.
	 *
	 * @covers ::import
	 *
	 * @return void
	 */
	public function test_import() {
		Monkey\Functions\expect( 'check_admin_referer' )
			->with( 'wpseo-import-settings' )
			->andReturn( true );

		Monkey\Functions\expect( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		Monkey\Functions\expect( '__' )
			->twice()
			->andReturn( 'Test string' );

		$_POST['settings_import'] = 'this-is-a-test';

		$this->instance->import();
	}

	/**
	 * Test the import function when the user does not have capabilities.
	 *
	 * @covers ::import
	 *
	 * @return void
	 */
	public function test_import_no_capability() {
		Monkey\Functions\expect( 'check_admin_referer' )
			->with( 'wpseo-import-settings' )
			->andReturn( true );

		Monkey\Functions\expect( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturn( false );

		Monkey\Functions\expect( '__' )
			->never();

		$this->instance->import();
	}

	/**
	 * Test the import function when post variable is not set.
	 *
	 * @covers ::import
	 *
	 * @return void
	 */
	public function test_import_post_null() {
		Monkey\Functions\expect( 'check_admin_referer' )
			->with( 'wpseo-import-settings' )
			->andReturn( true );

		Monkey\Functions\expect( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		Monkey\Functions\expect( '__' )
			->never();

		$_POST['settings_import'] = null;

		$this->instance->import();
	}

	/**
	 * Test the import function when post variable is emtpy string.
	 *
	 * @covers ::import
	 *
	 * @return void
	 */
	public function test_import_post_empty() {
		Monkey\Functions\expect( 'check_admin_referer' )
			->with( 'wpseo-import-settings' )
			->andReturn( true );

		Monkey\Functions\expect( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		Monkey\Functions\expect( '__' )
			->never();

		$_POST['settings_import'] = '';

		$this->instance->import();
	}
}
