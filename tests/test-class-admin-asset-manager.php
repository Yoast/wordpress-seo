<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Admin_Asset_Manager_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();
		$this->asset_manager = new WPSEO_Admin_Asset_Manager();
	}

	/**
	 * This is the only way to tests the protected methods. The should really be constants, but we can't because we have
	 * to support PHP5.5 and lower.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::scripts_to_be_registered
	 * @covers WPSEO_Admin_Asset_Manager::styles_to_be_registered
	 */
	public function test_DEFAULT_register() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Admin_Asset_Manager' )
			->setMethods(
				array(
					'register_scripts',
					'register_styles',
					'scripts_to_be_registered',
					'styles_to_be_registered',
				)
			)
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'scripts_to_be_registered' )
			->will(
				$this->returnValue(
					array( 'script' )
				)
			);

		$instance
			->expects( $this->once() )
			->method( 'styles_to_be_registered' )
			->will(
				$this->returnValue(
					array( 'style' )
				)
			);

		$instance
			->expects( $this->once() )
			->method( 'register_scripts' )
			->with( array( 'script' ) );

		$instance
			->expects( $this->once() )
			->method( 'register_styles' )
			->with( array( 'style' ) );

		$instance->register_assets();
	}

	/**
	 * Tests whether the function enqueue_script() enqueues the included script.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_script
	 */
	public function test_enqueue_script() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_script( 'metabox' );
		$this->assertTrue( wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox', 'enqueued' ) );
	}

	/**
	 * Tests whether the function enqueue_style() enqueues the included style.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_style
	 */
	public function test_enqueue_style() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_style( 'metabox-css' );
		$this->assertTrue( wp_style_is( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox-css', 'enqueued' ) );
	}

	/**
	 * Tests whether enqueue style doesn't enqueue when wrong data is fed.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_style
	 */
	public function test_wrong_enqueue_style() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_style( 'nonexisting' );
		$this->assertFalse( wp_style_is( WPSEO_Admin_Asset_Manager::PREFIX . 'nonexisting', 'enqueued' ) );
	}

	/**
	 * @covers WPSEO_Admin_Asset_Manager::register_script
	 */
	public function test_register_script() {
		$asset_args = array(
			'name'      => 'handle',
			'src'       => 'src',
			'deps'      => array( 'deps' ),
			'version'   => 'version',
			'in_footer' => 'in_footer',
		);
		$this->asset_manager->register_script( new WPSEO_Admin_Asset( $asset_args ) );

		// We really want to mock wp_enqueue_script here but we can't because of PHP 5.2
		// Use the WordPress internals to assert instead.
		global $wp_scripts;

		$this->assertTrue( isset( $wp_scripts->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle' ] ) );

		$result = $wp_scripts->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle' ];

		$this->assertEquals( WPSEO_Admin_Asset_Manager::PREFIX . 'handle', $result->handle );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/wp-content/plugins/wordpress-seo/js/dist/src' . WPSEO_CSSJS_SUFFIX . '.js', $result->src );
		$this->assertEquals( array( 'deps' ), $result->deps );
		$this->assertEquals( 'version', $result->ver );
		$this->assertEquals( array( 'group' => 1 ), $result->extra );
	}

	/**
	 * Test if the Asset Manager works with a custom prefix
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_script
	 */
	public function test_register_script_with_prefix() {
		$prefix        = 'yoast-custom-prefix';
		$asset_manager = new WPSEO_Admin_Asset_Manager( null, $prefix );

		$asset_args = array(
			'name'      => 'handle',
			'src'       => 'src',
		);
		$asset_manager->register_script( new WPSEO_Admin_Asset( $asset_args ) );

		// We really want to mock wp_enqueue_script here but we can't because of PHP 5.2
		// Use the WordPress internals to assert instead.
		global $wp_scripts;

		$this->assertTrue( isset( $wp_scripts->registered[ $prefix . 'handle' ] ) );
	}

	/**
	 * @covers WPSEO_Admin_Asset_Manager::register_script
	 */
	public function test_register_script_suffix() {
		$asset_args = array(
			'name'   => 'handle2', // Handles have to be unique, isolation YaY ¯\_(ツ)_/¯.
			'src'    => 'src',
			'suffix' => '.suffix',
		);
		$this->asset_manager->register_script( new WPSEO_Admin_Asset( $asset_args ) );

		// We really want to mock wp_enqueue_script here but we can't because of PHP 5.2
		// Use the WordPress internals to assert instead.
		global $wp_scripts;

		$result = $wp_scripts->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle2' ];

		$this->assertEquals( 'http://example.org/wp-content/plugins/wordpress-seo/js/dist/src.suffix.js', $result->src );
	}

	/**
	 * @covers WPSEO_Admin_Asset_Manager::register_style
	 */
	public function test_register_style() {
		$asset_args = array(
			'name'    => 'handle',
			'src'     => 'src',
			'deps'    => array( 'deps' ),
			'version' => 'version',
			'media'   => 'print',
		);
		$this->asset_manager->register_style( new WPSEO_Admin_Asset( $asset_args ) );

		// We really want to mock wp_enqueue_style here but we can't because of PHP 5.2
		// Use the WordPress internals to assert instead.
		global $wp_styles;

		$this->assertTrue( isset( $wp_styles->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle' ] ) );

		$result = $wp_styles->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle' ];

		$this->assertEquals( WPSEO_Admin_Asset_Manager::PREFIX . 'handle', $result->handle );
		$this->assertEquals( 'http://' . WP_TESTS_DOMAIN . '/wp-content/plugins/wordpress-seo/css/dist/src' . WPSEO_CSSJS_SUFFIX . '.css', $result->src );
		$this->assertEquals( array( 'deps' ), $result->deps );
		$this->assertEquals( 'version', $result->ver );
		$this->assertEquals( 'print', $result->args );
	}

	/**
	 * Test if the Asset Manager works with a custom prefix
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_style
	 */
	public function test_register_style_with_prefix() {
		$prefix        = 'yoast-custom-prefix';
		$asset_manager = new WPSEO_Admin_Asset_Manager( null, $prefix );

		$asset_args = array(
			'name'      => 'handle',
			'src'       => 'src',
		);
		$asset_manager->register_style( new WPSEO_Admin_Asset( $asset_args ) );

		// We really want to mock wp_enqueue_script here but we can't because of PHP 5.2
		// Use the WordPress internals to assert instead.
		global $wp_scripts;

		$this->assertTrue( isset( $wp_scripts->registered[ $prefix . 'handle' ] ) );
	}

	/**
	 * @covers WPSEO_Admin_Asset_Manager::register_script
	 */
	public function test_register_style_suffix() {
		$asset_args = array(
			'name'   => 'handle2', // Handles have to be unique, isolation YaY ¯\_(ツ)_/¯.
			'src'    => 'src',
			'suffix' => '.suffix',
		);
		$this->asset_manager->register_style( new WPSEO_Admin_Asset( $asset_args ) );

		// We really want to mock wp_enqueue_script here but we can't because of PHP 5.2
		// Use the WordPress internals to assert instead.
		global $wp_styles;

		$result = $wp_styles->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle2' ];

		$this->assertEquals( 'http://example.org/wp-content/plugins/wordpress-seo/css/dist/src.suffix.css', $result->src );
	}

	/**
	 * @covers WPSEO_Admin_Asset_Manager::register_scripts
	 */
	public function test_register_scripts() {

		$asset_args = array(
			0 => array(
				'name' => 'testfile',
				'src'  => 'testfile',
			),
			1 => array(
				'name'      => 'testfile2',
				'src'       => 'testfile2',
				'deps'      => array( 'dep1' ),
				'version'   => 'version1',
				'in_footer' => false,
			),
		);

		$class_instance =
			$this
				->getMockBuilder( 'WPSEO_Admin_Asset_Manager' )
				->setMethods( array( 'register_script' ) )
				->getMock();

		$class_instance
			->expects( $this->at( 0 ) )
			->method( 'register_script' )
			->with(
				$this->equalTo( new WPSEO_Admin_Asset( $asset_args[0] ) )
			);

		$class_instance
			->expects( $this->at( 1 ) )
			->method( 'register_script' )
			->with(
				$this->equalTo( new WPSEO_Admin_Asset( $asset_args[1] ) )
			);

		$class_instance->register_scripts( $asset_args );
	}

	/**
	 * Tests whether register_style can actually register a style based on the required arguments.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_styles
	 */
	public function test_register_styles() {

		$asset_args = array(
			0 => array(
				'name' => 'testfile',
				'src'  => 'testfile',
			),
			1 => array(
				'name'    => 'testfile2',
				'src'     => 'testfile2',
				'deps'    => array( 'dep1' ),
				'version' => 'version1',
				'media'   => 'screen',
			),
		);

		$class_instance =
			$this
				->getMockBuilder( 'WPSEO_Admin_Asset_Manager' )
				->setMethods( array( 'register_style' ) )
				->getMock();

		$class_instance
			->expects( $this->at( 0 ) )
			->method( 'register_style' )
			->with(
				$this->equalTo( new WPSEO_Admin_Asset( $asset_args[0] ) )
			);

		$class_instance
			->expects( $this->at( 1 ) )
			->method( 'register_style' )
			->with(
				$this->equalTo( new WPSEO_Admin_Asset( $asset_args[1] ) )
			);

		$class_instance->register_styles( $asset_args );
	}

	/**
	 * Tests whether register_assets calls the functions register_scripts and register_styles.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_assets
	 */
	public function test_register_assets() {

		$class_instance =
			$this
				->getMockBuilder( 'WPSEO_Admin_Asset_Manager' )
				->setMethods( array( 'register_scripts', 'register_styles' ) )
				->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'register_scripts' );
		$class_instance
			->expects( $this->once() )
			->method( 'register_styles' );

		$class_instance->register_assets();
	}

	/**
	 * Tests the flatten_version function
	 *
	 * @covers WPSEO_Admin_Asset_Manager::flatten_version
	 * @dataProvider flatten_version_provider
	 *
	 * @param string $original Version number.
	 * @param string $expected Expected output.
	 */
	public function test_flatten_version( $original, $expected ) {
		$this->assertEquals( $expected, $this->asset_manager->flatten_version( $original ) );
	}

	/**
	 * Data provider.
	 *
	 * @return array
	 */
	public function flatten_version_provider() {
		return array(
			array( '3.0', '300' ),
			array( '1.4', '140' ),
			array( '', '' ),
			array( '3.0.0', '300' ),
			array( '25.1456.140', '251456140' ),
			array( '1', '1' ),
		);
	}
}
