<?php

class WPSEO_Admin_Test extends WPSEO_UnitTestCase {

	private $class_instance;

	public function setUp() {
		parent::setUp();
		$this->class_instance =
			$this
				->getMockBuilder( 'WPSEO_Admin' )
				->setMethods( array( 'turn_on_advanced_settings' ) )
				->getMock();
	}

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

	/**
	 * Test that filter_settings_pages calls the turn_on_advanced_settings function.
	 *
	 * @covers WPSEO_Admin::filter_settings_pages
	 */
	public function test_filter_settings_pages_CALLS_enable_advanced_settings() {
		$pages = array (
			0 =>
				array (
					4 => 'wpseo_dashboard',
				),
			1 =>
				array (
					4 => 'wpseo_titles',
				),
			2 =>
				array (
					4 => 'wpseo_social',
				),
			3 =>
				array (
					4 => 'wpseo_xml',
				),
			4 =>
				array(
					4 => 'wpseo_advanced',
				),
			5 =>
				array (
					4 => 'wpseo_tools',
				),
			6 =>
				array (
					4 => 'wpseo_search_console',
				),
			7 =>
				array (
					4 => 'wpseo_licenses',
				),
		);

		$this->class_instance
			->expects( $this->once() )
			->method( 'enable_advanced_settings' );

		$options['enable_setting_pages'] = true;
		update_option( 'wpseo', $options );

		$this->class_instance->filter_settings_pages( $pages );

	}

}
