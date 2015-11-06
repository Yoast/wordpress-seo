<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the url redirect validation.
 */
class WPSEO_Redirect_URL_Validator_Test extends WPSEO_UnitTestCase {

	/**
	 * This variable is instantiated in setUp() and is a mock object. This is used for future use in the tests
	 *
	 * @var WPSEO_Redirect_URL_Validator
	 */
	protected $class_instance;

	/**
	 * Setting the instance
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Redirect_URL_Validator(
			array(
				'old_url' => array(
					'type' => 301,
					'url'  => 'new_url',
				),
				'older_url' => array(
					'type' => 301,
					'url'  => 'newer_url',
				),
			)
		);
	}

	/**
	 * Test with redirects which don't exists already. Resulting in no validation errors
	 *
	 * @dataProvider new_redirect_provider
	 *
	 * @param string $old_url The origin url.
	 * @param string $new_url The url to redirect to.
	 * @param int    $type    Type of the redirect.
	 *
	 * @covers WPSEO_Redirect_URL_Validator::validate
	 */
	public function test_validate( $old_url, $new_url, $type ) {
		$this->assertFalse( $this->class_instance->validate( $old_url, $new_url, $type ) );
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
	 * @covers       WPSEO_Redirect_URL_Validator::validate_redirect_exists
	 */
	public function test_validate_redirect_exists_unique( $old_url, $new_url, $type, $unique_url ) {
		$this->assertTrue( $this->class_instance->validate( $old_url, $new_url, $type, $unique_url ) );
		$this->assertTrue( $this->class_instance->has_error() );
		$this->assertEquals( 'The old url already exists as a redirect', $this->class_instance->get_error() );
	}

	/**
	 * Test with redirects which do exists already in non unique url modues. This is the case when redirects are being
	 * edited. The result will be false, because there are no validaiton errors
	 *
	 * @dataProvider existing_redirect_provider
	 *
	 * @param string $old_url The origin url.
	 * @param string $new_url The url to redirect to.
	 * @param int    $type    Type of the redirect.
	 *
	 * @covers WPSEO_Redirect_URL_Validator::validate_redirect_exists
	 */
	public function test_validate_redirect_exists_not_unique( $old_url, $new_url, $type ) {
		$this->assertFalse( $this->class_instance->validate( $old_url, $new_url, $type, $old_url ) );
		$this->assertFalse( $this->class_instance->has_error() );
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
	 * @covers WPSEO_Redirect_URL_Validator::validate_filled
	 */
	public function test_validate_filled( $old_url, $new_url, $type ) {
		$this->assertTrue( $this->class_instance->validate( $old_url, $new_url, $type ) );
		$this->assertTrue( $this->class_instance->has_error() );
		$this->assertEquals( 'Not all the required fields are filled', $this->class_instance->get_error() );
	}

	/**
	 * Validate the field being fields in case of a 410 redirect type. In case of 410 the new_url doesn't have to be
	 * filled
	 *
	 * @covers WPSEO_Redirect_URL_Validator::validate_filled
	 */
	public function test_validate_filled_410( ) {
		$this->assertFalse( $this->class_instance->validate( 'old_410_url', '', 410 ) );
		$this->assertFalse( $this->class_instance->has_error() );
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be the home_url that should be accessible
	 *
	 * @covers WPSEO_Redirect_URL_Validator::validate_accessible
	 */
	public function test_validate_accessible( ) {
		$this->assertFalse( $this->class_instance->validate( 'accessible_url', home_url(), 301 ) );
		$this->assertFalse( $this->class_instance->has_error() );
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be a unexisting url that should give a 404 response.
	 *
	 * @covers WPSEO_Redirect_URL_Validator::validate_accessible
	 */
	public function test_validate_not_accessible( ) {
		$this->assertTrue( $this->class_instance->validate( 'accessible_url', home_url( 'not_accessible' ), 301 ) );
		$this->assertTrue( $this->class_instance->has_error() );
		$this->assertContains( 'The URL you entered returned a HTTP code different than 200(OK). The received HTTP code is ', $this->class_instance->get_error() );
	}

	/**
	 * Validate if the target URL is accessible, in this test it will be a 410 redirect, that doesn't have an endpoint.
	 *
	 * @covers WPSEO_Redirect_URL_Validator::validate_accessible
	 */
	public function test_validate_accessible_410( ) {
		$this->assertFalse( $this->class_instance->validate( 'accessible_url', '', 410 ) );
		$this->assertFalse( $this->class_instance->has_error() );
	}

	/**
	 * Validate if the end point result in a redirectloop. In this case there won't be a loop.
	 *
	 * @covers WPSEO_Redirect_URL_Validator::validate_end_point
	 */
	public function test_validate_end_point( ) {
		$this->assertFalse( $this->class_instance->validate( 'end_url', 'ending_point', 301 ) );
		$this->assertFalse( $this->class_instance->has_error() );
	}

	/**
	 * Validate if the end point result in a redirect loop. In this case the redirect is a 410.
	 *
	 * @covers WPSEO_Redirect_URL_Validator::validate_end_point
	 */
	public function test_validate_end_point_410( ) {
		$this->assertFalse( $this->class_instance->validate( 'end_url', '', 410 ) );
		$this->assertFalse( $this->class_instance->has_error() );
	}

	/**
	 * Validate if the end point result in a redirect loop
	 *
	 * @covers WPSEO_Redirect_URL_Validator::validate_end_point
	 */
	public function test_validate_end_point_redirect_loop( ) {
		$this->assertTrue( $this->class_instance->validate( 'newer_url', 'older_url', 301 ) );
		$this->assertTrue( $this->class_instance->has_error() );
		$this->assertEquals( 'There might be a redirect loop.', $this->class_instance->get_error() );
	}


	/**
	 * Validate if the redirect can be done directly to an endpoint.
	 *
	 * @covers WPSEO_Redirect_URL_Validator::validate_end_point
	 */
	public function test_validate_end_point_direct_redirect( ) {
		$this->assertTrue( $this->class_instance->validate( 'newest_url', 'older_url', 301 ) );
		$this->assertTrue( $this->class_instance->has_error() );
		$this->assertEquals( "older_url will be redirected to newer_url. Maybe it's worth considering to create a direct redirect to newer_url.", $this->class_instance->get_error() );
	}

	/**
	 * Provide an array with non existing redirects
	 *
	 * @return array
	 */
	public function new_redirect_provider() {
		return array(
			array( 'that_page', 'this_page', 301 ),
			array( 'current_page', 'this_page', 301 ),
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
			array( '', '', '' ),
			array( 'old_url_filled', '', '' ),
			array( '', 'target_url_filled', '' ),
			array( '', '', '301' ),
		);
	}

}
