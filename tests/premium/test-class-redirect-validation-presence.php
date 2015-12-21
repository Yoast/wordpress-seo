<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the endpoint validation class
 *
 * @covers WPSEO_Redirect_Validation_Presence
 */
class WPSEO_Redirect_Validation_Presence_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Validation_Presence
	 */
	private $class_instance;

	/**
	 * Setting the class_instance with an instance of WPSEO_Redirect_Validation_Presence
	 */
	public function setUp() {
		$this->class_instance = new WPSEO_Redirect_Validation_Presence();
	}

	/**
	 * Validate the fields being filled correctly.
	 *
	 * @dataProvider validate_filled_redirect_provider
	 *
	 * @param string $old_url         The origin url.
	 * @param string $new_url         The url to redirect to.
	 * @param int    $type            Type of the redirect.
	 *
	 * @covers WPSEO_Redirect_Validation_Presence::run
	 * @covers WPSEO_Redirect_Validation_Presence::get_error
	 */
	public function test_validate_filled_correctly( $old_url, $new_url, $type ) {
		$this->assertTrue(
			$this->class_instance->run(
				new WPSEO_Redirect( $old_url , $new_url, $type )
			)
		);
	}

	/**
	 * Validate the fields not being filled properly.
	 *
	 * @dataProvider validate_wrong_filled_redirect_provider
	 *
	 * @param string $old_url         The origin url.
	 * @param string $new_url         The url to redirect to.
	 * @param int    $type            Type of the redirect.
	 *
	 * @covers WPSEO_Redirect_Validation_Presence::run
	 * @covers WPSEO_Redirect_Validation_Presence::get_error
	 */
	public function test_validate_filled( $old_url, $new_url, $type ) {
		$this->assertFalse(
			$this->class_instance->run(
				new WPSEO_Redirect( $old_url , $new_url, $type )
			)
		);
		$this->assertEquals(
			new WPSEO_Validation_Error( 'Not all the required fields are filled.' ),
			$this->class_instance->get_error()
		);
	}

	/**
	 * Provide array with redirects which are filled correctly
	 *
	 * @return array
	 */
	public function validate_filled_redirect_provider() {
		return array(
			array( 'old_410_url', '', '410' ),
			array( 'origin', 'target_url_filled', '301' ),
		);
	}

	/**
	 * Provide array with redirects which aren't filled properly
	 *
	 * @return array
	 */
	public function validate_wrong_filled_redirect_provider() {
		return array(
			array( '', '', '410' ),
			array( '', 'target_url_filled', '301' ),
		);
	}

}
