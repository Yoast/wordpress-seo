<?php

namespace Yoast\WP\SEO\Tests\WP\Admin;

use Yoast\WP\SEO\Tests\WP\Doubles\Admin\Gutenberg_Compatibility_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Gutenberg_Compatibility_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Gutenberg_Compatibility_Double
	 */
	private $default_mock;

	/**
	 * Set up our double class.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$mock = $this
			->getMockBuilder( Gutenberg_Compatibility_Double::class )
			->setMethods( [ 'detect_installed_gutenberg_version', 'get_latest_release', 'get_minimum_supported_version' ] )
			->getMock();

		$this->default_mock = $mock;
	}

	/**
	 * Tests the situation where Gutenberg is installed.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_installed
	 *
	 * @return void
	 */
	public function test_gutenberg_is_installed() {
		$mock = $this
			->getMockBuilder( Gutenberg_Compatibility_Double::class )
			->setMethods( [ 'detect_installed_gutenberg_version' ] )
			->getMock();

		$mock->set_installed_gutenberg_version( '3.3.0' );

		$this->assertEquals( $mock->is_installed(), true );
	}

	/**
	 * Tests the situation where Gutenberg is not installed.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_installed
	 *
	 * @return void
	 */
	public function test_gutenberg_not_installed() {
		$mock = $this
			->getMockBuilder( Gutenberg_Compatibility_Double::class )
			->setMethods( [ 'detect_installed_gutenberg_version' ] )
			->getMock();

		$mock->set_installed_gutenberg_version( '' );

		$this->assertEquals( $mock->is_installed(), false );
	}

	/**
	 * Tests the installed Gutenberg version when Gutenberg is available.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::get_installed_version
	 *
	 * @return void
	 */
	public function test_gutenberg_version_detection() {
		$this->default_mock->set_installed_gutenberg_version( '3.3.0' );

		$this->assertEquals( $this->default_mock->get_installed_version(), '3.3.0' );
	}

	/**
	 * Tests the installed Gutenberg version when Gutenberg is not available.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::get_installed_version
	 *
	 * @return void
	 */
	public function test_gutenberg_version_detection_when_not_installed() {
		$this->assertEquals( $this->default_mock->get_installed_version(), '' );
	}

	/**
	 * Tests that the installed Gutenberg version is considered fully compatible.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_fully_compatible
	 *
	 * @return void
	 */
	public function test_gutenberg_version_is_fully_compatible() {
		$this->default_mock
			->expects( $this->once() )
			->method( 'get_latest_release' )
			->willReturn( '3.3.0' );

		$this->default_mock->set_installed_gutenberg_version( '3.3.0' );

		$this->assertEquals( $this->default_mock->is_fully_compatible(), true );
	}

	/**
	 * Tests that the installed Gutenberg version is not considered fully compatible.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_fully_compatible
	 *
	 * @return void
	 */
	public function test_gutenberg_version_is_not_fully_compatible() {
		$this->default_mock
			->expects( $this->once() )
			->method( 'get_latest_release' )
			->willReturn( '3.4.0' );

		$this->default_mock->set_installed_gutenberg_version( '3.3.0' );

		$this->assertEquals( $this->default_mock->is_fully_compatible(), false );
	}

	/**
	 * Tests that the installed Gutenberg version is below the minimum supported version.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_below_minimum
	 *
	 * @return void
	 */
	public function test_gutenberg_version_is_below_minimum() {
		$this->default_mock
			->expects( $this->once() )
			->method( 'get_minimum_supported_version' )
			->willReturn( '2.8.0' );

		$this->default_mock->set_installed_gutenberg_version( '2.7.0' );

		$this->assertEquals( $this->default_mock->is_below_minimum(), true );
	}

	/**
	 * Tests that the installed Gutenberg version is not below the minimum supported version.
	 *
	 * @covers WPSEO_Gutenberg_Compatibility::is_below_minimum
	 *
	 * @return void
	 */
	public function test_gutenberg_version_is_not_below_minimum() {
		$this->default_mock
			->expects( $this->once() )
			->method( 'get_minimum_supported_version' )
			->willReturn( '2.8.0' );

		$this->default_mock->set_installed_gutenberg_version( '2.9.0' );

		$this->assertEquals( $this->default_mock->is_below_minimum(), false );
	}
}
