<?php

class WPSEO_Functions_Test extends WPSEO_UnitTestCase {

	public function setUp() {
		parent::setUp();

		$options = array(
			'enablexmlsitemap' => false
		);
		update_option('wpseo_xml', $options);
	}

	// public function test_xml_sitemaps_init_not_firing_when_disabled() {
	// 	global $wp_filter;
	// 	$this->assertArrayNotHasKey( 'wpseo_xml_redirect_sitemap', $wp_filter['template_redirect'][0] );
	// }

	// dummy test to prevent warning
	public function test_true_is_true() {
		$this->assertTrue( true );
	}

}