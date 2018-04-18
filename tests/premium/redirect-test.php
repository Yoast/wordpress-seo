<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for testing WPSEO_Redirect
 *
 * @group redirects
 */
class WPSEO_Redirect_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the instantiation of a redirect on a subdirectory installation.
	 *
	 * @dataProvider redirect_provider_for_subdirectory_installation
	 *
	 * @param array  $redirect        The redirect.
	 * @param string $expected_origin The expected origin.
	 * @param string $expected_target The expected target.
	 */
	public function test_redirect_on_subdirectory_installation( array $redirect, $expected_origin, $expected_target ) {
		$old_home = get_option( 'home' );
		update_option( 'home', 'http://example.org/blog' );

		$redirect = new WPSEO_Redirect( $redirect['origin'], $redirect['target'], 301, 'plain' );

		$this->assertEquals( $expected_origin, $redirect->get_origin() );
		$this->assertEquals( $expected_target, $redirect->get_target() );

		update_option( 'home', $old_home );
	}

	/**
	 * Provider for testing a redirect when a blog is installed in a subdirectory.
	 *
	 * @return array The redirects to test.
	 */
	public function redirect_provider_for_subdirectory_installation() {
		$redirects =  array(
			array(
				'redirect'        => array(
					'origin' => 'http://example.org/blog/origin',
					'target' => 'http://example.org/blog/target',
				),
				'expected_origin' => 'origin',
				'expected_target' => 'blog/target',
			),
			array(
				'redirect'        => array(
					'origin' => 'origin',
					'target' => 'https://example.org/blog/target',
				),
				'expected_origin' => 'origin',
				'expected_target' => 'blog/target',
			),
			array(
				'redirect'        => array(
					'origin' => 'blog/origin',
					'target' => 'http://example.org/blog/target',
				),
				'expected_origin' => 'blog/origin',
				'expected_target' => 'blog/target',
			),
			array(
				'redirect'        => array(
					'origin' => 'origin',
					'target' => 'http://example.org/blog/target',
				),
				'expected_origin' => 'origin',
				'expected_target' => 'blog/target',
			),
		);

		return $redirects;
	}

	/**
	 * Tests the instantiation of a redirect on a subdomain installation.
	 */
	public function test_redirect_on_subdomain_installation() {
		$old_home = get_option( 'home' );
		update_option( 'home', 'http://blog.example.org' );

		$redirect = new WPSEO_Redirect(
			'origin',
			'http://blog.example.org/blog/target',
			301,
			'plain'
		);

		$this->assertEquals( 'origin', $redirect->get_origin() );
		$this->assertEquals( 'blog/target', $redirect->get_target() );

		update_option( 'home', $old_home );
	}

	/**
	 * Test if constructor works
	 *
	 * @covers WPSEO_Redirect::__construct
	 * @covers WPSEO_Redirect::get_origin
	 * @covers WPSEO_Redirect::get_target
	 * @covers WPSEO_Redirect::get_type
	 * @covers WPSEO_Redirect::get_format
	 */
	public function test_construct_relative_url() {

		$redirect = new WPSEO_Redirect( 'origin', 'target', 301, 'plain' );

		$this->assertEquals( 'origin', $redirect->get_origin() );
		$this->assertEquals( 'target', $redirect->get_target() );
		$this->assertEquals( 301, $redirect->get_type() );
		$this->assertEquals( 'plain', $redirect->get_format() );
	}

	/**
	 * Test if constructor does not sanitize absolute URLs
	 *
	 * @covers WPSEO_Redirect::__construct
	 * @covers WPSEO_Redirect::get_origin
	 * @covers WPSEO_Redirect::get_target
	 * @covers WPSEO_Redirect::get_type
	 * @covers WPSEO_Redirect::get_format
	 */
	public function test_construct_absolute_url() {
		$redirect = new WPSEO_Redirect( 'origin', 'https://yoast.com/', 301, 'plain' );

		$this->assertEquals( 'origin', $redirect->get_origin() );
		$this->assertEquals( 'https://yoast.com/', $redirect->get_target() );
		$this->assertEquals( 301, $redirect->get_type() );
		$this->assertEquals( 'plain', $redirect->get_format() );
	}

	/**
	 * Test if constructor works
	 *
	 * @covers WPSEO_Redirect::__construct
	 * @covers WPSEO_Redirect::get_origin
	 * @covers WPSEO_Redirect::get_target
	 * @covers WPSEO_Redirect::get_type
	 * @covers WPSEO_Redirect::get_format
	 */
	public function test_construct_regex() {

		$redirect = new WPSEO_Redirect( 'origin', 'target', 307, 'regex' );

		$this->assertEquals( 'origin', $redirect->get_origin() );
		$this->assertEquals( 'target', $redirect->get_target() );
		$this->assertEquals( 307, $redirect->get_type() );
		$this->assertEquals( 'regex', $redirect->get_format() );
	}

	/**
	 * Test how constructor deals with the defaults
	 *
	 * @covers WPSEO_Redirect::__construct
	 * @covers WPSEO_Redirect::get_origin
	 * @covers WPSEO_Redirect::get_target
	 * @covers WPSEO_Redirect::get_type
	 * @covers WPSEO_Redirect::get_format
	 */
	public function test_construct_defaults() {
		$redirect = new WPSEO_Redirect( 'origin', 'target' );

		$this->assertEquals( 'origin', $redirect->get_origin() );
		$this->assertEquals( 'target', $redirect->get_target() );
		$this->assertEquals( 301, $redirect->get_type() );
		$this->assertEquals( 'plain', $redirect->get_format() );
	}

	/**
	 * Testing the getters
	 *
	 * @covers WPSEO_Redirect::get_origin
	 * @covers WPSEO_Redirect::get_target
	 * @covers WPSEO_Redirect::get_type
	 * @covers WPSEO_Redirect::get_format
	 */
	public function test_getters() {
		$redirect = new WPSEO_Redirect( 'origin', 'target', 301, 'plain' );

		$this->assertEquals( 'origin', $redirect->get_origin() );
		$this->assertEquals( 'target', $redirect->get_target() );
		$this->assertEquals( 301, $redirect->get_type() );
		$this->assertEquals( 'plain', $redirect->get_format() );
	}

	/**
	 * Testing the method used to check if a given url is equal to the redirect's origin.
	 *
	 * @covers WPSEO_Redirect::origin_is
	 */
	public function test_origin_is() {
		$redirect = new WPSEO_Redirect( 'origin', 'target', 301, 'plain' );

		$this->assertTrue( $redirect->origin_is( 'origin' ) );
		$this->assertTrue( $redirect->origin_is( 'origin/' ) );
		$this->assertTrue( $redirect->origin_is( '/origin/' ) );
		$this->assertFalse( $redirect->origin_is( 'foo' ) );
	}

	/**
	 * Test the result of offsetExists, this methods deals with backwards compatibility when called isset on the object.
	 *
	 * @covers WPSEO_Redirect::offsetExists
	 */
	public function test_offsetExists() {
		$redirect = new WPSEO_Redirect( 'origin', 'target', 301, 'plain' );

		$this->assertTrue( isset( $redirect['url'] ) );
		$this->assertTrue( isset( $redirect['type'] ) );
		$this->assertTrue( ! empty( $redirect['url'] ) );
		$this->assertTrue( ! empty( $redirect['type'] ) );

		$this->assertFalse( isset( $redirect['origin'] ) );
		$this->assertFalse( isset( $redirect['target'] ) );
	}

	/**
	 * Test the result of offsetGet, this methods deals with backwards compatibility when object is accessed as array
	 *
	 * @covers WPSEO_Redirect::offsetGet
	 */
	public function test_offsetGet() {
		$redirect = new WPSEO_Redirect( 'origin', 'target', 301, 'plain' );

		$this->assertEquals( 'target', $redirect['url'] );
		$this->assertEquals( 301, $redirect['type'] );

		$this->assertEquals( null, $redirect['origin'] );
		$this->assertEquals( null, $redirect['target'] );
	}

	/**
	 * Test the result of offsetSet, this methods deals with backwards compatibility when object is accessed as array
	 *
	 * @covers WPSEO_Redirect::offsetSet
	 */
	public function test_offsetSet() {
		$redirect = new WPSEO_Redirect( 'origin', 'target', 301, 'plain' );

		$redirect['url']  = 'set_target';
		$redirect['type'] = 'set_type';

		$this->assertEquals( 'set_target', $redirect->get_target() );
		$this->assertEquals( 'set_type', $redirect->get_type() );
	}

	/**
	 * Test the result of offsetUnset, this method shouldn't do anything.
	 *
	 * @covers WPSEO_Redirect::offsetSet
	 */
	public function test_offsetUnset() {
		$redirect = new WPSEO_Redirect( 'origin', 'target', 301, 'plain' );

		unset( $redirect['url'] );

		$this->assertEquals( 'target', $redirect->get_target() );
	}

	/**
	 * Tests the result of using absolute URLs that point to the home url.
	 *
	 * @covers WPSEO_Redirect::sanitize_origin_url
	 */
	public function test_blog_url_to_relative_url() {
		$blog_url = get_home_url();
		$redirect = new WPSEO_Redirect( $blog_url . '/origin', $blog_url . '/target', 301, 'plain' );

		$this->assertEquals( 'origin', $redirect->get_origin() );
		$this->assertEquals( 'target', $redirect->get_target() );
	}

	/**
	 * Tests the result of a subdomain being used as the target.
	 *
	 * @covers WPSEO_Redirect::sanitize_origin_url
	 */
	public function test_subdomain_remains_unaffected() {
		$blog_url  = 'http://example.org/';
		$subdomain = 'http://sub.example.org/';

		$redirect = new WPSEO_Redirect( $blog_url, $subdomain, 301, 'plain' );

		$this->assertEquals( $redirect->get_target(), $subdomain );
	}
}
