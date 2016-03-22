<?php

/**
 * @group test
 */
class WPSEO_Redirect_Util_Test extends \PHPUnit_Framework_TestCase {
	/**
	 * @var string
	 */
	protected $permalink_structure;

	public function setUp() {
		$this->permalink_structure = get_option( 'permalink_structure' );
		WPSEO_Redirect_Util::$has_permalink_trailing_slash = null;
	}

	public function tearDown() {
		update_option( 'permalink_structure', $this->permalink_structure );
	}

	public function test_is_relative_url() {
		$this->assertFalse( WPSEO_Redirect_Util::is_relative_url( 'http://yoast.com' ) );
		$this->assertFalse( WPSEO_Redirect_Util::is_relative_url( 'http://yoast.com/?param=val' ) );
		$this->assertTrue( WPSEO_Redirect_Util::is_relative_url( '/relative/?param=val' ) );
		$this->assertTrue( WPSEO_Redirect_Util::is_relative_url( '/relative?param=val' ) );
		$this->assertTrue( WPSEO_Redirect_Util::is_relative_url( '/' ) );
		$this->assertTrue( WPSEO_Redirect_Util::is_relative_url( '/relative/' ) );
		$this->assertTrue( WPSEO_Redirect_Util::is_relative_url( '/relative' ) );
		$this->assertTrue( WPSEO_Redirect_Util::is_relative_url( '/relative#hash' ) );
		$this->assertTrue( WPSEO_Redirect_Util::is_relative_url( '/relative/#hash' ) );
	}

	public function test_has_no_query_parameters() {
		$this->assertFalse( WPSEO_Redirect_Util::has_query_parameters( 'http://yoast.com' ) );
		$this->assertTrue( WPSEO_Redirect_Util::has_query_parameters( 'http://yoast.com/?param=val' ) );
		$this->assertTrue( WPSEO_Redirect_Util::has_query_parameters( '/relative/?param=val' ) );
		$this->assertTrue( WPSEO_Redirect_Util::has_query_parameters( '/relative?param=val' ) );
		$this->assertFalse( WPSEO_Redirect_Util::has_query_parameters( '/' ) );
		$this->assertFalse( WPSEO_Redirect_Util::has_query_parameters( '/relative/' ) );
		$this->assertFalse( WPSEO_Redirect_Util::has_query_parameters( '/relative' ) );
	}

	public function test_has_permalink_trailing_slash() {
		update_option( 'permalink_structure', '/%postname%/' );

		$this->assertTrue( WPSEO_Redirect_Util::has_permalink_trailing_slash() );

		update_option( 'permalink_structure', '/%postname%' );
		WPSEO_Redirect_Util::$has_permalink_trailing_slash = null;

		$this->assertFalse( WPSEO_Redirect_Util::has_permalink_trailing_slash() );

		// Test the caching
		update_option( 'permalink_structure', '/%postname%/' );
		$this->assertFalse( WPSEO_Redirect_Util::has_permalink_trailing_slash() );
	}

	public function test_url_has_fragment_identifier() {
		$this->assertFalse( WPSEO_Redirect_Util::has_fragment_identifier( 'http://yoast.com' ) );
		$this->assertFalse( WPSEO_Redirect_Util::has_fragment_identifier( 'http://yoast.com/?param=val' ) );
		$this->assertFalse( WPSEO_Redirect_Util::has_fragment_identifier( '/relative/?param=val' ) );
		$this->assertFalse( WPSEO_Redirect_Util::has_fragment_identifier( '/relative?param=val' ) );
		$this->assertFalse( WPSEO_Redirect_Util::has_fragment_identifier( '/' ) );
		$this->assertFalse( WPSEO_Redirect_Util::has_fragment_identifier( '/relative/' ) );
		$this->assertFalse( WPSEO_Redirect_Util::has_fragment_identifier( '/relative' ) );
		$this->assertTrue( WPSEO_Redirect_Util::has_fragment_identifier( '/relative/#hash' ) );
		$this->assertTrue( WPSEO_Redirect_Util::has_fragment_identifier( '/relative#hash' ) );
		$this->assertTrue( WPSEO_Redirect_Util::has_fragment_identifier( '/relative#' ) );
	}

	/**
	 * @covers WPSEO_Redirect_Util::requires_trailing_slash
	 */
	public function test_requires_trailing_slash() {
		update_option( 'permalink_structure', '/%postname%' );

		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( 'http://yoast.com' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( 'http://yoast.com/?param=val' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( '/relative/?param=val' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( '/relative?param=val' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( '/' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( '' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( '/relative/' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( '/relative' ) );

		update_option( 'permalink_structure', '/%postname%/' );
		WPSEO_Redirect_Util::$has_permalink_trailing_slash = null;
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( 'http://yoast.com' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( 'http://yoast.com/?param=val' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( '/relative/?param=val' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( '/relative?param=val' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( '/' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( '/relative/#hash' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( '/relative#hash' ) );
		$this->assertFalse( WPSEO_Redirect_Util::requires_trailing_slash( '/relative#' ) );
		$this->assertTrue( WPSEO_Redirect_Util::requires_trailing_slash( '' ) );
		$this->assertTrue( WPSEO_Redirect_Util::requires_trailing_slash( '/relative/' ) );
		$this->assertTrue( WPSEO_Redirect_Util::requires_trailing_slash( '/relative' ) );
	}
}
