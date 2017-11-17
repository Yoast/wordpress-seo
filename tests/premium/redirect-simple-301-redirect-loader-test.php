<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for the simple 301 redirect loader.
 *
 * @covers WPSEO_Redirect_Simple_301_Redirect_Loader
 */
class WPSEO_Redirect_Simple_301_Redirect_Loader_Test extends WPSEO_UnitTestCase {
	/**
	 * Tests loading Simple 301 Redirects without wildcards.
	 */
	public function test_simple_load() {
		add_option( '301_redirects', array(
			'/origin1' => '/target1',
			'/origin2' => '/target2',
		) );

		$instance  = new WPSEO_Redirect_Simple_301_Redirect_Loader();
		$redirects = $instance->load();

		$this->assertCount( 2, $redirects );

		foreach ( $redirects as $redirect ) {
			$this->assertInstanceOf( 'WPSEO_Redirect', $redirect );
			$this->assertEquals( WPSEO_Redirect::PERMANENT, $redirect->get_type() );
			$this->assertEquals( WPSEO_Redirect::FORMAT_PLAIN, $redirect->get_format() );
		}

		delete_option( '301_redirects' );
	}

	/**
	 * Tests loading Simple 301 Redirects with wildcards.
	 */
	public function test_wildcard_load() {
		add_option( '301_redirects_wildcard', true );
		add_option( '301_redirects', array(
			'/origin'    => '/target',
			'/wildcard*' => '/target',
		) );

		$instance  = new WPSEO_Redirect_Simple_301_Redirect_Loader();
		$redirects = $instance->load();

		$this->assertCount( 2, $redirects );

		foreach ( $redirects as $redirect ) {
			$this->assertInstanceOf( 'WPSEO_Redirect', $redirect );
			$this->assertEquals( WPSEO_Redirect::PERMANENT, $redirect->get_type() );
		}
		$this->assertEquals( WPSEO_Redirect::FORMAT_PLAIN, $redirects[0]->get_format() );
		$this->assertEquals( WPSEO_Redirect::FORMAT_REGEX, $redirects[1]->get_format() );

		delete_option( '301_redirects' );
		delete_option( '301_redirects_wildcard' );
	}
}
