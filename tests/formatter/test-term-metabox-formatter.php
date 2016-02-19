<?php
/**
 * @package WPSEO\Unittests\Formatter
 */

class WPSEO_Term_Metabox_Formatter_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WP_Term|stdClass
	 */
	private $term;

	/**
	 * @var stdClass
	 */
	private $taxonomy;

	/**
	 * Creates a post to use in the tests.
	 */
	public function setUp() {
		parent::setUp();

		$term_id        = $this->factory->term->create();

		$this->term     = get_term( $term_id );
		$this->taxonomy = get_taxonomy( $this->term->taxonomy );
	}

	/**
	 * Test the formatter without a term, taxonomy and options
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
		$instance = new WPSEO_Term_Metabox_Formatter( $this->taxonomy, $this->term, array() );
		$result   = $instance->get_values();

		$this->assertEquals( $result['search_url'],    admin_url( 'edit-tags.php?taxonomy=' . $this->term->taxonomy . '&seo_kw_filter={keyword}' ) );
		$this->assertEquals( $result['post_edit_url'], admin_url( 'edit-tags.php?action=edit&taxonomy=' . $this->term->taxonomy . '&tag_ID={id}' ) );
		$this->assertEquals( $result['base_url'], trailingslashit( home_url( 'tag' ) ) );
		$this->assertEquals( $result['keyword_usage'], array( '' => array() ) );
		$this->assertEquals( $result['title_template'], '' );
		$this->assertEquals( $result['metadesc_template'], '' );
	}

	/**
	 * Test the formatter when there is a taxonomy and term object and without any options.
	 *
	 * @covers WPSEO_Term_Metabox_Formatter::get_title_template
	 * @covers WPSEO_Term_Metabox_Formatter::get_metadesc_template
	 * @covers WPSEO_Term_Metabox_Formatter::get_template
	 */
	public function test_with_taxonomy_term_and_options() {
		$options  = array( 'title-tax-post_tag' => 'This is a title', 'metadesc-tax-post_tag' => 'This is a meta description' );
		$instance = new WPSEO_Term_Metabox_Formatter( $this->taxonomy, $this->term, $options );
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
		$options  = array( 'metadesc-tax-post_tag' => 'This is a meta description' );
		$instance = new WPSEO_Term_Metabox_Formatter( $this->taxonomy, $this->term, $options );
		$result   = $instance->get_values();

		$this->assertEquals( $result['title_template'], '' );
		$this->assertEquals( $result['metadesc_template'], 'This is a meta description' );
	}


}