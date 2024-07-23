<?php

namespace Yoast\WP\SEO\Tests\WP\Formatter;

use WPSEO_Options;
use WPSEO_Term_Metabox_Formatter;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Term_Metabox_Formatter_Test extends TestCase {

	/**
	 * Holds the term instance.
	 *
	 * @var WP_Term|stdClass
	 */
	private $term;

	/**
	 * Holds the taxonomy instance.
	 *
	 * @var WP_Taxonomy|stdClass
	 */
	private $taxonomy;

	/**
	 * Creates a post to use in the tests.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->term     = $this->factory->term->create_and_get();
		$this->taxonomy = \get_taxonomy( $this->term->taxonomy );
	}

	/**
	 * Test the formatter without a term, taxonomy and options.
	 *
	 * @covers WPSEO_Term_Metabox_Formatter::__construct
	 * @covers WPSEO_Term_Metabox_Formatter::get_values
	 *
	 * @return void
	 */
	public function test_no_taxonomy_no_term_and_no_options() {
		$instance = new WPSEO_Term_Metabox_Formatter( null, null, [] );
		$result   = $instance->get_values();

		$this->assertFalse( \array_key_exists( 'search_url', $result ) );
		$this->assertFalse( \array_key_exists( 'post_edit_url', $result ) );
		$this->assertFalse( \array_key_exists( 'base_url', $result ) );
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
	 *
	 * @return void
	 */
	public function test_with_taxonomy_and_term_and_without_options() {
		WPSEO_Options::set( 'title-tax-' . $this->taxonomy->name, '' );
		WPSEO_Options::set( 'metadesc-tax-' . $this->taxonomy->name, '' );

		$instance = new WPSEO_Term_Metabox_Formatter( $this->taxonomy, $this->term );

		$result = $instance->get_values();

		$this->assertEquals( [ '' => [] ], $result['keyword_usage'] );
		$this->assertEquals( '%%term_title%% Archives %%page%% %%sep%% %%sitename%%', $result['title_template'] );
		$this->assertEquals( '', $result['metadesc_template'] );
	}

	/**
	 * Test the formatter when there is a taxonomy and term object and without any options.
	 *
	 * @covers WPSEO_Term_Metabox_Formatter::get_title_template
	 * @covers WPSEO_Term_Metabox_Formatter::get_metadesc_template
	 * @covers WPSEO_Term_Metabox_Formatter::get_template
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_with_taxonomy_term_and_options_with_title_option_missing() {
		WPSEO_Options::set( 'title-tax-post_tag', '' );
		WPSEO_Options::set( 'metadesc-tax-post_tag', 'This is a meta description' );
		$instance = new WPSEO_Term_Metabox_Formatter( $this->taxonomy, $this->term );
		$result   = $instance->get_values();

		$this->assertEquals( '%%term_title%% Archives %%page%% %%sep%% %%sitename%%', $result['title_template'] );
		$this->assertEquals( 'This is a meta description', $result['metadesc_template'] );
	}
}
