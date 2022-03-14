<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Addon_Installation;

use Brain\Monkey;
use Mockery;
use WP_Error;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Actions\Addon_Installation\Addon_Activate_Action;
use Yoast\WP\SEO\Exceptions\Addon_Installation\Addon_Activation_Error_Exception;
use Yoast\WP\SEO\Exceptions\Addon_Installation\User_Cannot_Activate_Plugins_Exception;
use Yoast\WP\SEO\Helpers\Require_File_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Addon_Activate_Action_Test
 *
 * @covers \Yoast\WP\SEO\Actions\Addon_Installation\Addon_Activate_Action
 */
class Addon_Activate_Action_Test extends TestCase {

	/**
	 * The wpseo addon manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Addon_Manager
	 */
	protected $wpseo_addon_manager;

	/**
	 * The instance to test.
	 *
	 * @var Addon_Activate_Action
	 */
	protected $instance;

	/**
	 * The require file helper.
	 *
	 * @var Mockery\MockInterface|Require_File_Helper
	 */
	protected $require_file_helper;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->wpseo_addon_manager = Mockery::mock( WPSEO_Addon_Manager::class );
		$this->require_file_helper = Mockery::mock( Require_File_Helper::class );
		$this->instance            = new Addon_Activate_Action( $this->wpseo_addon_manager, $this->require_file_helper );
	}

	/**
	 * Tests if the user as addon activation permissions.
	 */
	public function test_activate_addon_user_has_no_activate_permissions() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'activate_plugins' )
			->andReturn( false );

		$this->expectException( User_Cannot_Activate_Plugins_Exception::class );

		$this->instance->activate_addon( 'plugin_slug' );
	}

	/**
	 * Tests if an activated addon can be activated "again".
	 */
	public function test_activate_addon_is_already_activated() {

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'activate_plugins' )
			->andReturn( true );

		$this->wpseo_addon_manager
			->shouldReceive( 'is_installed' )
			->once()
			->with( 'plugin_slug' )
			->andReturn( true );

		$actual = $this->instance->activate_addon( 'plugin_slug' );

		$this->assertTrue( $actual );
	}

	/**
	 * Tests if an exception is thrown on activation error.
	 */
	public function test_activate_addon_activation_when_activation_fails() {

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'activate_plugins' )
			->andReturn( true );

		$this->wpseo_addon_manager
			->shouldReceive( 'is_installed' )
			->once()
			->with( 'plugin_slug' )
			->andReturn( false );

		$this->require_file_helper
			->expects( 'require_file_once' )
			->once()
			->with( \ABSPATH . 'wp-admin/includes/plugin.php' );

		$this->wpseo_addon_manager
			->shouldReceive( 'get_plugin_file' )
			->once()
			->with( 'plugin_slug' )
			->andReturn( 'plugin_file' );

		$wp_error = Mockery::mock( WP_Error::class );

		$wp_error
			->expects( 'get_error_message' )
			->once()
			->andReturn( '' );

		Monkey\Functions\expect( 'activate_plugin' )
			->once()
			->with( 'plugin_file' )
			->andReturn( $wp_error );

		$this->expectException( Addon_Activation_Error_Exception::class );

		$this->instance->activate_addon( 'plugin_slug' );
	}

	/**
	 * Tests the addon activation happy path.
	 */
	public function test_activate_addon() {

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'activate_plugins' )
			->andReturn( true );

		$this->wpseo_addon_manager
			->shouldReceive( 'is_installed' )
			->once()
			->with( 'plugin_slug' )
			->andReturn( false );

		$this->require_file_helper
			->expects( 'require_file_once' )
			->once()
			->with( \ABSPATH . 'wp-admin/includes/plugin.php' );

		$this->wpseo_addon_manager
			->shouldReceive( 'get_plugin_file' )
			->once()
			->with( 'plugin_slug' )
			->andReturn( 'plugin_file' );

		Monkey\Functions\expect( 'activate_plugin' )
			->once()
			->with( 'plugin_file' )
			->andReturn( true );

			$actual = $this->instance->activate_addon( 'plugin_slug' );

			$this->assertTrue( $actual );
	}
}
