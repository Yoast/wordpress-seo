<?php
/**
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
class WPSEO_Option_Tab_Test extends WPSEO_UnitTestCase {

	public function test_get_name() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label' );

		$this->assertEquals( 'name', $option_tab->get_name() );
	}

	public function test_get_label() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label' );

		$this->assertEquals( 'label', $option_tab->get_label() );
	}

	public function test_get_video_url() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label', array( 'video_url' => 'https://video.url' ) );

		$this->assertEquals( 'https://video.url', $option_tab->get_video_url() );
	}

	public function test_get_video_url_WHEN_video_url_is_not_set() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label' );

		$this->assertEquals( '', $option_tab->get_video_url() );
	}

	public function test_get_opt_group() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label', array( 'opt_group' => 'opt_group' ) );

		$this->assertEquals( 'opt_group', $option_tab->get_opt_group() );
	}

	public function test_get_opt_group_WHEN_opt_group_is_not_set() {
		$option_tab = new WPSEO_Option_Tab( 'name', 'label' );

		$this->assertEquals( '', $option_tab->get_opt_group() );
	}

}
