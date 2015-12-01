<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for testing the redirect page
 *
 * @covers WPSEO_Redirect_Page
 */
class WPSEO_Redirect_Page_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Page
	 */
	private $class_instance;

	/**
	 * Setting up the instance
	 *
	 * @covers WPSEO_Redirect_Page::__construct
	 */
	public function setUp() {
		$GLOBALS['hook_suffix'] = 'test_table';

		$this->class_instance = new WPSEO_Redirect_Page( new WPSEO_Redirect_Manager() );
	}

	/**
	 * Check if the output contains some picked pieces from the table it should display.
	 *
	 * @covers WPSEO_Redirect_Page::display
	 */
	public function test_display() {
		ob_start();

		$this->class_instance->display();

		$output = ob_get_clean();

		$this->assertContains( '<div class="wrap wpseo-admin-page page-wpseo_redirects">', $output );
		$this->assertContains( "<form class='wpseo-new-redirect-form' method='post'>", $output );
		$this->assertContains( "<select name='wpseo_redirects_type' id='wpseo_redirects_type' class='select'>", $output );
		$this->assertContains( "<a href='javascript:;' class='button-primary'>Add Redirect</a>", $output );
		$this->assertContains( '</table>', $output );
	}

	/**
	 * Test the result of the set screen option
	 *
	 * @covers WPSEO_Redirect_Page::set_screen_option
	 */
	public function test_set_screen_option() {
		$this->assertEquals( 'screen-option-value', $this->class_instance->set_screen_option( 'unused', 'redirects_per_page', 'screen-option-value' ) );
		$this->assertEquals( null, $this->class_instance->set_screen_option( 'unused', 'another_page', 'screen-option-value' ) );
	}

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
