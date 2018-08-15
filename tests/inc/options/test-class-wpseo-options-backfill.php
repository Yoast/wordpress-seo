<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc\Options
 */

/**
 * Test the backfilling of options after 7.0
 */
class WPSEO_Options_Backfill_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the expected values of the wpseo_rss option.
	 */
	public function test_contents_of_wpseo_rss() {
		// Setup data to expect.
		$expected = array(
			'rssbefore' => 'a',
			'rssafter'  => 'b',
		);

		$this->set_options( $expected );

		$this->assertEquals( $expected, get_option( 'wpseo_rss' ) );
	}

	/**
	 * Tests the expected values of the wpseo_xml option.
	 */
	public function test_contents_of_wpseo_xml() {
		// Setup data to expect.
		$expected = array(
			'enablexmlsitemap'       => true,
			'disable_author_sitemap' => false,
			'disable_author_noposts' => true,
			'entries-per-page'       => 1000,
			'excluded-posts'         => array(),
		);

		$this->set_options( array(
			'enable_xml_sitemap'     => true,
			'disable_author_sitemap' => false,
			'disable_author_noposts' => true,
			'entries-per-page'       => 1000,
			'excluded-posts'         => array(),
		) );

		$this->assertEquals( $expected, get_option( 'wpseo_xml' ) );
	}

	/**
	 * Tests the expected values of the wpseo_permalinks option.
	 */
	public function test_contents_of_wpseo_permalinks() {
		// Setup data to expect.
		$expected = array(
			'redirectattachment'              => true,
			'stripcategorybase'               => false,

			'cleanpermalinks'                 => false,
			'cleanpermalink-extravars'        => '',
			'cleanpermalink-googlecampaign'   => false,
			'cleanpermalink-googlesitesearch' => false,
			'cleanreplytocom'                 => false,
			'cleanslugs'                      => false,
			'trailingslash'                   => false,
		);

		$this->set_options( array(
			'disable-attachment' => true,
			'stripcategorybase'  => false,
		) );

		$this->assertEquals( $expected, get_option( 'wpseo_permalinks' ) );
	}

	/**
	 * Tests the expected values of the wpseo_internallinks option.
	 */
	public function test_contents_of_wpseo_internallinks() {
		// Setup data to expect.
		$expected = array(
			'breadcrumbs-404crumb'      => 'a',
			'breadcrumbs-blog-remove'   => true,
			'breadcrumbs-boldlast'      => true,
			'breadcrumbs-archiveprefix' => 'b',
			'breadcrumbs-enable'        => true,
			'breadcrumbs-home'          => 'c',
			'breadcrumbs-prefix'        => 'd',
			'breadcrumbs-searchprefix'  => 'e',
			'breadcrumbs-sep'           => 'f',
		);

		$this->set_options( $expected );

		$this->assertEquals( $expected, get_option( 'wpseo_internallinks' ) );
	}

	/**
	 * Tests the expected value of the wpseo_excludeauthorsitemap user-option.
	 */
	public function test_get_user_meta_wpseo_excludeauthorsitemap() {
		$user_id = $this->factory->user->create();
		wp_set_current_user( $user_id );

		$expected = 'this';
		update_user_meta( $user_id, 'wpseo_noindex_author', $expected );

		$this->assertEquals( $expected, get_user_meta( $user_id, 'wpseo_excludeauthorsitemap', true ) );
	}

	/**
	 * Tests the expected fields to be present in the wpseo_titles option.
	 */
	public function test_added_fields_to_wpseo_titles() {
		$result = get_option( 'wpseo_titles' );

		$this->assertNotEquals( $result['display-metabox-tax-category'], $result['hideeditbox-tax-category'] );
		$this->assertNotEquals( $result['display-metabox-pt-post'], $result['hideeditbox-post'] );
		$this->assertNotEquals( $result['display-metabox-pt-page'], $result['hideeditbox-page'] );
	}

	/**
	 * Tests the expected fields to be present and filled in the wpseo option.
	 */
	public function test_added_fields_to_wpseo() {
		$expected = array(
			'website_name'           => 'a',
			'alternate_website_name' => 'b',
			'company_logo'           => 'http://c',
			'company_name'           => 'd',
			'company_or_person'      => 'company',
			'person_name'            => 'f',
		);

		$this->set_options( $expected );

		$result = get_option( 'wpseo' );

		$this->assertContains( 'website_name', $result );
		$this->assertContains( 'alternate_website_name', $result );
		$this->assertContains( 'company_logo', $result );
		$this->assertContains( 'company_name', $result );
		$this->assertContains( 'company_or_person', $result );
		$this->assertContains( 'person_name', $result );

		$this->assertEquals( $expected['website_name'], $result['website_name'] );
		$this->assertEquals( $expected['alternate_website_name'], $result['alternate_website_name'] );
		$this->assertEquals( $expected['company_logo'], $result['company_logo'] );
		$this->assertEquals( $expected['company_name'], $result['company_name'] );
		$this->assertEquals( $expected['company_or_person'], $result['company_or_person'] );
		$this->assertEquals( $expected['person_name'], $result['person_name'] );
	}

	/**
	 * Sets the options in the framework.
	 *
	 * @param array $data Key-value pair of data to set.
	 */
	protected function set_options( $data ) {
		foreach ( $data as $key => $value ) {
			WPSEO_Options::set( $key, $value );
		}
	}
}
