<?php

class WPSEO_Test_Unit_Tests extends WPSEO_UnitTestCase {

	function test_wpseo_is_active() {
		$this->assertTrue( is_plugin_active( 'wordpress-seo/wp-seo.php' ) ); // Yay, your unit tests are running!
	}
	
}
