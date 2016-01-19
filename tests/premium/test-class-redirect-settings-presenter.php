<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for the settings presenter
 *
 * @covers WPSEO_Redirect_Settings_Presenter
 */
class WPSEO_Redirect_Settings_Presenter_Test extends WPSEO_UnitTestCase {

	/**
	 * Test the output of the view
	 *
	 * @covers WPSEO_Redirect_Settings_Presenter::__construct
	 * @covers WPSEO_Redirect_Settings_Presenter::display
	 * @covers WPSEO_Redirect_Settings_Presenter::get_view_vars
	 */
	public function test_display() {

		$class_instance = new WPSEO_Redirect_Settings_Presenter( 'settings', array() );

		ob_start();

		$class_instance->display();

		$output = ob_get_clean();

		$this->assertContains( '<div id="table-settings" class="tab-url redirect-table-tab">', $output );
		$this->assertContains( '<input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes" />', $output );
		$this->assertContains( '</div>', $output );
	}


}
