<?php
/**
 * @package WPSEO\Unittests|Functions
 */

/**
 * Class WPSEO_XML_Sitemaps_Base_URL
 *
 * Test for the handling of wpseo_xml_sitemaps_base_url. Check the behaviour for http and https url.
 *
 */
class WPSEO_XML_Sitemaps_Base_URL extends WPSEO_UnitTestCase {

	/**
	 * Setting the home url to a http link and check if the result is the same as the parse sitemaps base url
	 */
	public function test_with_http() {
		update_option( 'home', 'http://example.org' );

		$this->assertEquals( 'http://example.org/sitemap.xml', wpseo_xml_sitemaps_base_url( 'sitemap.xml' ) );
		$this->assertNotEquals( 'https://example.org/sitemap.xml', wpseo_xml_sitemaps_base_url( 'sitemap.xml' ) );
	}

	/**
	 * Setting the home url to a https link and check if the result is the same as the parse sitemaps base url
	 */
	public function test_with_https() {
		update_option( 'home', 'https://example.org' );

		$this->assertEquals( 'https://example.org/sitemap.xml', wpseo_xml_sitemaps_base_url( 'sitemap.xml' ) );
		$this->assertNotEquals( 'http://example.org/sitemap.xml', wpseo_xml_sitemaps_base_url( 'sitemap.xml' ) );
	}
}
