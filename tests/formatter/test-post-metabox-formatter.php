<?php
/**
 * @package WPSEO\Unittests\Formatter
 */

/**
 * @group test
 */
class WPSEO_Post_Metabox_Formatter_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WP_Post
	 */
	private $post;

	/**
	 * Creates a post to use in the tests.
	 */
	public function setUp() {
		parent::setUp();

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
		$instance = new WPSEO_Post_Metabox_Formatter( null, array(), '' );
		$result   = $instance->get_values();

		$this->assertEquals( $result['search_url'],    admin_url( 'edit.php?seo_kw_filter={keyword}' ) );
		$this->assertEquals( $result['post_edit_url'], admin_url( 'post.php?post={id}&action=edit' ) );
		$this->assertEquals( $result['base_url'], trailingslashit( home_url() ) );
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
		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, array(), '' );
		$result   = $instance->get_values();

		$this->assertEquals( $result['keyword_usage'], array( '' => array() ) );
		$this->assertEquals( $result['title_template'], '' );
		$this->assertEquals( $result['metadesc_template'], '' );
	}

	/**
	 * Testing with a post and needed options being set
	 *
	 * @covers WPSEO_Post_Metabox_Formatter::get_metadesc_date
	 * @covers WPSEO_Post_Metabox_Formatter::is_show_date_enabled
	 */
	public function test_post_with_options_and_showdate_enabled() {
		$options  = array(
			'title-post'    => 'This is the title',
			'metadesc-post' => 'This is the metadescription',
			'showdate-post' => true
		);
		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, $options, '' );
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

		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, array(), '' );
		$result   = $instance->get_values();

		$this->assertEquals( $result['base_url'], trailingslashit( home_url() ) );

		unset( $GLOBALS['pagenow'] );
	}

	/**
	 * Testing when the permalink structure contains '%postname%/'. This should be stripped.
	 *
	 * @covers WPSEO_Post_Metabox_Formatter::get_values
	 * @covers WPSEO_Post_Metabox_Formatter::base_url_for_js
	 */
	public function test_with_permalink_structure() {
		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, array(), 'http://example.org/test/%postname%/' );
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
		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, array(), '%isnotreplaced%/' );
		$result   = $instance->get_values();

		$this->assertEquals( $result['base_url'], trailingslashit( home_url() ) );
	}

	/**
	 * Testing when one of the template_options isn't set.
	 *
	 * @covers WPSEO_Post_Metabox_Formatter::get_values
	 * @covers WPSEO_Post_Metabox_Formatter::get_template
	 */
	public function test_with_missing_option() {
		$options  = array(
			'title-post'    => 'This is the title',
			'showdate-post' => true
		);
		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, $options, '' );
		$result   = $instance->get_values();

		$this->assertEquals( $result['title_template'], 'This is the title' );
		$this->assertEquals( $result['metadesc_template'], '' );

	}

}