<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Formatter
 */

/**
 * Unit Test Class.
 */
class WPSEO_Term_Metabox_Formatter_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WP_Term|stdClass
	 */
	private $term;

	/**
	 * @var WP_Taxonomy|stdClass
	 */
	private $taxonomy;

	/**
	 * Creates a post to use in the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->term     = $this->factory->term->create_and_get();
		$this->taxonomy = get_taxonomy( $this->term->taxonomy );
	}

	/**
	 * Test the formatter without a term, taxonomy and options.
	 *
	 * @covers WPSEO_Term_Metabox_Formatter::__construct
	 * @covers WPSEO_Term_Metabox_Formatter::get_values
	 */
	public function test_no_taxonomy_no_term_and_no_options() {
		$instance = new WPSEO_Term_Metabox_Formatter( null, null, array() );
		$result   = $instance->get_values();

		$this->assertFalse( array_key_exists( 'search_url', $result ) );
		$this->assertFalse( array_key_exists( 'post_edit_url', $result ) );
		$this->assertFalse( array_key_exists( 'base_url', $result ) );
	}

	/**
	 * Test the formatter when there is a taxonomy and term object and without any options.
	 *
	 * @covers WPSEO_Term_Metabox_Formatter::get_values
	 * @covers WPSEO_Term_Metabox_Formatter::search_url
	 * @covers WPSEO_Term_Metabox_Formatter::edit_url
	 * @covers WPSEO_Term_Metabox_Formatter::base_url_for_js
	 * @covers WPSEO_Term_Metabox_Formatter::get_focus_keyword_usage
	 * @covers WPSEO_Term_Metabox_Formatter::get_title_template
	 * @covers WPSEO_Term_Metabox_Formatter::get_metadesc_template
	 * @covers WPSEO_Term_Metabox_Formatter::get_template
	 */
	public function test_with_taxonomy_and_term_and_without_options() {
		WPSEO_Options::set( 'title-tax-' . $this->taxonomy->name, '' );
		WPSEO_Options::set( 'metadesc-tax-' . $this->taxonomy->name, '' );

		$instance = new WPSEO_Term_Metabox_Formatter( $this->taxonomy, $this->term );

		global $wp_version;
		$_wp_version = $wp_version;
		$wp_version  = '4.4.2';

		$result = $instance->get_values();

		$wp_version = $_wp_version;

		$this->assertEquals( $result['search_url'], admin_url( 'edit-tags.php?taxonomy=' . $this->term->taxonomy . '&seo_kw_filter={keyword}' ) );
		$this->assertEquals( $result['post_edit_url'], admin_url( 'edit-tags.php?action=edit&taxonomy=' . $this->term->taxonomy . '&tag_ID={id}' ) );

		$this->assertEquals( trailingslashit( home_url( 'tag' ) ), $result['base_url'] );
		$this->assertEquals( array( '' => array() ), $result['keyword_usage'] );
		$this->assertEquals( '%%title%% %%sep%% %%sitename%%', $result['title_template'] );
		$this->assertEquals( '', $result['metadesc_template'] );
	}

	/**
	 * Get the correct post_edit_url for WP 4.5 and higher.
	 *
	 * @covers WPSEO_Term_Metabox_Formatter::edit_url
	 */
	public function test_post_edit_url_4_5_and_higher() {
		global $wp_version;

		$instance = new WPSEO_Term_Metabox_Formatter( $this->taxonomy, $this->term, array() );

		$_wp_version = $wp_version;
		$wp_version  = '4.5.0';

		$result = $instance->get_values();

		$wp_version = $_wp_version;

		$this->assertEquals( $result['post_edit_url'], admin_url( 'term.php?action=edit&taxonomy=' . $this->term->taxonomy . '&tag_ID={id}' ) );
	}

	/**
	 * Test the formatter when there is a taxonomy and term object and without any options.
	 *
	 * @covers WPSEO_Term_Metabox_Formatter::get_title_template
	 * @covers WPSEO_Term_Metabox_Formatter::get_metadesc_template
	 * @covers WPSEO_Term_Metabox_Formatter::get_template
	 */
	public function test_with_taxonomy_term_and_options() {
		WPSEO_Options::set( 'title-tax-post_tag', 'This is a title' );
		WPSEO_Options::set( 'metadesc-tax-post_tag', 'This is a meta description' );

		$instance = new WPSEO_Term_Metabox_Formatter( $this->taxonomy, $this->term );
		$result   = $instance->get_values();

		$this->assertEquals( $result['title_template'], 'This is a title' );
		$this->assertEquals( $result['metadesc_template'], 'This is a meta description' );
	}

	/**
	 * Test the formatter when there is a taxonomy and term object and without any options.
	 *
	 * @covers WPSEO_Term_Metabox_Formatter::get_title_template
	 * @covers WPSEO_Term_Metabox_Formatter::get_metadesc_template
	 * @covers WPSEO_Term_Metabox_Formatter::get_template
	 */
	public function test_with_taxonomy_term_and_options_with_title_option_missing() {
		WPSEO_Options::set( 'title-tax-post_tag', '' );
		WPSEO_Options::set( 'metadesc-tax-post_tag', 'This is a meta description' );
		$instance = new WPSEO_Term_Metabox_Formatter( $this->taxonomy, $this->term );
		$result   = $instance->get_values();

		$this->assertEquals( '%%title%% %%sep%% %%sitename%%', $result['title_template'] );
		$this->assertEquals( 'This is a meta description', $result['metadesc_template'] );
	}
}
