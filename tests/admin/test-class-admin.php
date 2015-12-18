<?php

class WPSEO_Admin_Test extends WPSEO_UnitTestCase {

	/**
	 * Test that admin_features returns the correct array.
	 *
	 * @covers WPSEO_Admin::get_admin_features
	 */
	public function test_get_admin_features() {
		$class_instance = new WPSEO_Admin();

		$admin_features = array(
			'google_search_console' => new WPSEO_GSC(),
			'primary_category'      => new WPSEO_Primary_Term_Admin(),
			'dashboard_widget'      => new Yoast_Dashboard_Widget(),
		);

		$this->assertEquals( $admin_features, $class_instance->get_admin_features() );

	}
}