<?php

class WPSEO_Admin_Test extends WPSEO_UnitTestCase {

	/**
	 * Test that admin_features returns the correct array when we're editing/creating a post.
	 *
	 * @covers WPSEO_Admin::get_admin_features
	 */
	public function test_get_admin_features_ON_post_edit() {
		global $pagenow;
		$pagenow = 'post.php';

		$class_instance = new WPSEO_Admin();

		$admin_features = array(
			'google_search_console' => new WPSEO_GSC(),
			'primary_category'      => new WPSEO_Primary_Term_Admin(),
			'dashboard_widget'      => new Yoast_Dashboard_Widget(),
		);

		$this->assertEquals( $admin_features, $class_instance->get_admin_features() );
	}

	/**
	 * When we're not on a post edit page, the primary category should not be added to the array.
	 *
	 * @covers WPSEO_Admin::get_admin_features
	 */
	public function test_get_admin_features_NOT_ON_post_edit() {
		global $pagenow;
		$pagenow = 'index.php';

		$class_instance = new WPSEO_Admin();

		$admin_features = array(
			'google_search_console' => new WPSEO_GSC(),
			'dashboard_widget'      => new Yoast_Dashboard_Widget(),
		);

		$this->assertEquals( $admin_features, $class_instance->get_admin_features() );
	}


}
