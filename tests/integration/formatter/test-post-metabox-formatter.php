<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Formatter
 */

/**
 * Unit Test Class.
 */
class WPSEO_Post_Metabox_Formatter_Test extends WPSEO_UnitTestCase {

	/**
	 * The post.
	 *
	 * @var WP_Post
	 */
	private $post;

	/**
	 * Creates a post to use in the tests.
	 */
	public function set_up() {
		parent::set_up();

		$this->post = $this->factory->post->create_and_get();
	}

	/**
	 * Test the formatter when there isn't a post object and without any options.
	 *
	 * @covers WPSEO_Post_Metabox_Formatter::__construct
	 * @covers WPSEO_Post_Metabox_Formatter::get_values
	 * @covers WPSEO_Post_Metabox_Formatter::search_url
	 * @covers WPSEO_Post_Metabox_Formatter::edit_url
	 * @covers WPSEO_Post_Metabox_Formatter::base_url_for_js
	 */
	public function test_no_post_with_empty_options() {
		$instance = new WPSEO_Post_Metabox_Formatter( null, [], '' );
		$result   = $instance->get_values();

		$this->assertEquals( $result['search_url'], admin_url( 'edit.php?seo_kw_filter={keyword}' ) );
		$this->assertEquals( $result['post_edit_url'], admin_url( 'post.php?post={id}&action=edit' ) );
		$this->assertEquals( $result['base_url'], YoastSEO()->helpers->url->home() );
	}

	/**
	 * Test with a post being set but with no options being set.
	 *
	 * @covers WPSEO_Post_Metabox_Formatter::get_values
	 * @covers WPSEO_Post_Metabox_Formatter::get_focus_keyword_usage
	 * @covers WPSEO_Post_Metabox_Formatter::get_title_template
	 * @covers WPSEO_Post_Metabox_Formatter::get_metadesc_template
	 * @covers WPSEO_Post_Metabox_Formatter::get_template
	 */
	public function test_post_with_empty_options() {
		WPSEO_Options::set( 'keyword_usage', [ '' => [] ] );
		WPSEO_Options::set( 'title-' . $this->post->post_type, '' );
		WPSEO_Options::set( 'metadesc-' . $this->post->post_type, '' );

		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, [], '' );
		$result   = $instance->get_values();

		$this->assertEquals( [ '' => [] ], $result['keyword_usage'] );
		$this->assertEquals( '%%title%% %%page%% %%sep%% %%sitename%%', $result['title_template'] );
		$this->assertEquals( '', $result['metadesc_template'] );
	}

	/**
	 * Testing with a post and needed options being set.
	 *
	 * @covers WPSEO_Post_Metabox_Formatter::get_metadesc_date
	 */
	public function test_metabox_metadescription_date() {
		WPSEO_Options::set( 'title-post', 'This is the title' );
		WPSEO_Options::set( 'metadesc-post', 'This is the metadescription' );
		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, [], '' );
		$result   = $instance->get_values();

		$this->assertEquals( $result['metaDescriptionDate'], date_i18n( 'M j, Y', mysql2date( 'U', $this->post->post_date ) ) );
		$this->assertEquals( $result['title_template'], 'This is the title' );
		$this->assertEquals( $result['metadesc_template'], 'This is the metadescription' );
	}

	/**
	 * Testing the formatter when 'being' on the new post page.
	 *
	 * @covers WPSEO_Post_Metabox_Formatter::get_values
	 * @covers WPSEO_Post_Metabox_Formatter::base_url_for_js
	 */
	public function test_post_on_add_page() {

		$GLOBALS['pagenow'] = 'post-new.php';

		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, [], '' );
		$result   = $instance->get_values();

		$this->assertEquals( $result['base_url'], YoastSEO()->helpers->url->home() );

		unset( $GLOBALS['pagenow'] );
	}

	/**
	 * Testing when the permalink structure contains '%postname%/'. This should be stripped.
	 *
	 * @covers WPSEO_Post_Metabox_Formatter::get_values
	 * @covers WPSEO_Post_Metabox_Formatter::base_url_for_js
	 */
	public function test_with_permalink_structure() {
		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, [], 'http://example.org/test/%postname%/' );
		$result   = $instance->get_values();

		$this->assertEquals( $result['base_url'], 'http://example.org/test/' );
	}

	/**
	 * Testing when the permalink structure contains '%pagename%/'. This should be stripped.
	 *
	 * @covers WPSEO_Post_Metabox_Formatter::get_values
	 * @covers WPSEO_Post_Metabox_Formatter::base_url_for_js
	 */
	public function test_with_page_permalink_structure() {
		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, [], 'http://example.org/test/%pagename%/' );
		$result   = $instance->get_values();

		$this->assertEquals( $result['base_url'], 'http://example.org/test/' );
	}

	/**
	 * Testing when the permalink structure contains '%postname%/'. This should be stripped.
	 *
	 * @covers WPSEO_Post_Metabox_Formatter::get_values
	 * @covers WPSEO_Post_Metabox_Formatter::base_url_for_js
	 */
	public function test_with_unreplaceble_permalink_structure() {
		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, [], '%isnotreplaced%/' );
		$result   = $instance->get_values();

		$this->assertEquals( $result['base_url'], YoastSEO()->helpers->url->home() );
	}
}
