<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect
 */
class WPSEO_Redirect_Test extends WPSEO_UnitTestCase {

	/**
	 * Test if constructor works
	 *
	 * @covers WPSEO_Redirect::__construct
	 * @covers WPSEO_Redirect::get_origin
	 * @covers WPSEO_Redirect::get_target
	 * @covers WPSEO_Redirect::get_type
	 * @covers WPSEO_Redirect::get_format
	 */
	public function test_construct() {

		$redirect = new WPSEO_Redirect( 'origin', 'target', 301, 'plain' );

		$this->assertEquals( '/origin', $redirect->get_origin() );
		$this->assertEquals( '/target', $redirect->get_target() );
		$this->assertEquals( 301,      $redirect->get_type() );
		$this->assertEquals( 'plain',  $redirect->get_format() );
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
		$this->assertEquals( '/target', $redirect->get_target() );
		$this->assertEquals( 307,      $redirect->get_type() );
		$this->assertEquals( 'regex',  $redirect->get_format() );
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

		$this->assertEquals( '/origin', $redirect->get_origin() );
		$this->assertEquals( '/target', $redirect->get_target() );
		$this->assertEquals( 301,      $redirect->get_type() );
		$this->assertEquals( 'plain',  $redirect->get_format() );
	}

	/**
	 * Test how construct deals with a 410 redirect and a target given
	 *
	 * @covers WPSEO_Redirect::__construct
	 *
	 * @expectedException        InvalidArgumentException
	 * @expectedExceptionMessage Target cannot be empty for a 301 redirect.
	 */
	public function test_construct_target_exception() {
		new WPSEO_Redirect( 'origin', '', WPSEO_Redirect::PERMANENT );
	}

	/**
	 * Testing the getters
	 *
	 * @covers WPSEO_Redirect::get_origin
	 * @covers WPSEO_Redirect::get_target
	 * @covers WPSEO_Redirect::get_type
	 * @covers WPSEO_Redirect::get_format
	 * @covers WPSEO_Redirect::get_validation_error
	 */
	public function test_getters() {
		$redirect = new WPSEO_Redirect( 'origin', 'target', 301, 'plain' );

		$this->assertEquals( '/origin', $redirect->get_origin() );
		$this->assertEquals( '/target', $redirect->get_target() );
		$this->assertEquals( 301,      $redirect->get_type() );
		$this->assertEquals( 'plain',  $redirect->get_format() );
		$this->assertEquals( '',  $redirect->get_validation_error() );
	}

	/**
	 * Test the validation method for the redirect
	 *
	 * @covers WPSEO_Redirect::is_valid
	 */
	public function test_is_valid() {
		$redirect = new WPSEO_Redirect( 'old_url', 'new_url', 301 );

		$this->assertTrue( $redirect->is_valid() );
		$this->assertTrue( $redirect->is_valid( 'old_url' ) );
	}

	/**
	 * Test the validation method with a validation_error
	 *
	 * @covers WPSEO_Redirect::is_valid
	 * @covers WPSEO_Redirect::get_validation_error
	 */
	public function test_is_valid_error() {
		$redirect = new WPSEO_Redirect( '', 'new_url', 301 );

		$this->assertFalse( $redirect->is_valid() );
		$this->assertEquals( 'Not all the required fields are filled', $redirect->get_validation_error() );
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

		$this->assertEquals( '/target', $redirect['url'] );
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

		$this->assertEquals( '/target', $redirect->get_target() );
	}

}
