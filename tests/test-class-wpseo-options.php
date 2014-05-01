<?php

class WPSEO_Option_Test extends WPSEO_UnitTestCase {


	/**
	 * @covers WPSEO_Options::grant_access
	 */
	public function test_grant_access() {

		if( is_multisite() ) {
			// should be true when not running multisite
			$this->assertTrue( WPSEO_Options::grant_access() );
			return; // stop testing, not multisite
		}

		// admins should return true
		$user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $user_id );
		$this->assertTrue( WPSEO_Options::grant_access() );

		// todo test for superadmins

		// editors should return false
		// $user_id = $this->factory->user->create( array( 'role' => 'editor' ) );
		// wp_set_current_user( $user_id );
		// $this->assertTrue( WPSEO_Options::grant_access() );
	}

	
}