<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the accessible validation class
 *
 * @covers WPSEO_Redirect_Accessible_Validation
 */
class WPSEO_Redirect_Accessible_Validation_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Accessible_Validation
	 */
	private $class_instance;

	/**
	 * Setting the class_instance with an instance of WPSEO_Redirect_Accessible_Validation
	 */
	public function setUp() {
		$this->class_instance = new WPSEO_Redirect_Accessible_Validation();
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be the home_url that should be accessible
	 *
	 * @covers WPSEO_Redirect_Accessible_Validation::run
	 */
	public function test_validate_accessible( ) {
		$this->assertTrue(
			$this->class_instance->run(
				new WPSEO_Redirect( 'accessible_url', home_url(), 301 )
			)
		);
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be a unexisting url that should give a 305 response.
	 *
	 * @covers WPSEO_Redirect_Accessible_Validation::run
	 * @covers WPSEO_Redirect_Accessible_Validation::get_error
	 */
	public function test_validate_not_accessible( ) {
		// Set up fake request response
		$fake_request_response = array( $this, 'fake_305_request_response' );
		add_filter( 'pre_http_request', $fake_request_response );

		$this->assertFalse(
			$this->class_instance->run(
				new WPSEO_Redirect( 'accessible_url', 'http://httpstat.us/305', 301 )
			)
		);

		// Cleanup
		remove_filter( 'pre_http_request', $fake_request_response );

		$this->assertEquals(
			new WPSEO_Validation_Warning( 'The URL you entered returned a HTTP code different than 200(OK). The received HTTP code is 305.', 'target' ),
			$this->class_instance->get_error()
		);
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be an url that should give a 301 response.
	 *
	 * @covers WPSEO_Redirect_Accessible_Validation::run
	 * @covers WPSEO_Redirect_Accessible_Validation::get_error
	 */
	public function test_validate_redirect_to_301( ) {
		// Set up fake request response
		$fake_request_response = array( $this, 'fake_301_request_response' );
		add_filter( 'pre_http_request', $fake_request_response );

		$this->assertFalse(
			$this->class_instance->run(
				new WPSEO_Redirect( 'accessible_url', 'http://httpstat.us/301', 301 )
			)
		);

		// Cleanup
		remove_filter( 'pre_http_request', $fake_request_response );

		$this->assertEquals(
			new WPSEO_Validation_Warning( 'You\'re redirecting to a target that returns a 301 HTTP code (permanently moved). Make sure the target you specify is directly reachable.', 'target' ),
			$this->class_instance->get_error()
		);
	}

	/**
	 * Validate if the target URL is resolvable, in this test it will be a unexisting url that should give a WP_Error
	 *
	 * @covers WPSEO_Redirect_Accessible_Validation::run
	 * @covers WPSEO_Redirect_Accessible_Validation::get_error
	 */
	public function test_validate_cannot_resolve( ) {
		$this->assertFalse(
			$this->class_instance->run(
				new WPSEO_Redirect( 'accessible_url', 'fake://domain.com/', 301 )
			)
		);

		$this->assertEquals(
			new WPSEO_Validation_Warning( 'The URL you entered could not be resolved.', 'target' ),
			$this->class_instance->get_error()
		);
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be a 410 redirect, that doesn't have an endpoint.
	 *
	 * @covers WPSEO_Redirect_Accessible_Validation::run
	 */
	public function test_validate_accessible_410( ) {
		$this->assertTrue(
			$this->class_instance->run(
				new WPSEO_Redirect( 'accessible_url', '', 410 )
			)
		);
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be a 451 redirect, that doesn't have an endpoint.
	 *
	 * @covers WPSEO_Redirect_Accessible_Validation::run
	 */
	public function test_validate_accessible_451( ) {
		$this->assertTrue(
			$this->class_instance->run(
				new WPSEO_Redirect( 'accessible_url', '', 451 )
			)
		);
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be a 410 redirect, that doesn't have an endpoint.
	 *
	 * @covers WPSEO_Redirect_Accessible_Validation::run
	 */
	public function test_validate_accessible_temporary( ) {
		$this->assertFalse(
			$this->class_instance->run(
				new WPSEO_Redirect( 'accessible_url', 'http://httpstat.us/302', 301 )
			)
		);

		$this->assertEquals(
			new WPSEO_Validation_Warning( 'The url you are redirecting seems to return a 302 status. You might want to check if the target can be reached manually before saving.', 'target' ),
			$this->class_instance->get_error()
		);
	}


	/**
	 * Validate if the target URL is resolvable, in this test it will be a unexisting url that should give a WP_Error
	 *
	 * @covers WPSEO_Redirect_Accessible_Validation::run
	 * @covers WPSEO_Redirect_Accessible_Validation::parse_target
	 * @covers WPSEO_Redirect_Accessible_Validation::get_error
	 */
	public function test_validate_relative( ) {
		$this->assertTrue(
			$this->class_instance->run(
				new WPSEO_Redirect( 'accessible_url', '/', 301 )
			)
		);

		$this->assertFalse(
			$this->class_instance->run(
				new WPSEO_Redirect( 'accessible_url', '/does-not-exists', 301 )
			)
		);

		$this->assertEquals(
			new WPSEO_Validation_Warning( 'The url you are redirecting seems to return a 404 status. You might want to check if the target can be reached manually before saving.', 'target' ),
			$this->class_instance->get_error()
		);
	}

	/**
	 * Fake a 305 request code
	 *
	 * @param mixed $in Filter input value.
	 *
	 * @return array Response array.
	 */
	function fake_305_request_response( $in = false ) {
		return array(
			'headers' => array(),
			'body' => '',
			'response' => array(
				'code' => 305
			),
			'cookies' => '',
			'filename' => ''
		);
	}

	/**
	 * Fake a 305 request code
	 *
	 * @param mixed $in Filter input value.
	 *
	 * @return array Response array.
	 */
	function fake_301_request_response( $in = false ) {
		return array(
			'headers' => array(),
			'body' => '',
			'response' => array(
				'code' => 301
			),
			'cookies' => '',
			'filename' => ''
		);
	}
}
