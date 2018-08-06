<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
class WPSEO_Gutenberg_Compatibility_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Gutenberg_Compatibility_Double
	 */
	private $default_mock;

	/**
	 * Set up our double class
	 */
	public function setUp() {
		parent::setUp();

		$mock = $this
			->getMockBuilder( 'WPSEO_Gutenberg_Compatibility_Double' )
			->setMethods( array( 'is_gutenberg_available', 'get_latest_release', 'get_minimum_supported_version' ) )
			->getMock();

		$this->default_mock = $mock;
	}

	/**
	 * Tests the situation where Gutenberg is installed.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_installed
	 */
	public function test_gutenberg_is_installed() {
		$this->default_mock->set_installed_gutenberg_version( '3.3.0' );

		$this->default_mock
			->expects( $this->once() )
			->method( 'is_gutenberg_available' )
			->will( $this->returnValue( true ) );

		$this->assertEquals( $this->default_mock->is_installed(), true );
	}

	/**
	 * Tests the situation where Gutenberg is not installed.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::get_installed_version
	 */
	public function test_gutenberg_not_installed() {
		$this->default_mock
			->expects( $this->once() )
			->method( 'is_gutenberg_available' )
			->will( $this->returnValue( false ) );

		$this->assertEquals( $this->default_mock->is_installed(), false );
	}

	/**
	 * Tests the installed Gutenberg version when Gutenberg is available.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::get_installed_version
	 */
	public function test_gutenberg_version_detection() {
		$this->default_mock->set_installed_gutenberg_version( '3.3.0' );

		$this->assertEquals( $this->default_mock->get_installed_version(), '3.3.0' );
	}

	/**
	 * Tests the installed Gutenberg version when Gutenberg is not available.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::get_installed_version
	 */
	public function test_gutenberg_version_detection_when_not_installed() {
		$this->assertEquals( $this->default_mock->get_installed_version(), '' );
	}

	/**
	 * Tests that the installed Gutenberg version is the latest one.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_latest_version
	 */
	public function test_gutenberg_version_is_latest() {
		$this->default_mock
			->expects( $this->once() )
			->method( 'get_latest_release' )
			->will( $this->returnValue( '3.3.0' ) );

		$this->default_mock->set_installed_gutenberg_version( '3.3.0' );

		$this->assertEquals( $this->default_mock->is_latest_version(), true );
	}

	/**
	 * Tests that the installed Gutenberg version is not the latest one.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_latest_version
	 */
	public function test_gutenberg_version_is_not_latest() {
		$this->default_mock
			->expects( $this->once() )
			->method( 'get_latest_release' )
			->will( $this->returnValue( '3.4.0' ) );

		$this->default_mock->set_installed_gutenberg_version( '3.3.0' );

		$this->assertEquals( $this->default_mock->is_latest_version(), false );
	}

	/**
	 * Tests that the installed Gutenberg version is considered fully compatible.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_fully_compatible
	 */
	public function test_gutenberg_version_is_fully_compatible() {
		$this->default_mock
			->expects( $this->once() )
			->method( 'get_latest_release' )
			->will( $this->returnValue( '3.3.0' ) );

		$this->default_mock->set_installed_gutenberg_version( '3.3.0' );

		$this->assertEquals( $this->default_mock->is_fully_compatible(), true );
	}

	/**
	 * Tests that the installed Gutenberg version is not considered fully compatible.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_fully_compatible
	 */
	public function test_gutenberg_version_is_not_fully_compatible() {
		$this->default_mock
			->expects( $this->once() )
			->method( 'get_latest_release' )
			->will( $this->returnValue( '3.4.0' ) );

		$this->default_mock->set_installed_gutenberg_version( '3.3.0' );

		$this->assertEquals( $this->default_mock->is_fully_compatible(), false );
	}

	/**
	 * Tests that the installed Gutenberg version is below the minimum supported version.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_below_minimum
	 */
	public function test_gutenberg_version_is_below_minimum() {
		$this->default_mock
			->expects( $this->once() )
			->method( 'get_minimum_supported_version' )
			->will( $this->returnValue( '2.8.0' ) );

		$this->default_mock->set_installed_gutenberg_version( '2.7.0' );

		$this->assertEquals( $this->default_mock->is_below_minimum(), true );
	}

	/**
	 * Tests that the installed Gutenberg version is not below the minimum supported version.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_below_minimum
	 */
	public function test_gutenberg_version_is_not_below_minimum() {
		$this->default_mock
			->expects( $this->once() )
			->method( 'get_minimum_supported_version' )
			->will( $this->returnValue( '2.8.0' ) );

		$this->default_mock->set_installed_gutenberg_version( '2.9.0' );

		$this->assertEquals( $this->default_mock->is_below_minimum(), false );
	}
}
