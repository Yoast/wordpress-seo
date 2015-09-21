<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing WPSEO_Redirect_Htaccess_Util
 *
 * Class WPSEO_Redirect_Htaccess_Util_Test
 */
class WPSEO_Redirect_Htaccess_Util_Test extends WPSEO_UnitTestCase {

	/**
	 * Check if result contains .htaccess.
	 *
	 * @covers WPSEO_Redirect_Htaccess_Util::get_htaccess_file_path
	 */
	public function test_get_htaccess_file_path() {
		$this->assertContains( '.htaccess', WPSEO_Redirect_Htaccess_Util::get_htaccess_file_path() );
	}

}
