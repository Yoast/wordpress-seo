<?php

class WPSEO_Option_Test extends WPSEO_UnitTestCase {

	public function test_grant_access_for_non_multisites() {
		if( is_multisite() ) {
			return true;
		}

		// should be true when not running multisite
		$this->assertTrue( WPSEO_Options::grant_access() );
	}

	public function test_grant_access_for_admins() {
		
		// correct way to create a user? or use factory method?
		global $current_user;
		$current_user = new WP_User( 1 );
		$current_user->set_role( 'administrator' );

		$this->assertTrue( WPSEO_Options::grant_access() );
	}


	
}