<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for the table presenter
 *
 * @covers WPSEO_Redirect_Table_Presenter
 */
class WPSEO_Redirect_Table_Presenter_Test extends WPSEO_UnitTestCase {

	/**
	 * Test the output of the view by checking if the output contains the given pieces
	 *
	 * @covers WPSEO_Redirect_Table_Presenter::__construct
	 * @covers WPSEO_Redirect_Table_Presenter::display
	 * @covers WPSEO_Redirect_Table_Presenter::get_view_vars
	 */
	public function test_display_regex() {

		$class_instance = new WPSEO_Redirect_Table_Presenter( 'regex', array( 'nonce' => 'nonce' ) );
		$class_instance->set_table( new WPSEO_Redirect_Regex_Manager() );

		ob_start();

		$class_instance->display();

		$output = ob_get_clean();

		$this->assertContains( '<div id="table-regex" class="tab-url redirect-table-tab">', $output );
		$this->assertContains( 'Regex Redirects are extremely powerful redirects. You should only use them if you know what you are doing.<br />', $output );
		$this->assertContains( 'The redirect type is the HTTP response code sent to the browser telling the browser what type of redirect is served.', $output );
		$this->assertContains( 'Regular Expression', $output );
		$this->assertContains( '</form>', $output );
	}

	/**
	 * Test the output of the view by checking if the output contains the given pieces
	 *
	 * @covers WPSEO_Redirect_Table_Presenter::__construct
	 * @covers WPSEO_Redirect_Table_Presenter::display
	 * @covers WPSEO_Redirect_Table_Presenter::get_view_vars
	 */
	public function test_display_url() {

		$class_instance = new WPSEO_Redirect_Table_Presenter( 'plain', array( 'nonce' => 'nonce' ) );
		$class_instance->set_table( new WPSEO_Redirect_URL_Manager() );

		ob_start();

		$class_instance->display();

		$output = ob_get_clean();

		$this->assertContains( '<div id="table-plain" class="tab-url redirect-table-tab">', $output );
		$this->assertContains( 'The redirect type is the HTTP response code sent to the browser telling the browser what type of redirect is served.', $output );
		$this->assertContains( 'Old URL', $output );
		$this->assertContains( '</form>', $output );
	}

}
