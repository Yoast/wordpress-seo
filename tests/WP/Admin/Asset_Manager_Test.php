<?php

namespace Yoast\WP\SEO\Tests\WP\Admin;

use WPSEO_Admin_Asset;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Asset_Manager_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->asset_manager = new WPSEO_Admin_Asset_Manager();
	}

	/**
	 * This is the only way to tests the protected methods. These should really be
	 * constants, but we can't because we have to support PHP 5.5 and lower.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::scripts_to_be_registered
	 * @covers WPSEO_Admin_Asset_Manager::styles_to_be_registered
	 *
	 * @return void
	 */
	public function test_DEFAULT_register() {
		$instance = $this
			->getMockBuilder( WPSEO_Admin_Asset_Manager::class )
			->setMethods(
				[
					'register_scripts',
					'register_styles',
					'scripts_to_be_registered',
					'styles_to_be_registered',
				]
			)
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'scripts_to_be_registered' )
			->willReturn(
				[ 'script' ]
			);

		$instance
			->expects( $this->once() )
			->method( 'styles_to_be_registered' )
			->willReturn(
				[ 'style' ]
			);

		$instance
			->expects( $this->once() )
			->method( 'register_scripts' )
			->with( [ 'script' ] );

		$instance
			->expects( $this->once() )
			->method( 'register_styles' )
			->with( [ 'style' ] );

		$instance->register_assets();
	}

	/**
	 * Tests whether the function enqueue_script() enqueues the included script.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_script
	 *
	 * @return void
	 */
	public function test_enqueue_script() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_script( 'post-edit' );
		$this->assertTrue( \wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'post-edit', 'enqueued' ) );
	}

	/**
	 * Tests whether the function enqueue_style() enqueues the included style.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_style
	 *
	 * @return void
	 */
	public function test_enqueue_style() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_style( 'metabox-css' );
		$this->assertTrue( \wp_style_is( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox-css', 'enqueued' ) );
	}

	/**
	 * Tests whether enqueue style doesn't enqueue when wrong data is fed.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_style
	 *
	 * @return void
	 */
	public function test_wrong_enqueue_style() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_style( 'nonexisting' );
		$this->assertFalse( \wp_style_is( WPSEO_Admin_Asset_Manager::PREFIX . 'nonexisting', 'enqueued' ) );
	}

	/**
	 * Tests whether the function register_script() registers the included script.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_script
	 *
	 * @return void
	 */
	public function test_register_script() {
		$asset_args = [
			'name'      => 'handle',
			'src'       => 'src.js',
			'deps'      => [ 'deps' ],
			'version'   => 'version',
			'in_footer' => 'in_footer',
		];
		$this->asset_manager->register_script( new WPSEO_Admin_Asset( $asset_args ) );

		// We really want to mock wp_enqueue_script here but we can't because of PHP 5.2.
		// Use the WordPress internals to assert instead.
		global $wp_scripts;

		$this->assertTrue( isset( $wp_scripts->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle' ] ) );

		$result = $wp_scripts->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle' ];

		$this->assertEquals( WPSEO_Admin_Asset_Manager::PREFIX . 'handle', $result->handle );
		$this->assertEquals( 'http://' . \WP_TESTS_DOMAIN . '/wp-content/plugins/wordpress-seo/js/dist/src.js', $result->src );
		$this->assertEquals( [ 'deps' ], $result->deps );
		$this->assertEquals( 'version', $result->ver );
		$this->assertEquals( [ 'group' => 1 ], $result->extra );
	}

	/**
	 * Test if the Asset Manager works with a custom prefix.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_script
	 *
	 * @return void
	 */
	public function test_register_script_with_prefix() {
		$prefix        = 'yoast-custom-prefix';
		$asset_manager = new WPSEO_Admin_Asset_Manager( null, $prefix );

		$asset_args = [
			'name'      => 'handle',
			'src'       => 'src',
		];
		$asset_manager->register_script( new WPSEO_Admin_Asset( $asset_args ) );

		// We really want to mock wp_enqueue_script here but we can't because of PHP 5.2.
		// Use the WordPress internals to assert instead.
		global $wp_scripts;

		$this->assertTrue( isset( $wp_scripts->registered[ $prefix . 'handle' ] ) );
	}

	/**
	 * Tests whether the register_style registers the included style.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_style
	 *
	 * @return void
	 */
	public function test_register_style() {
		$asset_args = [
			'name'    => 'handle',
			'src'     => 'src',
			'deps'    => [ 'deps' ],
			'version' => 'version',
			'media'   => 'print',
		];
		$this->asset_manager->register_style( new WPSEO_Admin_Asset( $asset_args ) );

		// We really want to mock wp_enqueue_style here but we can't because of PHP 5.2.
		// Use the WordPress internals to assert instead.
		global $wp_styles;

		$this->assertTrue( isset( $wp_styles->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle' ] ) );

		$result = $wp_styles->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle' ];

		$this->assertEquals( WPSEO_Admin_Asset_Manager::PREFIX . 'handle', $result->handle );
		$this->assertEquals( 'http://' . \WP_TESTS_DOMAIN . '/wp-content/plugins/wordpress-seo/css/dist/src.css', $result->src );
		$this->assertEquals( [ 'deps' ], $result->deps );
		$this->assertEquals( 'version', $result->ver );
		$this->assertEquals( 'print', $result->args );
	}

	/**
	 * Test if the Asset Manager works with a custom prefix.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_style
	 *
	 * @return void
	 */
	public function test_register_style_with_prefix() {
		$prefix        = 'yoast-custom-prefix';
		$asset_manager = new WPSEO_Admin_Asset_Manager( null, $prefix );

		$asset_args = [
			'name'      => 'handle',
			'src'       => 'src',
		];
		$asset_manager->register_style( new WPSEO_Admin_Asset( $asset_args ) );

		// We really want to mock wp_enqueue_script here but we can't because of PHP 5.2.
		// Use the WordPress internals to assert instead.
		global $wp_scripts;

		$this->assertTrue( isset( $wp_scripts->registered[ $prefix . 'handle' ] ) );
	}

	/**
	 * Tests whether register_scripts registers multiple scripts correctly.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_scripts
	 *
	 * @return void
	 */
	public function test_register_scripts() {
		$asset_args = [
			0 => [
				'name' => 'testfile',
				'src'  => 'testfile',
			],
			1 => [
				'name'      => 'testfile2',
				'src'       => 'testfile2',
				'deps'      => [ 'dep1' ],
				'version'   => 'version1',
				'in_footer' => false,
			],
		];

		$class_instance = $this->getMockBuilder( WPSEO_Admin_Asset_Manager::class )
			->setMethods( [ 'register_script' ] )
			->getMock();

		$class_instance
			->expects( $this->exactly( 2 ) )
			->method( 'register_script' )
			->withConsecutive(
				[ $this->equalTo( new WPSEO_Admin_Asset( $asset_args[0] ) ) ],
				[ $this->equalTo( new WPSEO_Admin_Asset( $asset_args[1] ) ) ]
			);

		$class_instance->register_scripts( $asset_args );
	}

	/**
	 * Tests whether register_style can actually register a style based on the required arguments.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_styles
	 *
	 * @return void
	 */
	public function test_register_styles() {
		$asset_args = [
			0 => [
				'name' => 'testfile',
				'src'  => 'testfile',
			],
			1 => [
				'name'    => 'testfile2',
				'src'     => 'testfile2',
				'deps'    => [ 'dep1' ],
				'version' => 'version1',
				'media'   => 'screen',
			],
		];

		$class_instance = $this->getMockBuilder( WPSEO_Admin_Asset_Manager::class )
			->setMethods( [ 'register_style' ] )
			->getMock();

		$class_instance
			->expects( $this->exactly( 2 ) )
			->method( 'register_style' )
			->withConsecutive(
				[ $this->equalTo( new WPSEO_Admin_Asset( $asset_args[0] ) ) ],
				[ $this->equalTo( new WPSEO_Admin_Asset( $asset_args[1] ) ) ]
			);

		$class_instance->register_styles( $asset_args );
	}

	/**
	 * Tests whether register_assets calls the functions register_scripts and register_styles.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_assets
	 *
	 * @return void
	 */
	public function test_register_assets() {

		$class_instance = $this->getMockBuilder( WPSEO_Admin_Asset_Manager::class )
			->setMethods( [ 'register_scripts', 'register_styles' ] )
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
	 * Tests the flatten_version function.
	 *
	 * @covers       WPSEO_Admin_Asset_Manager::flatten_version
	 * @dataProvider flatten_version_provider
	 *
	 * @param string $original Version number.
	 * @param string $expected Expected output.
	 *
	 * @return void
	 */
	public function test_flatten_version( $original, $expected ) {
		$this->assertEquals( $expected, $this->asset_manager->flatten_version( $original ) );
	}

	/**
	 * Data provider.
	 *
	 * @return array
	 */
	public static function flatten_version_provider() {
		return [
			[ '3.0', '300' ],
			[ '1.4', '140' ],
			[ '', '' ],
			[ '3.0.0', '300' ],
			[ '25.1456.140', '251456140' ],
			[ '1', '1' ],
		];
	}
}
