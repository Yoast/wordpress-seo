<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the endpoint validation class
 *
 * @covers WPSEO_Redirect_Validate_Endpoint
 */
class WPSEO_Redirect_Validate_Endpoint_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Validate_Endpoint
	 */
	private $class_instance;

	/**
	 *
	 * @var array Array with redirects to test against.
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
		$this->class_instance = new WPSEO_Redirect_Validate_Endpoint();
	}

	/**
	 * Validate if the end point result in a redirectloop. In this case there won't be a loop.
	 *
	 * @covers WPSEO_Redirect_Validate_Endpoint::validate
	 */
	public function test_validate_end_point( ) {
		$this->assertTrue(
			$this->class_instance->validate(
				new WPSEO_Redirect( 'end_url', 'ending_point', 301 ),
				$this->redirects
			)
		);
	}

	/**
	 * Validate if the end point result in a redirect loop. In this case the redirect is a 410.
	 *
	 * @covers WPSEO_Redirect_Validate_Endpoint::validate
	 */
	public function test_validate_end_point_410( ) {
		$this->assertTrue(
			$this->class_instance->validate(
				new WPSEO_Redirect( 'end_url', '', 410 ),
				$this->redirects
			)
		);
	}

	/**
	 * Validate if the end point result in a redirect loop
	 *
	 * @covers WPSEO_Redirect_Validate_Endpoint::validate
	 * @covers WPSEO_Redirect_Validate_Endpoint::get_error
	 */
	public function test_validate_end_point_redirect_loop( ) {
		$this->assertFalse(
			$this->class_instance->validate(
				new WPSEO_Redirect( 'new_url', 'old_url', 301 ),
				$this->redirects
			)
		);
		$this->assertEquals( 'There might be a redirect loop.', $this->class_instance->get_error() );
	}

	/**
	 * Validate if the redirect can be done directly to an endpoint.
	 *
	 * @covers WPSEO_Redirect_Validate_Endpoint::validate
	 * @covers WPSEO_Redirect_Validate_Endpoint::get_error
	 */
	public function test_validate_end_point_direct_redirect( ) {
		$this->assertFalse(
			$this->class_instance->validate(
				new WPSEO_Redirect( 'newer_url', 'my_old_url', 301 ),
				$this->redirects
			)
		);
		$this->assertEquals( "my_old_url will be redirected to new_url. Maybe it's worth considering to create a direct redirect to new_url.", $this->class_instance->get_error() );
	}

}
