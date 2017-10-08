<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Class WPSEO_Redirect_Accessible_Validation_Double
 *
 * Create double class so we can test against the parse_target function.
 */
class WPSEO_Redirect_Accessible_Validation_Double extends WPSEO_Redirect_Accessible_Validation {
	public function return_parse_target( $target ) {
		return $this->parse_target( $target );
	}
}

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
	 * Reset WPSEO_Redirect_Util::$has_permalink_trailing_slash so it does not interfere in other tests.
	 */
	public function tearDown() {
		WPSEO_Redirect_Util::$has_permalink_trailing_slash = null;
		parent::tearDown();
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be the home_url that should be accessible
	 *
	 * @covers WPSEO_Redirect_Accessible_Validation::run
	 */
	public function test_validate_accessible() {
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
	public function test_validate_not_accessible() {
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
	public function test_validate_redirect_to_301() {
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
	public function test_validate_cannot_resolve() {
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
	public function test_validate_accessible_410() {
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
	public function test_validate_accessible_451() {
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
	public function test_validate_accessible_temporary() {
		$this->assertFalse(
			$this->class_instance->run(
				new WPSEO_Redirect( 'accessible_url', 'http://httpstat.us/302', 301 )
			)
		);

		$this->assertEquals(
			new WPSEO_Validation_Warning( 'The URL you are redirecting to seems to return a 302 status. You might want to check if the target can be reached manually before saving.', 'target' ),
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
	public function test_validate_relative() {
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
			new WPSEO_Validation_Warning( 'The URL you are redirecting to seems to return a 404 status. You might want to check if the target can be reached manually before saving.', 'target' ),
			$this->class_instance->get_error()
		);
	}

	/**
	 * Validate if the target URL is resolvable, in this test it will be a url with an extension. It should be accessible.
	 *
	 * @covers WPSEO_Redirect_Accessible_Validation::parse_target
	 */
	public function test_validate_with_extension() {
		$class_instance = $this->getMockBuilder( 'WPSEO_Redirect_Accessible_Validation' )
			->setMethods( array( 'retrieve_response_code' ) )
			->getMock();

		$class_instance->expects( $this->once() )
			->method( 'retrieve_response_code' )
			->will( $this->returnValue( 200 ) );

		$this->assertTrue(
			$class_instance->run(
				new WPSEO_Redirect( 'accessible_url.pdf', 'https://www.w3.org/2003/01/Consortium.pdf', 301 )
			)
		);

		// Because inside all unit tests home_url returns example.org we can't validate a relative url with extension.
		// Instead see test_parse_target.
	}

	/**
	 * Validate if the parse_target function deals with absolute urls, relative urls,
	 * urls with an extension and urls with a fragment correctly.
	 *
	 * @covers WPSEO_Redirect_Accessible_Validation::parse_target
	 */
	public function test_parse_target() {
		$double = new WPSEO_Redirect_Accessible_Validation_Double();

		$this->assertEquals(
			'http://www.domain.org/absolute',
			$double->return_parse_target( 'http://www.domain.org/absolute' )
		);

		$this->assertEquals(
			'http://www.domain.org/absolute.pdf',
			$double->return_parse_target( 'http://www.domain.org/absolute.pdf' )
		);

		WPSEO_Redirect_Util::$has_permalink_trailing_slash = false;
		$this->assertEquals(
			'http://example.org/relative',
			$double->return_parse_target( '/relative' )
		);

		WPSEO_Redirect_Util::$has_permalink_trailing_slash = true;
		$this->assertEquals(
			'http://example.org/relative/',
			$double->return_parse_target( '/relative' )
		);

		$this->assertEquals(
			'http://example.org/relative.pdf',
			$double->return_parse_target( '/relative.pdf' )
		);
	}

	/**
	 * Fake a 305 request code
	 *
	 * @param mixed $in Filter input value.
	 *
	 * @return array Response array.
	 */
	public function fake_305_request_response( $in = false ) {
		return array(
			'headers'  => array(),
			'body'     => '',
			'response' => array(
				'code' => 305,
			),
			'cookies'  => '',
			'filename' => '',
		);
	}

	/**
	 * Fake a 301 request code
	 *
	 * @param mixed $in Filter input value.
	 *
	 * @return array Response array.
	 */
	public function fake_301_request_response( $in = false ) {
		return array(
			'headers'  => array(),
			'body'     => '',
			'response' => array(
				'code' => 301,
			),
			'cookies'  => '',
			'filename' => '',
		);
	}
}
