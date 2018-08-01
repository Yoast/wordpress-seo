<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for testing the endpoint validation class.
 *
 * @covers WPSEO_Redirect_Endpoint_Validation
 */
class WPSEO_Redirect_Endpoint_Validation_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Endpoint_Validation
	 */
	private $class_instance;

	/**
	 * Array with redirects to test against.
	 *
	 * @var array
	 */
	private $redirects = array(
		'old_url'    => 'new_url',
		'older_url'  => 'newer_url',
		'my_old_url' => 'old_url',
	);

	/**
	 * Testing with the endpoint validation class.
	 */
	public function setUp() {
		$this->class_instance = new WPSEO_Redirect_Endpoint_Validation();
	}

	/**
	 * Validate if the end point is in a redirect loop. In this case there won't be a loop.
	 *
	 * @covers WPSEO_Redirect_Endpoint_Validation::run
	 */
	public function test_validate_end_point() {
		$this->assertTrue(
			$this->class_instance->run(
				new WPSEO_Redirect( 'end_url', 'ending_point', 301 ),
				new WPSEO_Redirect( 'end_url', 'ending_point', 301 ),
				$this->redirects
			)
		);
	}

	/**
	 * Validate if the end point is in a redirect loop. In this case the redirect is a 410.
	 *
	 * @covers WPSEO_Redirect_Endpoint_Validation::run
	 */
	public function test_validate_end_point_410() {
		$this->assertTrue(
			$this->class_instance->run(
				new WPSEO_Redirect( 'end_url', '', 410 ),
				new WPSEO_Redirect( 'end_url', '', 410 ),
				$this->redirects
			)
		);
	}

	/**
	 * Validate if the end point is in a redirect loop. In this case the redirect is a 451.
	 *
	 * @covers WPSEO_Redirect_Endpoint_Validation::run
	 */
	public function test_validate_end_point_451() {
		$this->assertTrue(
			$this->class_instance->run(
				new WPSEO_Redirect( 'end_url', '', 451 ),
				new WPSEO_Redirect( 'end_url', '', 451 ),
				$this->redirects
			)
		);
	}

	/**
	 * Validate if the end point is in a redirect loop.
	 *
	 * @covers WPSEO_Redirect_Endpoint_Validation::run
	 * @covers WPSEO_Redirect_Endpoint_Validation::get_error
	 */
	public function test_validate_end_point_redirect_loop() {
		$this->assertFalse(
			$this->class_instance->run(
				new WPSEO_Redirect( 'new_url', 'old_url', 301 ),
				new WPSEO_Redirect( 'new_url', 'old_url', 301 ),
				$this->redirects
			)
		);
		$this->assertEquals(
			new WPSEO_Validation_Error( 'The redirect you are trying to save will create a redirect loop. This means there probably already exists a redirect that points to the origin of the redirect you are trying to save', array( 'origin', 'target' ) ),
			$this->class_instance->get_error()
		);
	}

	/**
	 * Validate if the redirect can be done directly to an endpoint.
	 *
	 * @covers WPSEO_Redirect_Endpoint_Validation::run
	 * @covers WPSEO_Redirect_Endpoint_Validation::get_error
	 */
	public function test_validate_end_point_direct_redirect() {
		$this->assertFalse(
			$this->class_instance->run(
				new WPSEO_Redirect( 'newer_url', 'my_old_url', 301 ),
				new WPSEO_Redirect( 'newer_url', 'my_old_url', 301 ),
				$this->redirects
			)
		);
		$this->assertEquals(
			new WPSEO_Validation_Warning( "my_old_url will be redirected to new_url. Maybe it's worth considering to create a direct redirect to new_url.", 'target' ),
			$this->class_instance->get_error()
		);
	}

}
