<?php
/**
 * @package    WPSEO
 * @subpackage Unittests
 */

class WPSEO_Utils_Test extends WPSEO_UnitTestCase {


	/**
	 * @covers WPSEO_Options::grant_access
	 */
	public function test_grant_access() {

		if ( is_multisite() ) {
			// should be true when not running multisite
			$this->assertTrue( WPSEO_Utils::grant_access() );
			return; // stop testing, not multisite
		}

		// admins should return true
		$user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $user_id );
		$this->assertTrue( WPSEO_Utils::grant_access() );

		// todo test for superadmins

		// editors should return false
		// $user_id = $this->factory->user->create( array( 'role' => 'editor' ) );
		// wp_set_current_user( $user_id );
		// $this->assertTrue( WPSEO_Options::grant_access() );
	}

	/**
	* @covers wpseo_is_apache()
	*/
	public function test_wpseo_is_apache() {
		$_SERVER['SERVER_SOFTWARE'] = 'Apache/2.2.22';
		$this->assertTrue( WPSEO_Utils::is_apache() );

		$_SERVER['SERVER_SOFTWARE'] = 'nginx/1.5.11';
		$this->assertFalse( WPSEO_Utils::is_apache() );
	}

	/**
	* @covers test_wpseo_is_nginx()
	*/
	public function test_wpseo_is_nginx() {
		$_SERVER['SERVER_SOFTWARE'] = 'nginx/1.5.11';
		$this->assertTrue( WPSEO_Utils::is_nginx() );

		$_SERVER['SERVER_SOFTWARE'] = 'Apache/2.2.22';
		$this->assertFalse( WPSEO_Utils::is_nginx() );
	}

	/**
	 * @covers WPSEO_Utils::trim_nbsp_from_string()
	 */
	public function test_wpseo_trim_nbsp_from_string() {
		$old_string = ' This is an old string with&nbsp;as spaces.&nbsp;';
		$expected   = 'This is an old string with as spaces.';

		$this->assertEquals( $expected, WPSEO_Utils::trim_nbsp_from_string( $old_string ) );
	}
}