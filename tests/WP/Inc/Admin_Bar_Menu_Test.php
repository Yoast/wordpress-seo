<?php

namespace Yoast\WP\SEO\Tests\WP\Inc;

use stdClass;
use WP_Admin_Bar;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Admin_Asset_SEO_Location;
use WPSEO_Admin_Bar_Menu;
use WPSEO_Meta;
use WPSEO_Options;
use Yoast\WP\SEO\Tests\WP\Doubles\Inc\Admin_Bar_Menu_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Admin_Bar_Menu_Test extends TestCase {

	/**
	 * WP SEO manager user ID.
	 *
	 * @var int
	 */
	protected static $wpseo_manager;

	/**
	 * Network administrator user ID.
	 *
	 * @var int
	 */
	protected static $network_administrator;

	/**
	 * Methods to mock for a standard Mock WPSEO_Admin_Bar_menu object.
	 *
	 * @var array
	 */
	private $mock_wpseo_admin_bar_menu_methods = [
		'add_root_menu',
		'add_analysis_submenu',
		'add_seo_tools_submenu',
		'add_how_to_submenu',
		'add_get_help_submenu',
		'add_settings_submenu',
		'add_network_settings_submenu',
	];

	/**
	 * Sets up user instances to use in tests.
	 *
	 * @param WP_UnitTest_Factory $factory Unit test factory instance.
	 *
	 * @return void
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		if ( ! \class_exists( WP_Admin_Bar::class ) ) {
			require_once \ABSPATH . \WPINC . '/class-wp-admin-bar.php';
		}

		self::$wpseo_manager = $factory->user->create( [ 'role' => 'editor' ] );
		\get_userdata( self::$wpseo_manager )->add_cap( 'wpseo_manage_options' );

		self::$network_administrator = $factory->user->create( [ 'role' => 'administrator' ] );
		\grant_super_admin( self::$network_administrator );
	}

	/**
	 * Deletes the user instances used in tests.
	 *
	 * @return void
	 */
	public static function wpTearDownAfterClass() {
		\revoke_super_admin( self::$network_administrator );
		self::delete_user( self::$network_administrator );
		self::delete_user( self::$wpseo_manager );
	}

	/**
	 * Tests adding the admin bar menu, lacking general capabilities.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::add_menu
	 *
	 * @return void
	 */
	public function test_add_menu_lacking_capabilities() {
		$admin_bar_menu = $this
			->getMockBuilder( WPSEO_Admin_Bar_Menu::class )
			->setConstructorArgs( [ $this->get_asset_manager() ] )
			->setMethods( $this->mock_wpseo_admin_bar_menu_methods )
			->getMock();

		$admin_bar_menu
			->expects( $this->never() )
			->method( 'add_root_menu' );

		$admin_bar_menu
			->expects( $this->never() )
			->method( 'add_seo_tools_submenu' );

		$admin_bar_menu
			->expects( $this->never() )
			->method( 'add_how_to_submenu' );

		$admin_bar_menu
			->expects( $this->never() )
			->method( 'add_how_to_submenu' );

		$admin_bar_menu
			->expects( $this->never() )
			->method( 'add_get_help_submenu' );

		$admin_bar_menu
			->expects( $this->never() )
			->method( 'add_settings_submenu' );

		$admin_bar_menu
			->expects( $this->never() )
			->method( 'add_network_settings_submenu' );

		$admin_bar_menu->add_menu( new WP_Admin_Bar() );
	}

	/**
	 * Tests adding the admin bar menu.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::add_menu
	 *
	 * @return void
	 */
	public function test_add_menu() {
		\wp_set_current_user( self::$wpseo_manager );

		$wp_admin_bar = new WP_Admin_Bar();

		$admin_bar_menu = $this
			->getMockBuilder( WPSEO_Admin_Bar_Menu::class )
			->setConstructorArgs( [ $this->get_asset_manager() ] )
			->setMethods( $this->mock_wpseo_admin_bar_menu_methods )
			->getMock();

		$admin_bar_menu
			->expects( $this->once() )
			->method( 'add_root_menu' )
			->with( $wp_admin_bar );

		$admin_bar_menu
			->expects( $this->once() )
			->method( 'add_analysis_submenu' )
			->with( $wp_admin_bar );

		$admin_bar_menu
			->expects( $this->once() )
			->method( 'add_seo_tools_submenu' )
			->with( $wp_admin_bar );

		$admin_bar_menu
			->expects( $this->once() )
			->method( 'add_how_to_submenu' )
			->with( $wp_admin_bar );

		$admin_bar_menu
			->expects( $this->once() )
			->method( 'add_get_help_submenu' )
			->with( $wp_admin_bar );

		$admin_bar_menu
			->expects( $this->once() )
			->method( 'add_settings_submenu' )
			->with( $wp_admin_bar );

		$admin_bar_menu
			->expects( $this->never() )
			->method( 'add_network_settings_submenu' );

		$admin_bar_menu->add_menu( $wp_admin_bar );
	}

	/**
	 * Tests enqueuing assets when the admin bar is not shown.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets_without_admin_bar() {
		\add_filter( 'show_admin_bar', '__return_false' );

		$asset_manager = $this->get_asset_manager( [ 'register_assets', 'enqueue_style' ] );

		$asset_manager
			->expects( $this->never() )
			->method( 'register_assets' );

		$asset_manager
			->expects( $this->never() )
			->method( 'enqueue_style' );

		$admin_bar_menu = new WPSEO_Admin_Bar_Menu( $asset_manager );
		$admin_bar_menu->enqueue_assets();
	}

	/**
	 * Tests enqueuing assets.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets() {
		\add_filter( 'show_admin_bar', '__return_true' );
		\wp_set_current_user( self::$wpseo_manager );

		$asset_manager = $this->get_asset_manager( [ 'register_assets', 'enqueue_style' ] );

		$asset_manager
			->expects( $this->once() )
			->method( 'register_assets' );

		$asset_manager
			->expects( $this->once() )
			->method( 'enqueue_style' )
			->with( 'adminbar' );

		$admin_bar_menu = new WPSEO_Admin_Bar_Menu( $asset_manager );
		$admin_bar_menu->enqueue_assets();
	}

	/**
	 * Tests registering main hooks.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$admin_bar_menu = $this->getMockBuilder( WPSEO_Admin_Bar_Menu::class )
			->setConstructorArgs( [ $this->get_asset_manager() ] )
			->setMethods( [ 'meets_requirements' ] )
			->getMock();

		$admin_bar_menu
			->expects( $this->once() )
			->method( 'meets_requirements' )
			->willReturn( true );

		$admin_bar_menu->register_hooks();
		$this->assertIsInt( \has_action( 'admin_bar_menu', [ $admin_bar_menu, 'add_menu' ], 95 ) );
		$this->assertIsInt( \has_action( 'wp_enqueue_scripts', [ $admin_bar_menu, 'enqueue_assets' ] ) );
		$this->assertIsInt( \has_action( 'admin_enqueue_scripts', [ $admin_bar_menu, 'enqueue_assets' ] ) );
	}

	/**
	 * Tests checking requirements.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::meets_requirements
	 *
	 * @return void
	 */
	public function test_meets_requirements() {
		$admin_bar_menu = new WPSEO_Admin_Bar_Menu( $this->get_asset_manager() );

		WPSEO_Options::get_instance();

		\add_filter( 'option_wpseo', [ $this, 'filter_enable_admin_bar_menu_false' ], 9999 );
		\add_filter( 'default_option_wpseo', [ $this, 'filter_enable_admin_bar_menu_false' ], 9999 );
		WPSEO_Options::clear_cache();

		$first_result = $admin_bar_menu->meets_requirements();
		$this->assertFalse( $first_result );

		\add_filter( 'option_wpseo', [ $this, 'filter_enable_admin_bar_menu_true' ], 10000 );
		\add_filter( 'default_option_wpseo', [ $this, 'filter_enable_admin_bar_menu_true' ], 10000 );
		WPSEO_Options::clear_cache();

		$second_result = $admin_bar_menu->meets_requirements();
		$this->assertTrue( $second_result );
	}

	/**
	 * Tests the situation where everything is going well.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::get_post_focus_keyword
	 *
	 * @return void
	 */
	public function test_get_post_focus_keyword() {
		$post = self::factory()->post->create_and_get();

		WPSEO_Meta::set_value( 'focuskw', 'focus keyword', $post->ID );

		$instance = new Admin_Bar_Menu_Double();

		$this->assertEquals( 'focus keyword', $instance->get_post_focus_keyword( $post ) );
	}

	/**
	 * Tests the situation with a non object given as argument.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::get_post_focus_keyword
	 *
	 * @return void
	 */
	public function test_get_post_focus_keyword_with_invalid_object() {
		$instance = new Admin_Bar_Menu_Double();

		$this->assertEquals( '', $instance->get_post_focus_keyword( null ) );
	}

	/**
	 * Tests the situation where the given object doesn't have an ID.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::get_post_focus_keyword
	 *
	 * @return void
	 */
	public function test_get_post_focus_keyword_with_valid_object_but_no_id_property() {
		$post     = new stdClass();
		$instance = new Admin_Bar_Menu_Double();

		$this->assertEquals( '', $instance->get_post_focus_keyword( $post ) );
	}

	/**
	 * Tests the situation where the page analysis is disabled by filter.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::get_post_focus_keyword
	 *
	 * @return void
	 */
	public function test_get_post_focus_keyword_with_page_analysis_filter_disabled() {
		\add_filter( 'wpseo_use_page_analysis', '__return_false' );

		$post     = self::factory()->post->create_and_get();
		$instance = new Admin_Bar_Menu_Double();

		$this->assertEquals( '', $instance->get_post_focus_keyword( $post ) );
	}

	/**
	 * Filters an option so that the sub option 'enable_admin_bar_menu' is true.
	 *
	 * @param array $result Option result.
	 *
	 * @return array Filtered result.
	 */
	public function filter_enable_admin_bar_menu_true( $result ) {
		$result['enable_admin_bar_menu'] = true;

		return $result;
	}

	/**
	 * Filters an option so that the sub option 'enable_admin_bar_menu' is false.
	 *
	 * @param array $result Option result.
	 *
	 * @return array Filtered result.
	 */
	public function filter_enable_admin_bar_menu_false( $result ) {
		$result['enable_admin_bar_menu'] = false;

		return $result;
	}

	/**
	 * Gets an asset manager for test usage.
	 *
	 * @param array $mock_methods Optional. Methods to mock.
	 *
	 * @return WPSEO_Admin_Asset_Manager Asset manager instance.
	 */
	protected function get_asset_manager( array $mock_methods = [] ) {
		if ( empty( $mock_methods ) ) {
			return new WPSEO_Admin_Asset_Manager( new WPSEO_Admin_Asset_SEO_Location( \WP_PLUGIN_DIR . '/wordpress-seo/wp-seo.php' ) );
		}

		return $this
			->getMockBuilder( WPSEO_Admin_Asset_Manager::class )
			->setConstructorArgs( [ new WPSEO_Admin_Asset_SEO_Location( \WP_PLUGIN_DIR . '/wordpress-seo/wp-seo.php' ) ] )
			->setMethods( $mock_methods )
			->getMock();
	}
}
