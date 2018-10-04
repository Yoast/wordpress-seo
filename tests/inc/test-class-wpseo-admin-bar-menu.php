<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc
 */

/**
 * Unit Test Class.
 */
class WPSEO_Admin_Bar_Menu_Test extends WPSEO_UnitTestCase {

	/** @var int WP SEO manager user ID. */
	protected static $wpseo_manager;

	/** @var int Network administrator user ID. */
	protected static $network_administrator;

	/**
	 * Sets up user instances to use in tests.
	 *
	 * @param WP_UnitTest_Factory $factory Unit test factory instance.
	 *
	 * @return void
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		if ( ! class_exists( 'WP_Admin_Bar' ) ) {
			require_once ABSPATH . WPINC . '/class-wp-admin-bar.php';
		}

		self::$wpseo_manager = $factory->user->create( array( 'role' => 'editor' ) );
		get_userdata( self::$wpseo_manager )->add_cap( 'wpseo_manage_options' );

		self::$network_administrator = $factory->user->create( array( 'role' => 'administrator' ) );
		grant_super_admin( self::$network_administrator );
	}

	/**
	 * Deletes the user instances used in tests.
	 *
	 * @return void
	 */
	public static function wpTearDownAfterClass() {
		revoke_super_admin( self::$network_administrator );
		self::delete_user( self::$network_administrator );
		self::delete_user( self::$wpseo_manager );
	}

