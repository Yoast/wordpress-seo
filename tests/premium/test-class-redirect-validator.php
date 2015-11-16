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
	 * Setting the instance
	 */
	public function setUp() {
		parent::setUp();

		$redirect_option = new WPSEO_Redirect_Option();
		$redirect_option->set_format( WPSEO_Redirect::FORMAT_PLAIN );
		$redirect_option->add( new WPSEO_Redirect( 'old_url', 'new_url', 301 ) );
		$redirect_option->add( new WPSEO_Redirect( 'older_url', 'newer_url', 301 ) );
		$redirect_option->save();
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
	 * @dataProvider new_redirect_provider
	 *
	 * @param string $origin The origin url.
	 * @param string $target Target url.
	 * @param int    $type   Type of the redirect.
	 *
	 * @covers       WPSEO_Redirect_Validator::__construct()
	 * @covers       WPSEO_Redirect_Validator::validate
	 */
	public function test_validate( $origin, $target, $type ) {
		$validator = new WPSEO_Redirect_Validator(
			new WPSEO_Redirect( $origin, $target, $type )
		);

		$this->assertTrue( $validator->validate() );

	}

	/**
	 * Test with redirects which do exists already in unique_url modus. This is the case when redirects are added.
	 * The result will be true, because the redirect already exists.
	 *
	 * @dataProvider existing_redirect_provider
	 *
	 * @param string $old_url    The origin url.
	 * @param string $new_url    The url to redirect to.
	 * @param int    $type       Type of the redirect.
	 * @param bool   $unique_url Should it be a unique_url.
	 *
	 * @covers       WPSEO_Redirect_Validator::__construct()
	 * @covers       WPSEO_Redirect_Validator::validate_uniqueness
	 * @covers       WPSEO_Redirect_Validator::get_error
	 */
	public function test_validate_redirect_exists_unique( $old_url, $new_url, $type, $unique_url ) {

		$validator = new WPSEO_Redirect_Validator(
			new WPSEO_Redirect( $old_url, $new_url, $type ),
			WPSEO_Redirect::format_origin( $unique_url, WPSEO_Redirect::FORMAT_PLAIN )
		);

		$this->assertFalse( $validator->validate() );
		$this->assertEquals( 'The old url already exists as a redirect', $validator->get_error() );
	}

	/**
	 * Test with redirects which do exists already in non unique url modues. This is the case when redirects are being
	 * edited. The result will be false, because there are no validation errors
	 *
	 * @dataProvider existing_redirect_provider
	 *
	 * @param string $old_url The origin url.
	 * @param string $new_url The url to redirect to.
	 * @param int    $type    Type of the redirect.
	 *
	 * @covers WPSEO_Redirect_Validator::validate_uniqueness
	 */
	public function test_validate_redirect_exists_not_unique( $old_url, $new_url, $type ) {
		$redirect  = new WPSEO_Redirect( $old_url , $new_url, $type );
		$validator = new WPSEO_Redirect_Validator( $redirect, $redirect->get_origin() );

		$this->assertTrue( $validator->validate() );
	}

	/**
	 * Validate the fields being filled.
	 *
	 * @dataProvider validate_filled_redirect_provider
	 *
	 * @param string $old_url         The origin url.
	 * @param string $new_url         The url to redirect to.
	 * @param int    $type            Type of the redirect.
	 *
	 * @covers WPSEO_Redirect_Validator::validate_filled
	 * @covers WPSEO_Redirect_Validator::get_error
	 */
	public function test_validate_filled( $old_url, $new_url, $type ) {
		$validator = new WPSEO_Redirect_Validator(
			new WPSEO_Redirect( $old_url , $new_url, $type ),
			WPSEO_Redirect::format_origin( $old_url, WPSEO_Redirect::FORMAT_PLAIN )
		);

		$this->assertFalse( $validator->validate() );
		$this->assertEquals( 'Not all the required fields are filled', $validator->get_error() );
	}

	/**
	 * Validate the field being fields in case of a 410 redirect type. In case of 410 the new_url doesn't have to be
	 * filled
	 *
	 * @covers WPSEO_Redirect_Validator::validate_filled
	 * @covers WPSEO_Redirect_Validator::get_error
	 */
	public function test_validate_filled_410( ) {
		$redirect  = new WPSEO_Redirect( 'old_410_url' , '', 410 );
		$validator = new WPSEO_Redirect_Validator( $redirect, $redirect->get_origin() );

		$this->assertTrue( $validator->validate() );
		$this->assertFalse( $validator->get_error() );
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be the home_url that should be accessible
	 *
	 * @covers WPSEO_Redirect_Validator::validate_accessible
	 */
	public function test_validate_accessible( ) {
		$redirect  = new WPSEO_Redirect( 'accessible_url', home_url(), 301 );
		$validator = new WPSEO_Redirect_Validator( $redirect );

		$this->assertTrue( $validator->validate() );
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be a unexisting url that should give a 404 response.
	 *
	 * @covers WPSEO_Redirect_Validator::validate_accessible
	 */
	public function test_validate_not_accessible( ) {
		$redirect  = new WPSEO_Redirect( 'accessible_url', 'http://example.com/this/path/does/not/exist', 301 );
		$validator = new WPSEO_Redirect_Validator( $redirect );

		$this->assertFalse( $validator->validate() );
		$this->assertContains( 'The URL you entered returned a HTTP code different than 200(OK). The received HTTP code is ', $validator->get_error() );
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be a 410 redirect, that doesn't have an endpoint.
	 *
	 * @covers WPSEO_Redirect_Validator::validate_accessible
	 */
	public function test_validate_accessible_410( ) {
		$redirect  = new WPSEO_Redirect( 'accessible_url', '', 410 );
		$validator = new WPSEO_Redirect_Validator( $redirect );

		$this->assertTrue( $validator->validate( ) );
	}

	/**
	 * Validate if the end point result in a redirectloop. In this case there won't be a loop.
	 *
	 * @covers WPSEO_Redirect_Validator::validate_end_point
	 */
	public function test_validate_end_point( ) {
		$redirect  = new WPSEO_Redirect( 'end_url', 'ending_point', 301 );
		$validator = new WPSEO_Redirect_Validator( $redirect );

		$this->assertTrue( $validator->validate() );
	}

	/**
	 * Validate if the end point result in a redirect loop. In this case the redirect is a 410.
	 *
	 * @covers WPSEO_Redirect_Validator::validate_end_point
	 */
	public function test_validate_end_point_410( ) {
		$redirect  = new WPSEO_Redirect( 'end_url', '', 410 );
		$validator = new WPSEO_Redirect_Validator( $redirect );

		$this->assertTrue( $validator->validate( ) );
	}

	/**
	 * Validate if the end point result in a redirect loop
	 *
	 * @covers WPSEO_Redirect_Validator::validate_end_point
	 * @covers WPSEO_Redirect_Validator::get_error
	 */
	public function test_validate_end_point_redirect_loop( ) {
		$redirect  = new WPSEO_Redirect( 'newer_url', 'older_url', 301 );
		$validator = new WPSEO_Redirect_Validator( $redirect );

		$this->assertFalse( $validator->validate() );
		$this->assertEquals( 'There might be a redirect loop.', $validator->get_error() );
	}


	/**
	 * Validate if the redirect can be done directly to an endpoint.
	 *
	 * @covers WPSEO_Redirect_Validator::validate_end_point
	 * @covers WPSEO_Redirect_Validator::get_error
	 */
	public function test_validate_end_point_direct_redirect( ) {
		$redirect  = new WPSEO_Redirect( 'newest_url', 'older_url', 301 );
		$validator = new WPSEO_Redirect_Validator( $redirect );

		$this->assertFalse( $validator->validate() );
		$this->assertEquals( "older_url will be redirected to newer_url. Maybe it's worth considering to create a direct redirect to newer_url.", $validator->get_error() );
	}

	/**
	 * Provide an array with non existing redirects
	 *
	 * @return array
	 */
	public function new_redirect_provider() {
		return array(
			array( 'that_page', '/', 301 ),
			array( 'current_page', '/', 301 ),
		);
	}

	/**
	 * Provide array with redirects that already exists
	 *
	 * @return array
	 */
	public function existing_redirect_provider() {
		return array(
			array( 'old_url', 'my_old_url', 301, 'oldest_url' ),
			array( 'older_url', 'my_older_url', 301, 'oldest_url' ),
		);
	}

	/**
	 * Provide array with redirects that aren't filled properly
	 *
	 * @return array
	 */
	public function validate_filled_redirect_provider() {
		return array(
			array( '', '', '410' ),
			array( '', 'target_url_filled', '301' ),
		);
	}

}
