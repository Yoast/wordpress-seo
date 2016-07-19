<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the subdirectory presence class
 *
 * @covers WPSEO_Redirect_Subdirectory_Validation
 *
 * @group test
 */
class WPSEO_Redirect_Subdirectory_Validation_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Subdirectory_Validation
	 */
	private $class_instance;


	/**
	 * Setting the class_instance with an instance of WPSEO_Redirect_Subdirectory_Validation
	 */
	public function setUp() {
		$this->class_instance = new WPSEO_Redirect_Subdirectory_Validation();
	}

	/**
	 * Puts a subdirectory in the home url.
	 *
	 * @return string
	 */
	public function override_home_url() {
		return 'http://example.org/subdirectory';
	}

	/**
	 * Test a redirect without a subdirectory based installation.
	 *
	 * @covers WPSEO_Redirect_Subdirectory_Validation::run
	 */
	public function test_validate_without_subdirectory() {
		$this->assertTrue(
			$this->class_instance->run( new WPSEO_Redirect( 'redirect', 'redirect', 301 ) )
		);
	}

	/**
	 * Test a redirect without a subdirectory based installation.
	 *
	 * @covers WPSEO_Redirect_Subdirectory_Validation::run
	 */
	public function test_validate_with_subdirectory() {

		add_filter( 'home_url', array( $this, 'override_home_url' ) );

		$this->assertTrue(
			$this->class_instance->run( new WPSEO_Redirect( 'subdirectory/redirect', 'redirect', 301 ) )
		);
	}

	/**
	 * Test a redirect without a subdirectory based installation.
	 *
	 * @covers WPSEO_Redirect_Subdirectory_Validation::run
	 * @covers WPSEO_Redirect_Subdirectory_Validation::get_error
	 */
	public function test_validate_with_subdirectory_missing() {

		add_filter( 'home_url', array( $this, 'override_home_url' ) );

		$this->assertFalse(
			$this->class_instance->run( new WPSEO_Redirect( 'redirect', 'redirect', 301 ) )
		);

		$expected_warning = 'Your redirect is missing the subdirectory where WordPress is installed in. This will result in a redirect that won\'t work. Make sure the redirect starts with <code>/subdirectory</code>';

		$this->assertEquals(
			new WPSEO_Validation_Warning( $expected_warning, 'origin' ),
			$this->class_instance->get_error()
		);
	}

	/**
	 * Test a redirect without a subdirectory based installation.
	 *
	 * @covers WPSEO_Redirect_Subdirectory_Validation::run
	 * @covers WPSEO_Redirect_Subdirectory_Validation::get_error
	 */
	public function test_validate_with_subdirectory_not_at_beginning() {

		add_filter( 'home_url', array( $this, 'override_home_url' ) );

		$this->assertFalse(
			$this->class_instance->run( new WPSEO_Redirect( 'redirect/subdirectory', 'redirect', 301 ) )
		);

		$expected_warning = 'Your redirect is missing the subdirectory where WordPress is installed in. This will result in a redirect that won\'t work. Make sure the redirect starts with <code>/subdirectory</code>';
		$this->assertEquals(
			new WPSEO_Validation_Warning( $expected_warning, 'origin' ),
			$this->class_instance->get_error()
		);

	}

	/**
	 * Test a redirect without a subdirectory based installation.
	 *
	 * @covers WPSEO_Redirect_Subdirectory_Validation::run
	 * @covers WPSEO_Redirect_Subdirectory_Validation::get_error
	 */
	public function test_validate_with_slashes_subdirectory() {

		add_filter( 'home_url', array( $this, 'override_home_url' ) );

		$this->assertTrue(
			$this->class_instance->run( new WPSEO_Redirect( '/subdirectory/redirect', 'redirect', 301 ) )
		);
	}
	
	public function tearDown() {
		remove_filter( 'home_url', 'override_home_url' );
	}

}
