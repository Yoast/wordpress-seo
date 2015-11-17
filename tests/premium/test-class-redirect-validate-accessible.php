<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the accessible validation class
 *
 * @covers WPSEO_Redirect_Validate_Accessible
 */
class WPSEO_Redirect_Validate_Accessible_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Validate_Accessible
	 */
	private $class_instance;

	/**
	 * Setting the class_instance with an instance of WPSEO_Redirect_Validate_Accessible
	 */
	public function setUp() {
		$this->class_instance = new WPSEO_Redirect_Validate_Accessible();
	}


	/**
	 * Validate if the target URL is accessible, in this test it will be the home_url that should be accessible
	 *
	 * @covers WPSEO_Redirect_Validate_Accessible::validate
	 */
	public function test_validate_accessible( ) {
		$this->assertTrue(
			$this->class_instance->validate(
				new WPSEO_Redirect( 'accessible_url', home_url(), 301 )
			)
		);
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be a unexisting url that should give a 404 response.
	 *
	 * @covers WPSEO_Redirect_Validate_Accessible::validate
	 * @covers WPSEO_Redirect_Validate_Accessible::get_error
	 */
	public function test_validate_not_accessible( ) {
		$this->assertFalse(
			$this->class_instance->validate(
				new WPSEO_Redirect( 'accessible_url', 'http://example.com/this/path/does/not/exist', 301 )
			)
		);

		$this->assertContains( 'The URL you entered returned a HTTP code different than 200(OK). The received HTTP code is ', $this->class_instance->get_error() );
	}

	/**
	 * Validate if the target URL is resolvable, in this test it will be a unexisting url that should give a WP_Error
	 *
	 * @covers WPSEO_Redirect_Validate_Accessible::validate
	 * @covers WPSEO_Redirect_Validate_Accessible::get_warning
	 */
	public function test_validate_cannot_resolve( ) {
		$this->assertTrue(
			$this->class_instance->validate(
				new WPSEO_Redirect( 'accessible_url', 'fake://domain.com/', 301 )
			)
		);

		$this->assertEquals( 'The URL you entered could not resolved.', $this->class_instance->get_warning() );
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be a 410 redirect, that doesn't have an endpoint.
	 *
	 * @covers WPSEO_Redirect_Validate_Accessible::validate
	 */
	public function test_validate_accessible_410( ) {
		$this->assertTrue(
			$this->class_instance->validate(
				new WPSEO_Redirect( 'accessible_url', '', 410 )
			)
		);
	}

}
