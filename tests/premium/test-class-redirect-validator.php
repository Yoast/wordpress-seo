<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the url redirect validation.
 *
 * @covers WPSEO_Redirect_Validator
 */
class WPSEO_Redirect_Validator_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Validator
	 */
	private $class_instance;

	/**
	 * Setting the instance
	 */
	public function setUp() {
		parent::setUp();

		$redirect_option = new WPSEO_Redirect_Option();
		$redirect_option->set_format( WPSEO_Redirect::FORMAT_PLAIN );
		$redirect_option->add( new WPSEO_Redirect( 'old_url', 'new_url', 301 ) );
		$redirect_option->add( new WPSEO_Redirect( 'older_url', 'newer_url', 301 ) );
		$redirect_option->save();

		$this->class_instance = new WPSEO_Redirect_Validator();
	}

	/**
	 * Remove the option on tear down.
	 */
	public function tearDown() {
		// Clear the option to be sure there are no redirects.
		delete_option( WPSEO_Redirect_Option::OPTION );
	}

	/**
	 * Test with redirects which don't exists already. Resulting in no validation errors
	 *
	 * @dataProvider redirect_provider
	 *
	 * @param string $origin The origin url.
	 * @param string $target Target url.
	 * @param int    $type   Type of the redirect.
	 * @param string $old_origin The old origin, when empty the redirect is new.
	 *
	 * @covers       WPSEO_Redirect_Validator::validate
	 */
	public function test_validate( $origin, $target, $type, $old_origin ) {
		$this->assertTrue(
			$this->class_instance->validate(
				new WPSEO_Redirect( $origin, $target, $type ),
				new WPSEO_Redirect( $old_origin, $target, $type )
			)
		);
	}

	/**
	 * Test with redirects which don't exists already. Resulting in no validation errors
	 *
	 * @dataProvider faulthy_redirect_provider
	 *
	 * @param string $origin     The origin url.
	 * @param string $target     Target url.
	 * @param int    $type       Type of the redirect.
	 * @param string $old_origin The old origin, when empty the redirect is new.
	 *
	 * @covers       WPSEO_Redirect_Validator::validate
	 * @covers       WPSEO_Redirect_Validator::get_error
	 */
	public function test_validate_invalid( $origin, $target, $type, $old_origin ) {
		$this->assertFalse(
			$this->class_instance->validate(
				new WPSEO_Redirect( $origin, $target, $type ),
				new WPSEO_Redirect( $old_origin, $target, $type )
			)
		);

		$this->assertNotEmpty( $this->class_instance->get_error() );
	}

	/**
	 * Provide faulthy redirect that shouldn't pass the validation.
	 *
	 * @return array
	 */
	public function faulthy_redirect_provider() {
		return array(
			array( 'old_url', 'my_old_url', 301, 'oldest_url' ),								// Redirect should be unique.
			array( 'older_url', 'my_older_url', 301, 'oldest_url' ),    						// Redirect should be unique.
			array( '', 'not_filled', '', '' ),													// Origin is not filled.
			array( '', 'not_filled', 410, '' ),													// Origin is not filled.
			array( '', '', 410, '' ),															// Origin is not filled.
			array( 'accessible_url', 'http://example.com/this/path/does/not/exist', 301, '' ),  // Page is not accessible.
			array( 'newer_url', 'older_url', 301, '' ),											// Will be a redirect loop.
			array( 'newest_url', 'older_url', 301, '' ),										// Redirect path can be shorter.
		);
	}

	/**
	 * Provide an array with non existing redirects
	 *
	 * @return array
	 */
	public function redirect_provider() {
		return array(
			array( 'old_url', 'my_old_url', 301, 'old_url' ),
			array( 'that_page', '/', 301, '' ),
			array( 'current_page', '/', 301, '' ),
			array( 'deleted-page', '', 410, '' ),
			array( 'accessible_url', home_url(), 301, '' ),
			array( 'accessible_url', '', 410, '' ),
			array( 'accessible_url', 'fake://domain.com/', 301, '' ), // Will give a wrning.
			array( 'end_url', 'ending_point', 301, '' ),
			array( 'end_url', '', 410, '' ),
		);
	}

}
