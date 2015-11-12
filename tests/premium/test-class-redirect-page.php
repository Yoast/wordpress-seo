<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the redirect page
 *
 * @covers WPSEO_Redirect_Page_Test
 */
class WPSEO_Redirect_Page_Test {

	/**
	 * Testing if we get the options
	 *
	 * @covers WPSEO_Redirect_Page::get_options
	 */
	public function test_get_options() {
		$options = WPSEO_Redirect_Page::get_options();

		$this->assertEquals( 'off', $options['disable_php_redirect'] );
		$this->assertEquals( 'off', $options['separate_file'] );

		/*
		 Because of PHP 5.2, this can not be done
	 	 $this->assertArraySubset(
			array( 'disable_php_redirect' => 'off', 'separate_file' => 'off' ),
			WPSEO_Redirect_Manager::get_options()
		);
		 */
	}

}
