<?php

class WPSEO_Frontend_Test extends WPSEO_UnitTestCase {

	/**
	* @var WPSEO_Frontend
	*/
	private $class_instance;

	/**
	* @var int
	*/
	private $post_id = 0;

	/**
	* @var int
	*/
	private $user_id = 0;

	/**
	* @var int
	*/
	private $category_id = 0;

	/**
	* Provision
	*/
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Frontend();
		
		// create sample user
		$this->user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );

		// create sample posts
		$this->post_id = $this->factory->post->create(
			array( 
				'post_title' => 'Sample Post', 
				'post_type' => 'post', 
				'post_status' => 'publish',
				'post_author' => $author_id
			) 
		);

		// create sample category
		$this->category_id = wp_create_category( "WordPress SEO" );
		wp_set_post_categories( $this->post_id, array( $this->category_id ) );

	}

	/**
	* Clean-up
	*/
	public function tearDown() {
		parent::tearDown();

		// delete post
		wp_delete_post( $this->post_id );

		// delete category
		wp_delete_category( $this->category_id );

		// delete author
		wp_delete_user( $this->user_id );

		// go back to home page
		$this->go_to_home();
	}

	public function test_is_home_posts_page() {
		$expected = ( is_home() && 'page' != get_option( 'show_on_front' ) );
		$this->assertEquals( $expected, $this->class_instance->is_home_posts_page() );
	}

	public function test_is_home_static_page() {
		$expected = ( is_front_page() && 'page' == get_option( 'show_on_front' ) && is_page( get_option( 'page_on_front' ) ) );
		$this->assertEquals( $expected, $this->class_instance->is_home_static_page() );
	}

	public function test_is_posts_page() {
		$expected = ( is_home() && 'page' == get_option( 'show_on_front' ) );
		$this->assertEquals( $expected, $this->class_instance->is_posts_page() );
	}

	/**
	* Test if action hooks are properly added, according to the plugin options.
	*/
	public function test_actions() {
		// @todo
	}

	/**
	* Test if filter hooks are properly added, according to the plugin options.
	*/
	public function test_filters() {
		// @todo
	}

	public function test_get_content_title() {

		// go to a singular post
		$this->go_to_post();

		// test title according to format
		$expected_title = $this->class_instance->get_title_from_options( 'title-post', get_queried_object() );
		$this->assertEquals( $expected_title, $this->class_instance->get_content_title() );

		// test explicit post title
		$explicit_title = 'WPSEO Post Title %%sitename%%';
		WPSEO_Meta::set_value( 'title', $explicit_title, $this->post_id );

		$expected_title = wpseo_replace_vars( $explicit_title, (array) $object );
		$this->assertEquals( $expected_title, $this->class_instance->get_content_title() );
	}

	public function test_get_taxonomy_title() {
		
		// @todo fix for multisite
		if( is_multisite() ) { return; }

		// go to category page
		$this->go_to_category();
		
		// test title according to format
		$expected_title = $this->class_instance->get_title_from_options( 'title-tax-category', (array) get_queried_object() );
		$this->assertEquals( $expected_title, $this->class_instance->get_taxonomy_title() );

		// @todo add test for an explicit wpseo title format
		// we need an easy way to set taxonomy meta though...
	}

	public function test_get_author_title() {
		
		$this->go_to_author();

		// test general author title
		$expected_title = $this->class_instance->get_title_from_options( 'title-author-wpseo' );
		$this->assertEquals( $expected_title, $this->class_instance->get_author_title() );

		// add explicit title to author meta
		$explicit_title = 'WPSEO Author Title %%sitename%%';
		add_user_meta( $this->user_id, 'wpseo_title', $explicit_title );

		// test explicit title
		$expected_title = wpseo_replace_vars( 'WPSEO Author Title %%sitename%%', array() );
		$this->assertEquals( $expected_title, $this->class_instance->get_author_title() );
	}

	public function test_get_title_from_options() {
		// should return an empty string
		$this->assertEmpty( $this->class_instance->get_title_from_options( '__not-existing-index' ) );

		$this->go_to_post();

		$var_source = (array) get_queried_object();
		$expected_title = wpseo_replace_vars( '%%title%% %%sep%% %%sitename%%', $var_source );
		$this->assertEquals( $expected_title, $this->class_instance->get_title_from_options( '__not-existing-index', $var_source ) );

		// test with an option that exists
		$index = 'title-post';
		$expected_title = wpseo_replace_vars( $this->class_instance->options[ $index ], $var_source );
		$this->assertEquals( $expected_title, $this->class_instance->get_title_from_options( $index, $var_source ) );
	}

	public function test_get_default_title() {
		// @todo
	}

	public function test_add_paging_to_title() {
		// @todo
	}

	public function test_add_to_title() {
		
		$title = "Title";
		$sep = " >> ";
		$title_part = "Title Part";

		$expected = $title . $sep . $title_part;
		$this->assertEquals( $expected, $this->class_instance->add_to_title( $sep, 'right', $title, $title_part ) );

		$expected = $title_part . $sep . $title;
		$this->assertEquals( $expected, $this->class_instance->add_to_title( $sep, 'left', $title, $title_part ) );
	}

	public function test_title() {
		// @todo
	}

	public function force_wp_title() {
		// @todo
	}

	public function test_debug_marker() {
		// @todo
	}

	public function test_webmaster_tools_authentication() {
		// @todo
	}

	public function test_head() {
		// @todo
	}

	public function test_robots() {
		// @todo
	}

	public function test_robots_for_single_post() {
		// @todo
	}

	public function test_canonical() {
		// @todo
	}

	public function test_adjacent_rel_links() {
		// @todo
	}

	public function test_adjacent_rel_link() {
		// @todo
	}

	public function test_publisher() {
		// @todo
	}

	public function test_author() {
		// @todo
	}

	public function test_metakeywords() {
		// @todo
	}

	public function test_metadesc() {
		// @todo
	}

	public function test_page_redirect() {
		// @todo
	}

	public function test_noindex_page() {
		// @todo
	}

	public function test_noindex_feed() {
		// @todo
	}

	public function test_nofollow_link() {
		// @todo
	}

	public function test_archive_redirect() {
		// @todo
	}

	public function test_attachment_redirect() {
		// @todo
	}

	public function test_add_trailingslash() {
		// @todo
	}

	public function test_remove_reply_to_com() {
		// @todo
	}

	public function test_replytocom_redirect() {
		// @todo
	}

	public function test_clean_permalink() {
		// @todo
	}

	public function test_rss_replace_vars() {
		// @todo
	}

	public function test_embed_rssfooter() {
		// @todo
	}

	public function test_embed_rssfooter_excerpt() {
		// @todo
	}

	public function test_embed_rss() {
		// @todo
	}

	public function test_flush_cache() {
		// @todo
	}

	public function test_force_rewrite_output_buffer() {
		// @todo
	}

	public function test_title_test_helper() {
		// @todo
	}

	private function go_to_post() {
		$this->go_to( get_permalink( $this->post_id ) );
	}

	private function go_to_category() {
		$this->go_to( get_category_link( $this->category_id ) );
	}

	private function go_to_author() {
		$this->go_to( get_author_posts_url( $this->user_id ) );
	}
	
}