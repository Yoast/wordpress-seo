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
	private $author_id = 0;

	/**
	* @var int
	*/
	private $category_id = 0;

	/**
	* @var WP_Post
	*/ 
	private $post;

	/**
	* Provision
	*/
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Frontend();
		
		// create sample user
		$this->author_id = $this->factory->user->create( array( 'role' => 'administrator' ) );

		// create sample posts
		$this->post_id = $this->factory->post->create(
			array( 
				'post_title' => 'Sample Post', 
				'post_type' => 'post', 
				'post_status' => 'publish',
				'post_author' => $this->author_id
			) 
		);

		$this->post = get_post( $this->post_id );

		// Make some posts
   		$this->factory->post->create_many( 10 );

		// create sample category
		$this->category_id = wp_create_category( "WordPress SEO" );
		wp_set_post_categories( $this->post_id, array( $this->category_id ) );

		$this->class_instance->options['rssbefore'] = "Some RSS before text";
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
		wp_delete_user( $this->author_id );

		// go back to home page
		$this->go_to_home();

		$this->class_instance->options['rssbefore'] = '';
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
		add_user_meta( $this->author_id, 'wpseo_title', $explicit_title );

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
		// test if the version number is shown in the debug marker
		$version_found =  ( stristr( $this->class_instance->debug_marker( false ), WPSEO_VERSION ) !== false );
		$this->assertTrue( $version_found );
	}

	public function test_webmaster_tools_authentication() {
		
		$this->go_to_home();

		$this->run_webmaster_tools_authentication_option_test( 'alexaverify', '<meta name="alexaVerifyID" content="alexaverify" />' . "\n" );
		$this->run_webmaster_tools_authentication_option_test( 'msverify',  '<meta name="msvalidate.01" content="msverify" />' . "\n");
		$this->run_webmaster_tools_authentication_option_test( 'googleverify', '<meta name="google-site-verification" content="googleverify" />' . "\n" );
		$this->run_webmaster_tools_authentication_option_test( 'pinterestverify', '<meta name="p:domain_verify" content="pinterestverify" />' . "\n" );
		$this->run_webmaster_tools_authentication_option_test( 'yandexverify', '<meta name="yandex-verification" content="yandexverify" />' . "\n" );

		// asdasd
		$this->go_to_post();
		$this->run_webmaster_tools_authentication_option_test( 'yandexverify', '');
	}

	public function test_head() {
		
		$this->class_instance->head();
		ob_clean();

		$this->assertEquals(1, did_action( 'wpseo_head' ) );
	}

	/**
	* Test the WPSEO_Frontend::robots() method
	* @todo cover post type archives
	* @todo cover test with noodp and noydir option set
	* @todo test with page_for_posts option
	* @todo date archives
	* @todo test search results
	*/
	public function test_robots() {
		
		// @todo: fix for multisite
		if( is_multisite() ) {
			return;
		}

		// go to home
		$this->go_to_home();

		// test home page with no special options
		$expected = '';
		$this->assertEquals( $expected, $this->class_instance->robots() );

		$expected = 'noindex,follow';

		// test WP visibility setting
		update_option( 'blog_public', '0' );
		$this->assertEquals( $expected, $this->class_instance->robots() );
		
		// clean-up
		ob_clean();
		update_option( 'blog_public', '1' );

		// test replytocom
		$_GET['replytocom'] = '1';
		$this->assertEquals( $expected, $this->class_instance->robots() );
		
		// clean-up
		ob_clean();
		unset( $_GET['replytocom'] );

		// test 'paged' query var
		$this->go_to( home_url('?paged=2') );
		
		$expected = 'noindex,follow';
		$this->assertEquals( $expected, $this->class_instance->robots() );
		ob_clean();
	
		// go to post page
		$this->go_to_post();

		// test regular post with no special options
		$expected = '';
		$this->assertEquals( $expected, $this->class_instance->robots() );

		// test noindex-post option
		$expected = 'noindex,follow';
		$this->set_option( 'noindex-post', true );
		$this->assertEquals( $expected, $this->class_instance->robots() );
		
		// clean-up
		$this->set_option( 'noindex-post', false );
		ob_clean();

		// test post_status private
		$expected = 'noindex,follow';
		$this->set_post_property( 'post_status', 'private' );
		$this->assertEquals( $expected, $this->class_instance->robots() );
		ob_clean();

		// go to category page
		$this->go_to_category();

		// test regular category with no special options
		$expected = '';
		$this->assertEquals( $expected, $this->class_instance->robots() );

		// test category with noindex-tax-category option
		// @todo fix for multisite
		$expected = 'noindex,follow';
		$this->set_option( 'noindex-tax-category', true );
		$this->assertEquals( $expected, $this->class_instance->robots() );
		
		// clean-up
		$this->set_option( 'noindex-tax-category', false );
		ob_clean();

		// test subpages of category archives
		$this->set_option( 'noindex-subpages-wpseo', true );
		$this->go_to( add_query_arg( array( 'paged' => 2 ), get_category_link( $this->category_id ) ) );
				
		$expected = 'noindex,follow';
		$this->assertEquals( $expected, $this->class_instance->robots() );

		// clean-up
		ob_clean();

		// go to author page
		$this->go_to_author();

		// test author archive with no special options
		$expected = '';
		$this->assertEquals( $expected, $this->class_instance->robots() );

		// test author archive with 'noindex-author-wpseo'
		$expected = 'noindex,follow';
		$this->set_option( 'noindex-author-wpseo', true );
		$this->assertEquals( $expected, $this->class_instance->robots() );

		// clean-up
		$this->set_option( 'noindex-author-wpseo', false );
		ob_clean();

		}

	public function test_robots_for_single_post() {
		
		// go to post
		$this->go_to_post();

		$robots = array( 
			'index' => 'index', 
			'follow' => 'follow', 
			'other' => array( ) 
		);
		$expected = $robots;

		// test noindex
		WPSEO_Meta::set_value( 'meta-robots-noindex', '1', $this->post_id );		
		$expected['index'] = 'noindex';
		$this->assertEquals( $expected, $this->class_instance->robots_for_single_post( $robots, $this->post_id ) );

		// test nofollow
		WPSEO_Meta::set_value( 'meta-robots-nofollow', 1, $this->post_id );
		$expected['follow'] = 'nofollow';
		$this->assertEquals( $expected, $this->class_instance->robots_for_single_post( $robots, $this->post_id ) );

		// test noodp with default meta-robots-adv
		$this->set_option( 'noodp', true );
		$expected['other'] = array( 'noodp' );
		$this->assertEquals( $expected, $this->class_instance->robots_for_single_post( $robots, $this->post_id ) );

		// test noydir with default meta-robots-adv
		$this->set_option( 'noydir', true );
		$expected['other'] = array( 'noodp', 'noydir' );
		$this->assertEquals( $expected, $this->class_instance->robots_for_single_post( $robots, $this->post_id ) );

		// test meta-robots adv noodp and nosnippet
		WPSEO_Meta::set_value( 'meta-robots-adv', 'noodp,nosnippet', $this->post_id );
		$expected['other'] = array( 'noodp', 'nosnippet' );
		$this->assertEquals( $expected, $this->class_instance->robots_for_single_post( $robots, $this->post_id ) );

		WPSEO_Meta::set_value( 'meta-robots-noindex', '2', $this->post_id );
		$expected['index'] = 'index';
		$this->assertEquals( $expected, $this->class_instance->robots_for_single_post( $robots, $this->post_id ) );
	}

	public function test_canonical() {
		
		// @todo: fix for multisite
		if( is_multisite() ) {
			return;
		}
		
		// test singular
		$this->go_to_post();

		// test default canonical
		$expected = get_permalink( $this->post_id );
		$this->assertEquals( $expected, $this->class_instance->canonical( false ) );

		// test manual override while using no override
		$meta_canon = 'http://canonic.al';
		WPSEO_Meta::set_value( 'canonical', $meta_canon, $this->post_id );
		$this->assertEquals( $expected, $this->class_instance->canonical( false, false, true ) );

		// test manual override
		$this->assertEquals( $meta_canon, $this->class_instance->canonical( false ) );

		// test home page
		$this->go_to_home();
		
		$expected = home_url( '/' );
		$this->assertEquals( $expected, $this->class_instance->canonical( false, false, true ) );

		// test search
		$expected = get_search_link( 'sample query' );
		$this->go_to( $expected );
		$this->assertEquals( $expected, $this->class_instance->canonical( false ) );

		// test taxonomy pages, category pages and tag pages
		// @todo fix for multisite
		$this->go_to_category();
		$expected = get_category_link( $this->category_id );
		$this->assertEquals( $expected, $this->class_instance->canonical( false ) );

		// @todo test post type archives
		// @todo test author archives
		// @todo test date archives
		// @todo test pagination
		// @todo test force_transport
	}

	public function test_adjacent_rel_links() {
		// @todo
	}

	public function test_adjacent_rel_link() {
		// @todo
	}

	public function test_publisher() {

		// no publisher set
		$this->assertFalse( $this->class_instance->publisher() );

		// set publisher option
		$this->class_instance->options['plus-publisher'] = 'https://plus.google.com/+JoostdeValk';

		// publisher set, should echo
		$expected = '<link rel="publisher" href="' . esc_url( $this->class_instance->options['plus-publisher'] ) . '"/>' . "\n";
		
		$this->assertTrue( $this->class_instance->publisher() );
		$this->expectOutput( $expected );
	}

	public function test_author() {
		
		$this->assertFalse( $this->class_instance->author() );

		$this->go_to_post();

		// post type default not set
		$this->assertFalse( $this->class_instance->author() );

		// post type default set but author meta not set
		$this->class_instance->options['noauthorship-post'] = false;
		$this->assertFalse( $this->class_instance->author() );

		// post author meta, but not set
		WPSEO_Meta::set_value( 'authorship', 'always', $this->post_id );
		$this->assertFalse( $this->class_instance->author() );

		// set author meta
		$gplus = 'https://plus.google.com/+JoostdeValk';
		add_user_meta( $this->author_id, 'googleplus', $gplus );
		$expected = '<link rel="author" href="' . esc_url( $gplus ) . '"/>' . "\n";

		// post author meta and user meta set
		$this->assertTrue( $this->class_instance->author() );
		$this->expectOutput( $expected );

		// post type default and user meta set
		WPSEO_Meta::set_value( 'authorship', '-', $this->post_id );
		$this->assertTrue( $this->class_instance->author() );
		$this->expectOutput( $expected );

	}

	public function test_metakeywords() {
		// @todo
	}

	public function test_metadesc() {
		// @todo
	}

	public function test_page_redirect() {
		// should not redirect on home pages
		$this->go_to_home();
		$this->assertFalse( $this->class_instance->page_redirect() );

		// should not redirect when no redirect URL was set
		$this->go_to_post();
		$this->assertFalse( $this->class_instance->page_redirect() );
	}

	public function test_noindex_page() {
		$expected = '<meta name="robots" content="noindex" />' . "\n";
		$this->expectOutput( $expected, $this->class_instance->noindex_page( ) );

	}

	public function test_noindex_feed() {
		// @todo
	}

	public function test_nofollow_link() {
		$input = '<a href="#">A link</a>';
		$expected = str_replace( '<a ', '<a rel="nofollow" ', $input );
		$this->assertEquals( $expected, $this->class_instance->nofollow_link( $input ) );
	}

	public function test_archive_redirect() {
		
		global $wp_query;

		$c = $this->class_instance;

		// test on author, authors enabled -> false
		$wp_query->is_author = true;
		$c->options['disable-author'] = false;
		$this->assertFalse( $c->archive_redirect() );

		// test not on author, authors disabled -> false
		$wp_query->is_author = false;
		$c->options['disable-author'] = true;
		$this->assertFalse( $c->archive_redirect() );

		// test on date, dates enabled -> false
		$wp_query->is_date = true;
		$c->options['disable-date'] = false;
		$this->assertFalse( $c->archive_redirect() );

		// test not on date, dates disabled -> false
		$wp_query->is_date = false;
		$c->options['disable-date'] = true;
		$this->assertFalse( $c->archive_redirect() );
	}

	public function test_attachment_redirect() {

		// should not redirect on home page
		$this->go_to_home();
		$this->assertFalse( $this->class_instance->attachment_redirect() );

		// should not redirect on regular post pages
		$this->go_to_post();
		$this->assertFalse( $this->class_instance->attachment_redirect() );
	}

	public function test_add_trailingslash() {
		$url = 'http://yoast.com/post';

		// test single pages
		$expected = $url;
		$this->assertEquals( $expected, $this->class_instance->add_trailingslash( $url, 'single' ) );

		// test other
		$expected = trailingslashit( $url );
		$this->assertEquals( $expected, $this->class_instance->add_trailingslash( $url, 'other' ) );
	}

	/**
	* @todo WPSEO_Frontend::remove_reply_to_com() returns a relative URL. Is that intended?
	*/
	public function test_remove_reply_to_com() {
		
		$link = '<a href="http://yoast.com/post?replytocom=123#respond">Reply to Comment</a>';
		$expected = '<a href="#comment-123">Reply to Comment</a>';

		$this->assertEquals( $expected, $this->class_instance->remove_reply_to_com( $link ) );
	}

	public function test_replytocom_redirect() {
		$c = $this->class_instance;

		// test with cleanreplytocom set to false
		$c->options['cleanreplytocom'] = false;
		$this->assertFalse( $c->replytocom_redirect() );

		// enable clean replytocom
		$c->options['cleanreplytocom'] = true;

		// go to singular page
		$this->go_to_post();

		// test with no replytocom set in $_GET
		$this->assertFalse( $c->replytocom_redirect() );

		$_GET['replytocom'] = 123;

		// the following call should redirect
		// @todo figure out a way to test this
		// $this->assertTrue( $c->replytocom_redirect() );

		// go to home / move away from singular page
		$this->go_to_home();

		// test while not on singular page
		$this->assertFalse( $c->replytocom_redirect() );	
	}

	public function test_clean_permalink() {
			
		$c = $this->class_instance;

		// test requests to the robots file
		$this->go_to( add_query_arg( array( 'robots' => 1 ), home_url() ) );
		$this->assertFalse( $c->clean_permalink() );

		// test requests to the sitemap
		// @todo get_query_var only returns 'known' query_vars.. 'sitemap' will always return an empty string
		// $this->go_to( add_query_arg( array( 'sitemap' => 1 ), home_url() ) );
		// $this->assertFalse( $c->clean_permalink() );

		// @todo test actual function... good luck ;)
	}

	public function test_rss_replace_vars() {
		
		$c = $this->class_instance;

		$this->go_to_post();

		// input
		$text = 'Some text with some RSS Variables. Written by %%AUTHORLINK%%, the post is %%POSTLINK%% on the blog %%BLOGLINK%%. %%BLOGDESCLINK%%.';
		
		// generate expected output
		$author_link = '<a rel="nofollow" rel="author" href="' . esc_url( get_author_posts_url( $this->post->post_author ) ) . '">' . get_the_author() . '</a>';
		$post_link = '<a rel="nofollow" href="' . esc_url( get_permalink() ) . '">' . get_the_title() . '</a>';
		$blog_link = '<a rel="nofollow" href="' . esc_url( get_bloginfo( 'url' ) ) . '">' . get_bloginfo( 'name' ) . '</a>';
		$blog_desc_link = '<a rel="nofollow" href="' . esc_url( get_bloginfo( 'url' ) ) . '">' . get_bloginfo( 'name' ) . ' - ' . get_bloginfo( 'description' ) . '</a>';
		$expected = stripslashes( trim( $text ) );
		$expected = str_replace( 
			array( '%%AUTHORLINK%%', '%%POSTLINK%%', '%%BLOGLINK%%', '%%BLOGDESCLINK%%'), 
			array( $author_link, $post_link, $blog_link, $blog_desc_link ), 
			$expected 
		);

		// run test
		$this->assertEquals( $expected, $c->rss_replace_vars( $text ) );
	}

	public function test_embed_rssfooter() {

		$input = 'Some content';

		// go to home (non-feed)		
		$this->go_to_home();

		// test if input was unchanged
		$expected = $input;
		$this->assertEquals( $expected, $this->class_instance->embed_rssfooter( $input ) );

		// go to feed
		$this->go_to( get_bloginfo( 'rss2_url' ) );

		// test if input was changed
		$expected = $this->class_instance->embed_rss( $input, 'full' );
		$this->assertEquals( $expected, $this->class_instance->embed_rssfooter( $input ) );
	}

	public function test_embed_rssfooter_excerpt() {

		$input = 'Some content';

		// go to home (non-feed)		
		$this->go_to_home();

		// test if input was unchanged
		$expected = $input;
		$this->assertEquals( $expected, $this->class_instance->embed_rssfooter_excerpt( $input ) );

		// go to feed
		$this->go_to( get_bloginfo( 'rss2_url' ) );
		
		// test if input was changed
		$expected = $this->class_instance->embed_rss( $input, 'excerpt' );
		$this->assertEquals( $expected, $this->class_instance->embed_rssfooter_excerpt( $input ) );
	}

	public function test_embed_rss() {
		$input = 'Some content';

		// go to home (non-feed)		
		$this->go_to_home();

		// test if input was unchanged
		$expected = $input;
		$this->assertEquals( $expected, $this->class_instance->embed_rss( $input, 'full' ) );

		// go to feed
		$this->go_to( get_bloginfo( 'rss2_url' ) );
		
		// test if input was changed
		$expected = wpautop( $this->class_instance->options['rssbefore'] ) . $input;
		$this->assertEquals( $expected, $this->class_instance->embed_rss( $input, 'full' ) );
	}

	public function test_flush_cache() {

		$c = $this->class_instance;

		// should not run when output buffering is not turned on
		$this->assertFalse( $this->class_instance->flush_cache() );

		// turn on output buffering
		$this->class_instance->force_rewrite_output_buffer();
		
		$content = '<!DOCTYPE><html><head><title>TITLETOBEREPLACED</title>' . $this->class_instance->debug_marker( false ) . '</head><body>Some body content. Should remain unchanged.</body></html>';
	
		// create expected output
		global $sep;
		$title = $this->class_instance->title( '', $sep );
		$expected = preg_replace( '/<title(.*)\/title>/i', '', $content );
		$expected = str_replace( $c->debug_marker( false ), $c->debug_marker( false ) . "\n" . '<title>' . $title . '</title>', $expected );
		
		ob_start();	
		echo $content;

		// run function
		$result = $this->class_instance->flush_cache();

		// run assertions
		$this->expectOutput( $expected, $result );
		$this->assertTrue( $result );
	}

	public function test_force_rewrite_output_buffer() {
		$this->class_instance->force_rewrite_output_buffer();
		$this->assertTrue( ( ob_get_level() > 0 ) );
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
		$this->go_to( get_author_posts_url( $this->author_id ) );
	}
	
	/**
	* @param string $name
	* @param string $value 
	*/
	private function set_option( $name, $value ) {
		$this->class_instance->options[$name] = $value;
	}

	/**
	* @param string $name
	* @return string
	*/
	private function get_option( $name ) {
		return $this->class_instance->options[$name];
	}

	/**
	* @param string $option_name
	* @param string $expected
	* @return void
	*/
	private function run_webmaster_tools_authentication_option_test( $option_name, $expected ) {
		$this->set_option( $option_name, $option_name );	
		$this->expectOutput( $expected, $this->class_instance->webmaster_tools_authentication( ) );
		$this->set_option( $option_name, '' );				
	}

	/**
	* @param string $property_name
	* @param mixed $value
	*/
	private function set_post_property( $property_name, $value ) {
		global $post;
		$this->post->{$property_name} = $value;
		$post = $this->post;
	}

}