	/**
	 * Tests adding the admin bar menu, lacking general capabilities.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::add_menu()
	 */
	public function test_add_menu_lacking_capabilities() {
		$admin_bar_menu = $this
			->getMockBuilder( 'WPSEO_Admin_Bar_Menu' )
			->setConstructorArgs( array( $this->get_asset_manager() ) )
			->setMethods( array(
				'add_root_menu',
				'add_keyword_research_submenu',
				'add_analysis_submenu',
				'add_settings_submenu',
				'add_network_settings_submenu',
			) )
			->getMock();

		$admin_bar_menu
			->expects( $this->never() )
			->method( 'add_root_menu' );

		$admin_bar_menu
			->expects( $this->never() )
			->method( 'add_keyword_research_submenu' );

		$admin_bar_menu
			->expects( $this->never() )
			->method( 'add_analysis_submenu' );

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
	 * @covers WPSEO_Admin_Bar_Menu::add_menu()
	 */
	public function test_add_menu() {
		wp_set_current_user( self::$wpseo_manager );

		$wp_admin_bar = new WP_Admin_Bar();

		$admin_bar_menu = $this
			->getMockBuilder( 'WPSEO_Admin_Bar_Menu' )
			->setConstructorArgs( array( $this->get_asset_manager() ) )
			->setMethods( array(
				'add_root_menu',
				'add_keyword_research_submenu',
				'add_analysis_submenu',
				'add_settings_submenu',
				'add_network_settings_submenu',
			) )
			->getMock();

		$admin_bar_menu
			->expects( $this->once() )
			->method( 'add_root_menu' )
			->with( $wp_admin_bar );

		$admin_bar_menu
			->expects( $this->once() )
			->method( 'add_keyword_research_submenu' )
			->with( $wp_admin_bar );

		$admin_bar_menu
			->expects( $this->once() )
			->method( 'add_analysis_submenu' )
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
	 * @covers WPSEO_Admin_Bar_Menu::enqueue_assets()
	 */
	public function test_enqueue_assets_without_admin_bar() {
		add_filter( 'show_admin_bar', '__return_false' );

		$asset_manager = $this->get_asset_manager( array( 'register_assets', 'enqueue_style' ) );

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
	 * @covers WPSEO_Admin_Bar_Menu::enqueue_assets()
	 */
	public function test_enqueue_assets() {
		add_filter( 'show_admin_bar', '__return_true' );
		wp_set_current_user( self::$wpseo_manager );

		$asset_manager = $this->get_asset_manager( array( 'register_assets', 'enqueue_style' ) );

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
	 * @covers WPSEO_Admin_Bar_Menu::register_hooks()
	 */
	public function test_register_hooks() {
		$admin_bar_menu = $this->getMockBuilder( 'WPSEO_Admin_Bar_Menu' )
			->setConstructorArgs( array( $this->get_asset_manager() ) )
			->setMethods( array( 'meets_requirements' ) )
			->getMock();

		$admin_bar_menu
			->expects( $this->once() )
			->method( 'meets_requirements' )
			->will( $this->returnValue( true ) );

		$admin_bar_menu->register_hooks();
		$this->assertInternalType( 'int', has_action( 'admin_bar_menu', array( $admin_bar_menu, 'add_menu' ), 95 ) );
		$this->assertInternalType( 'int', has_action( 'wp_enqueue_scripts', array( $admin_bar_menu, 'enqueue_assets' ) ) );
		$this->assertInternalType( 'int', has_action( 'admin_enqueue_scripts', array( $admin_bar_menu, 'enqueue_assets' ) ) );
	}

	/**
	 * Tests checking requirements.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::meets_requirements()
	 */
	public function test_meets_requirements() {
		$admin_bar_menu = new WPSEO_Admin_Bar_Menu( $this->get_asset_manager() );

		WPSEO_Options::get_instance();

		add_filter( 'option_wpseo', array( $this, 'filter_enable_admin_bar_menu_false' ), 9999 );
		add_filter( 'default_option_wpseo', array( $this, 'filter_enable_admin_bar_menu_false' ), 9999 );
		$first_result = $admin_bar_menu->meets_requirements();

		add_filter( 'option_wpseo', array( $this, 'filter_enable_admin_bar_menu_true' ), 10000 );
		add_filter( 'default_option_wpseo', array( $this, 'filter_enable_admin_bar_menu_true' ), 10000 );
		$second_result = $admin_bar_menu->meets_requirements();

		$this->assertFalse( $first_result );
		$this->assertTrue( $second_result );
	}

	/**
	 * Tests the situation where everything is going well.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::get_post_focus_keyword()
	 */
	public function test_get_post_focus_keyword() {
		$post = self::factory()->post->create_and_get();

		WPSEO_Meta::set_value( 'focuskw', 'focus keyword', $post->ID );

		$instance = new WPSEO_Admin_Bar_Menu_Double();

		$this->assertEquals( 'focus keyword', $instance->get_post_focus_keyword( $post ) );
	}

	/**
	 * Tests the situation with a non object given as argument.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::get_post_focus_keyword()
	 */
	public function test_get_post_focus_keyword_with_invalid_object() {
		$instance = new WPSEO_Admin_Bar_Menu_Double();

		$this->assertEquals( '', $instance->get_post_focus_keyword( null ) );
	}


	/**
	 * Tests the situation where the given object doesn't have an id.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::get_post_focus_keyword()
	 */
	public function test_get_post_focus_keyword_with_valid_object_but_no_id_property() {
		$post     = new stdClass();
		$instance = new WPSEO_Admin_Bar_Menu_Double();

		$this->assertEquals( '', $instance->get_post_focus_keyword( $post ) );
	}

	/**
	 * Tests the situation where the page analysis is disabled by filter.
	 *
	 * @covers WPSEO_Admin_Bar_Menu::get_post_focus_keyword()
	 */
	public function test_get_post_focus_keyword_with_page_analysis_filter_disabled() {
		add_filter( 'wpseo_use_page_analysis', '__return_false' );

		$post     = self::factory()->post->create_and_get();
		$instance = new WPSEO_Admin_Bar_Menu_Double();

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
	protected function get_asset_manager( array $mock_methods = array() ) {
		if ( empty( $mock_methods ) ) {
			return new WPSEO_Admin_Asset_Manager( new WPSEO_Admin_Asset_SEO_Location( WP_PLUGIN_DIR . '/wordpress-seo/wp-seo.php' ) );
		}

		return $this
			->getMockBuilder( 'WPSEO_Admin_Asset_Manager' )
			->setConstructorArgs( array( new WPSEO_Admin_Asset_SEO_Location( WP_PLUGIN_DIR . '/wordpress-seo/wp-seo.php' ) ) )
			->setMethods( $mock_methods )
			->getMock();
	}
}
