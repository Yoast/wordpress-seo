<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for the safe redirect loader.
 *
 * @covers WPSEO_Redirect_Safe_Redirect_Loader
 */
class WPSEO_Redirect_Safe_Redirect_Loader_Test extends WPSEO_UnitTestCase {
	/**
	 * Tests loading Safe Redirect Manager redirects without wildcards or regexes.
	 */
	public function test_simple_load() {
		set_transient( '_srm_redirects', array(
			array(
				'redirect_from' => '/origin1',
				'redirect_to'   => '/target1',
				'status_code'   => 301,
				'enable_regex'  => 0,
			),
			array(
				'redirect_from' => '/origin2',
				'redirect_to'   => '/target2',
				'status_code'   => 301,
				'enable_regex'  => 0,
			),
		) );

		$instance  = new WPSEO_Redirect_Safe_Redirect_Loader();
		$redirects = $instance->load();

		$this->assertCount( 2, $redirects );

		foreach ( $redirects as $redirect ) {
			$this->assertInstanceOf( 'WPSEO_Redirect', $redirect );
			$this->assertEquals( WPSEO_Redirect::PERMANENT, $redirect->get_type() );
			$this->assertEquals( WPSEO_Redirect::FORMAT_PLAIN, $redirect->get_format() );
		}
		$this->assertEquals( 'origin1', $redirects[0]->get_origin() );
		$this->assertEquals( 'target1', $redirects[0]->get_target() );

		$this->assertEquals( 'origin2', $redirects[1]->get_origin() );
		$this->assertEquals( 'target2', $redirects[1]->get_target() );

		delete_transient( '_srm_redirects' );
	}

	/**
	 * Tests loading Safe Redirect Manager redirects with wildcards.
	 */
	public function test_wildcard_load() {
		set_transient( '_srm_redirects', array(
			array(
				'redirect_from' => '/origin',
				'redirect_to'   => '/target',
				'status_code'   => 301,
				'enable_regex'  => 0,
			),
			array(
				'redirect_from' => '/wildcard*',
				'redirect_to'   => '/target',
				'status_code'   => 301,
				'enable_regex'  => 0,
			),
		) );

		$instance  = new WPSEO_Redirect_Safe_Redirect_Loader();
		$redirects = $instance->load();

		$this->assertCount( 2, $redirects );

		foreach ( $redirects as $redirect ) {
			$this->assertInstanceOf( 'WPSEO_Redirect', $redirect );
			$this->assertEquals( WPSEO_Redirect::PERMANENT, $redirect->get_type() );
		}
		$this->assertEquals( 'origin', $redirects[0]->get_origin() );
		$this->assertEquals( 'target', $redirects[0]->get_target() );
		$this->assertEquals( WPSEO_Redirect::FORMAT_PLAIN, $redirects[0]->get_format() );

		$this->assertEquals( '/wildcard.*', $redirects[1]->get_origin() );
		$this->assertEquals( 'target', $redirects[1]->get_target() );
		$this->assertEquals( WPSEO_Redirect::FORMAT_REGEX, $redirects[1]->get_format() );

		delete_transient( '_srm_redirects' );
	}

	/**
	 * Tests loading Safe Redirect Manager redirects with regexes.
	 */
	public function test_regex_load() {
		set_transient( '_srm_redirects', array(
			array(
				'redirect_from' => '/origin',
				'redirect_to'   => '/target',
				'status_code'   => 301,
				'enable_regex'  => 0,
			),
			array(
				'redirect_from' => '/regex\d+',
				'redirect_to'   => '/target',
				'status_code'   => 301,
				'enable_regex'  => 1,
			),
		) );

		$instance  = new WPSEO_Redirect_Safe_Redirect_Loader();
		$redirects = $instance->load();

		$this->assertCount( 2, $redirects );

		foreach ( $redirects as $redirect ) {
			$this->assertInstanceOf( 'WPSEO_Redirect', $redirect );
			$this->assertEquals( WPSEO_Redirect::PERMANENT, $redirect->get_type() );
		}
		$this->assertEquals( 'origin', $redirects[0]->get_origin() );
		$this->assertEquals( 'target', $redirects[0]->get_target() );
		$this->assertEquals( WPSEO_Redirect::FORMAT_PLAIN, $redirects[0]->get_format() );

		$this->assertEquals( '/regex\d+', $redirects[1]->get_origin() );
		$this->assertEquals( 'target', $redirects[1]->get_target() );
		$this->assertEquals( WPSEO_Redirect::FORMAT_REGEX, $redirects[1]->get_format() );

		delete_transient( '_srm_redirects' );
	}

	/**
	 * Tests loading Safe Redirect Manager redirects with status codes that need conversion.
	 */
	public function test_status_code_conversion_load() {
		set_transient( '_srm_redirects', array(
			array(
				'redirect_from' => '/origin1',
				'redirect_to'   => '/target1',
				'status_code'   => 303,
				'enable_regex'  => 0,
			),
			array(
				'redirect_from' => '/origin2',
				'redirect_to'   => '/target2',
				'status_code'   => 403,
				'enable_regex'  => 0,
			),
			array(
				'redirect_from' => '/origin2',
				'redirect_to'   => '/target2',
				'status_code'   => 404,
				'enable_regex'  => 0,
			),
		) );

		$instance  = new WPSEO_Redirect_Safe_Redirect_Loader();
		$redirects = $instance->load();

		$this->assertCount( 3, $redirects );

		foreach ( $redirects as $redirect ) {
			$this->assertInstanceOf( 'WPSEO_Redirect', $redirect );
			$this->assertEquals( WPSEO_Redirect::FORMAT_PLAIN, $redirect->get_format() );
		}
		$this->assertEquals( WPSEO_Redirect::FOUND, $redirects[0]->get_type() );
		$this->assertEquals( WPSEO_Redirect::DELETED, $redirects[1]->get_type() );
		$this->assertEquals( WPSEO_Redirect::DELETED, $redirects[2]->get_type() );

		delete_transient( '_srm_redirects' );
	}

	/**
	 * Tests loading Safe Redirect Manager redirects with bad status codes.
	 */
	public function test_bad_status_code_load() {
		set_transient( '_srm_redirects', array(
			array(
				'redirect_from' => '/origin1',
				'redirect_to'   => '/target1',
				'status_code'   => 301,
				'enable_regex'  => 0,
			),
			array(
				'redirect_from' => '/origin2',
				'redirect_to'   => '/target2',
				'status_code'   => 9000,
				'enable_regex'  => 0,
			),
		) );

		$instance  = new WPSEO_Redirect_Safe_Redirect_Loader();
		$redirects = $instance->load();

		$this->assertCount( 1, $redirects );

		delete_transient( '_srm_redirects' );
	}
}
