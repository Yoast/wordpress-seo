<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the self redirection validation class
 *
 * @covers WPSEO_Redirect_Self_Redirect_Validation
 */
class WPSEO_Redirect_Self_Redirect_Validation_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Self_Redirect_Validation
	 */
	private $class_instance;

	private $home_url = 'http://example.org';

	/**
	 * Setting the class_instance with an instance of WPSEO_Redirect_Self_Redirect_Validation
	 */
	public function setUp() {
		$this->class_instance = new WPSEO_Redirect_Self_Redirect_Validation();

		add_filter( 'home_url', array( $this, 'override_home_url' ) );
	}

	public function override_home_url() {
		return $this->home_url;
	}

	/**
	 * Test with redirects that end up pointing to themselves.
	 *
	 * @dataProvider redirects_to_self_provider
	 *
	 * @param string $old_url    The origin url.
	 * @param string $new_url    The url to redirect to.
	 * @param int    $type       Type of the redirect.
	 *
	 * @covers WPSEO_Redirect_Self_Redirect_Validation::run
	 * @covers WPSEO_Redirect_Self_Redirect_Validation::get_error
	 */
	public function test_validate_redirect_to_self( $old_url, $new_url, $type = 301 ) {
		$this->assertFalse(	$this->class_instance->run(
				new WPSEO_Redirect( $old_url, $new_url, $type )
			) );

		$this->assertEquals(
			new WPSEO_Validation_Error( 'You are attempting to redirect to the same URL as the origin.
					Please choose a different URL to redirect to.', 'origin' ),
			$this->class_instance->get_error()
		);
	}

	/**
	 * Test with redirects that do not end up pointing to themselves.
	 *
	 * @dataProvider does_not_redirect_to_self_provider
	 *
	 * @param string $old_url    The origin url.
	 * @param string $new_url    The url to redirect to.
	 * @param int    $type       Type of the redirect.
	 *
	 * @covers WPSEO_Redirect_Self_Redirect_Validation::run
	 */
	public function test_validate_not_redirect_to_self( $old_url, $new_url, $type = 301 ) {
		$this->assertTrue(	$this->class_instance->run(
			new WPSEO_Redirect( $old_url, $new_url, $type )
		) );
	}

	/**
	 * Provide array with redirects to test against
	 *
	 * @return array
	 */
	public function redirects_to_self_provider() {
		return array(
			array( 'http://example.org/test-1', 'test-1' ),
			array( 'test', 'test' ),
		);
	}

	/**
	 * Provide array with redirects to test against
	 *
	 * @return array
	 */
	public function does_not_redirect_to_self_provider() {
		return array(
			array( 'http://example.org/test', 'new_url' ),
			array( 'http://example.org/test-1', 'new_url' ),
			array( 'test-1', 'new_url' ),
		);
	}

	public function tearDown() {
		remove_filter( 'home_url', 'override_home_url' );
	}
}
