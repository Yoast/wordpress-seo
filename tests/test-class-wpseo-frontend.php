<?php

class WPSEO_Frontend_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Frontend
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_Frontend;
	}

	public function tearDown() {
		ob_clean();
	}

    /**
     * @covers WPSEO_Frontend::is_home_posts_page
     */
	public function test_is_home_posts_page() {

		$this->go_to_home();
		$this->assertTrue( self::$class_instance->is_home_posts_page() );

		update_option( 'show_on_front', 'page' );
		$this->assertFalse( self::$class_instance->is_home_posts_page() );

		// create and go to post
		update_option( 'show_on_front', 'notapage' );
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );
		$this->assertFalse( self::$class_instance->is_home_posts_page() );
	}

    /**
     * @covers WPSEO_Frontend::is_home_static_page
     */
	public function test_is_home_static_page() {

		// on front page
		$this->go_to_home();
		$this->assertFalse( self::$class_instance->is_home_static_page() );

		// on front page and show_on_front = page
		update_option( 'show_on_front', 'page' );
		$this->assertFalse( self::$class_instance->is_home_static_page() );

		// create page and set it as front page
		$post_id = $this->factory->post->create( array( 'post_type' => 'page' ) );
		update_option( 'page_on_front', $post_id );
		$this->go_to( get_permalink( $post_id ) );

		// on front page, show_on_front = page and on static page
		$this->assertTrue( self::$class_instance->is_home_static_page() );

		// go to differen post but preserve previous options
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// options set but not on front page, should return false
		$this->assertFalse( self::$class_instance->is_home_static_page() );
	}

    /**
     * @covers WPSEO_Frontend::is_posts_page
     */
	public function test_is_posts_page() {

		// on home with show_on_front != page
		update_option( 'show_on_front', 'something' );
		$this->go_to_home();
		$this->assertFalse( self::$class_instance->is_posts_page() );

		// on home with show_on_front = page
		update_option( 'show_on_front', 'page' );
		$this->assertTrue( self::$class_instance->is_posts_page() );

		// go to different post but preserve previous options
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );
		$this->assertFalse( self::$class_instance->is_posts_page() );
	}

    /**
     * @covers WPSEO_Frontend::get_content_title
     */
	public function test_get_content_title() {

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );
		$this->assertFalse( self::$class_instance->is_home_posts_page() );

		// test title according to format
		$expected_title = self::$class_instance->get_title_from_options( 'title-post', get_queried_object() );
		$this->assertEquals( $expected_title, self::$class_instance->get_content_title() );

		// test explicit post title
		$explicit_title = 'WPSEO Post Title %%sitename%%';
		WPSEO_Meta::set_value( 'title', $explicit_title, $post_id );

		$post = get_post( $post_id );
		$expected_title = wpseo_replace_vars( $explicit_title, $post );
		$this->assertEquals( $expected_title, self::$class_instance->get_content_title() );
	}

    /**
     * @covers WPSEO_Frontend::get_taxonomy_title
     */
	public function test_get_taxonomy_title() {

		// @todo fix for multisite
		if( is_multisite() ) {
			return;
		}

		// create and go to cat archive
		$category_id = wp_create_category( "Category Name" );
		$this->go_to( get_category_link( $category_id ) );

		// test title according to format
		$expected_title = self::$class_instance->get_title_from_options( 'title-tax-category', (array) get_queried_object() );
		$this->assertEquals( $expected_title, self::$class_instance->get_taxonomy_title() );

		// @todo add test for an explicit wpseo title format
		// we need an easy way to set taxonomy meta though...
	}

    /**
     * @covers WPSEO_Frontend::get_author_title
     */
	public function test_get_author_title() {

		// create and go to author
		$user_id = $this->factory->user->create( );
		$this->go_to( get_author_posts_url( $user_id ) );

		// test general author title
		$expected_title = self::$class_instance->get_title_from_options( 'title-author-wpseo' );
		$this->assertEquals( $expected_title, self::$class_instance->get_author_title() );

		// add explicit title to author meta
		$explicit_title = 'WPSEO Author Title %%sitename%%';
		add_user_meta( $user_id, 'wpseo_title', $explicit_title );

		// test explicit title
		$expected_title = wpseo_replace_vars( 'WPSEO Author Title %%sitename%%', array() );
		$this->assertEquals( $expected_title, self::$class_instance->get_author_title() );
	}

    /**
     * @covers WPSEO_Frontend::get_title_from_options
     */
	public function test_get_title_from_options() {
		// should return an empty string
		$this->assertEmpty( self::$class_instance->get_title_from_options( '__not-existing-index' ) );

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$var_source = (array) get_queried_object();
		$expected_title = wpseo_replace_vars( '%%title%% %%sep%% %%sitename%%', $var_source );
		$this->assertEquals( $expected_title, self::$class_instance->get_title_from_options( '__not-existing-index', $var_source ) );

		// test with an option that exists
		$index = 'title-post';
		$expected_title = wpseo_replace_vars( self::$class_instance->options[ $index ], $var_source );
		$this->assertEquals( $expected_title, self::$class_instance->get_title_from_options( $index, $var_source ) );
	}

    /**
     * @covers WPSEO_Frontend::get_default_title
     */
	public function test_get_default_title() {
		// TODO
	}

    /**
     * @covers WPSEO_Frontend::add_paging_to_title
     */
	public function test_add_paging_to_title() {
		$input = 'Initial title';

		// test without paged query var set
		$expected = $input;
		$this->assertEquals( $input, self::$class_instance->add_paging_to_title('', '', $input ) );

		// test with paged set
		set_query_var( 'paged', 2 );
		global $wp_query;
		$expected = self::$class_instance->add_to_title( '', '', $input, $wp_query->query_vars['paged'] . '/' . $wp_query->max_num_pages );
		$this->assertEquals( $expected, self::$class_instance->add_paging_to_title( '', '', $input) );
	}

    /**
     * @covers WPSEO_Frontend::add_to_title
     */
	public function test_add_to_title() {

		$title = "Title";
		$sep = " >> ";
		$title_part = "Title Part";

		$expected = $title . $sep . $title_part;
		$this->assertEquals( $expected, self::$class_instance->add_to_title( $sep, 'right', $title, $title_part ) );

		$expected = $title_part . $sep . $title;
		$this->assertEquals( $expected, self::$class_instance->add_to_title( $sep, 'left', $title, $title_part ) );
	}

    /**
     * @covers WPSEO_Frontend::title
     */
	public function test_title() {
		// @todo
	}

    /**
     * @covers WPSEO_Frontend::wp_title
     */
	public function force_wp_title() {
		// @todo
	}

    /**
     * @covers WPSEO_Frontend::debug_marker
     */
	public function test_debug_marker() {
		// test if the version number is shown in the debug marker
		$version_found =  ( stristr( self::$class_instance->debug_marker( false ), WPSEO_VERSION ) !== false );
		$this->assertTrue( $version_found );
	}

    /**
     * @covers WPSEO_Frontend::webmaster_tools_authentication
     */
	public function test_webmaster_tools_authentication() {

		$this->go_to_home();

		$this->run_webmaster_tools_authentication_option_test( 'alexaverify', '<meta name="alexaVerifyID" content="alexaverify" />' . "\n" );
		$this->run_webmaster_tools_authentication_option_test( 'msverify',  '<meta name="msvalidate.01" content="msverify" />' . "\n");
		$this->run_webmaster_tools_authentication_option_test( 'googleverify', '<meta name="google-site-verification" content="googleverify" />' . "\n" );
		$this->run_webmaster_tools_authentication_option_test( 'pinterestverify', '<meta name="p:domain_verify" content="pinterestverify" />' . "\n" );
		$this->run_webmaster_tools_authentication_option_test( 'yandexverify', '<meta name="yandex-verification" content="yandexverify" />' . "\n" );

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$this->run_webmaster_tools_authentication_option_test( 'yandexverify', '');
	}

    /**
     * @covers WPSEO_Frontend::head
     */
	public function test_head() {

		self::$class_instance->head();
		ob_clean();

		$this->assertEquals(1, did_action( 'wpseo_head' ) );
	}

	/**
	 * @covers WPSEO_Frontend::robots
     *
	 * @todo test post type archives
	 * @todo test with noodp and noydir option set
	 * @todo test with page_for_posts option
	 * @todo test date archives
	 * @todo test search results
	 */
	public function test_robots() {
		// go to home
		$this->go_to_home();

		// test home page with no special options
		$expected = '';
		$this->assertEquals( $expected, self::$class_instance->robots() );

		$expected = 'noindex,follow';

		// test WP visibility setting
		update_option( 'blog_public', '0' );
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// clean-up
		update_option( 'blog_public', '1' );

		// test replytocom
		$_GET['replytocom'] = '1';
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// clean-up
		unset( $_GET['replytocom'] );

		// test 'paged' query var
		set_query_var( 'paged', 2 );
		$expected = 'noindex,follow';
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// clean-up
		set_query_var( 'paged', 0 );

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// test regular post with no special options
		$expected = '';
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// test noindex-post option
		$expected = 'noindex,follow';
		self::$class_instance->options['noindex-post'] = true;
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// clean-up
		self::$class_instance->options['noindex-post'] = false;

		// test post_status private
		$expected = 'noindex,follow';

		// test private posts
		global $post;
		$post->post_status = 'private';
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// go to category page
		$category_id = wp_create_category( "Category Name" );

		// add posts to category
		$this->factory->post->create_many( 6, array( 'post_category' => array( $category_id ) ) );

		$category_link = get_category_link( $category_id );
		$this->go_to( $category_link );

		// test regular category with no special options
		$expected = '';
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// test category with noindex-tax-category option
		// TODO fix test for multisite (or code?)
		if( false === is_multisite() ) {
			$expected = 'noindex,follow';
			self::$class_instance->options['noindex-tax-category'] = true;
			$this->assertEquals( $expected, self::$class_instance->robots() );
		
			// clean-up
			self::$class_instance->options['noindex-tax-category'] = false;

			// test subpages of category archives
			update_site_option( 'posts_per_page', 1 );
			self::$class_instance->options['noindex-subpages-wpseo'] = true;
			$this->go_to( add_query_arg( array( 'paged' => 2 ), $category_link ) );

			$expected = 'noindex,follow';
			$this->assertEquals( $expected, self::$class_instance->robots() );
		}
		// go to author page
		$user_id = $this->factory->user->create();
		$this->go_to( get_author_posts_url( $user_id ) );

		// test author archive with no special options
		$expected = '';
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// test author archive with 'noindex-author-wpseo'
		$expected = 'noindex,follow';
		self::$class_instance->options['noindex-author-wpseo'] = true;
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// clean-up
		self::$class_instance->options['noindex-author-wpseo'] = false;
	}

    /**
     * @covers WPSEO_Frontend::robots_for_single_post
     */
	public function test_robots_for_single_post() {

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$robots = array(
			'index' => 'index',
			'follow' => 'follow',
			'other' => array( )
		);
		$expected = $robots;

		// test noindex
		WPSEO_Meta::set_value( 'meta-robots-noindex', '1', $post_id );
		$expected['index'] = 'noindex';
		$this->assertEquals( $expected, self::$class_instance->robots_for_single_post( $robots, $this->post_id ) );

		// test nofollow
		WPSEO_Meta::set_value( 'meta-robots-nofollow', 1, $post_id );
		$expected['follow'] = 'nofollow';
		$this->assertEquals( $expected, self::$class_instance->robots_for_single_post( $robots, $this->post_id ) );

		// test noodp with default meta-robots-adv
		self::$class_instance->options['noodp'] = true;
		$expected['other'] = array( 'noodp' );
		$this->assertEquals( $expected, self::$class_instance->robots_for_single_post( $robots, $this->post_id ) );

		// test noydir with default meta-robots-adv
		self::$class_instance->options['noydir'] = true;
		$expected['other'] = array( 'noodp', 'noydir' );
		$this->assertEquals( $expected, self::$class_instance->robots_for_single_post( $robots, $this->post_id ) );

		// test meta-robots adv noodp and nosnippet
		WPSEO_Meta::set_value( 'meta-robots-adv', 'noodp,nosnippet', $post_id );
		$expected['other'] = array( 'noodp', 'nosnippet' );
		$this->assertEquals( $expected, self::$class_instance->robots_for_single_post( $robots, $this->post_id ) );

		WPSEO_Meta::set_value( 'meta-robots-noindex', '2', $post_id );
		$expected['index'] = 'index';
		$this->assertEquals( $expected, self::$class_instance->robots_for_single_post( $robots, $this->post_id ) );
	}

	/**
	 * @covers WPSEO_Frontend::canonical
	 */
	public function test_canonical() {

		// @todo: fix for multisite
		if( is_multisite() ) {
			return;
		}

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// test default canonical
		$expected = get_permalink( $post_id );
		$this->assertEquals( $expected, self::$class_instance->canonical( false ) );

		// test manual override while using no override
		$meta_canon = 'http://canonic.al';
		WPSEO_Meta::set_value( 'canonical', $meta_canon, $post_id );
		$this->assertEquals( $expected, self::$class_instance->canonical( false, false, true ) );

		// test manual override
		$this->assertEquals( $meta_canon, self::$class_instance->canonical( false ) );

		// test home page
		$this->go_to_home();

		$expected = home_url( '/' );
		$this->assertEquals( $expected, self::$class_instance->canonical( false, false, true ) );

		// test search
		$expected = get_search_link( 'sample query' );
		$this->go_to( $expected );
		$this->assertEquals( $expected, self::$class_instance->canonical( false ) );

		// test taxonomy pages, category pages and tag pages
		$category_id = wp_create_category( "Category Name" );
		$category_link = get_category_link( $category_id );
		$this->go_to( $category_link );

		$expected = $category_link;
		$this->assertEquals( $expected, self::$class_instance->canonical( false ) );

		// @todo test post type archives
		// @todo test author archives
		// @todo test date archives
		// @todo test pagination
		// @todo test force_transport
	}

	/**
	 * @covers WPSEO_Frontend::adjacent_rel_links
	 */
	public function test_adjacent_rel_links() {
		// @todo
	}

	/**
	 * @covers WPSEO_Frontend::adjacent_rel_link
	 */
	public function test_adjacent_rel_link() {
		// @todo
	}

	/**
	 * @covers WPSEO_Frontend::publisher
	 */
	public function test_publisher() {

		// no publisher set
		$this->assertFalse( self::$class_instance->publisher() );

		// set publisher option
		self::$class_instance->options['plus-publisher'] = 'https://plus.google.com/+JoostdeValk';

		// publisher set, should echo
		$expected = '<link rel="publisher" href="' . esc_url( self::$class_instance->options['plus-publisher'] ) . '"/>' . "\n";

		$this->assertTrue( self::$class_instance->publisher() );
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Frontend::author
	 */
	public function test_author() {

		$this->assertFalse( self::$class_instance->author() );

		// create and go to post
		$author_id = $this->factory->user->create( array( 'role' => 'administrator' ) );
		$post_id = $this->factory->post->create( array( 'post_author' => $author_id ) );
		$this->go_to( get_permalink( $post_id ) );

		// post type default not set
		$this->assertFalse( self::$class_instance->author() );

		// post type default set but author meta not set
		self::$class_instance->options['noauthorship-post'] = false;
		$this->assertFalse( self::$class_instance->author() );

		// post author meta, but not set
		WPSEO_Meta::set_value( 'authorship', 'always', $post_id );
		$this->assertFalse( self::$class_instance->author() );

		// set author meta
		$gplus = 'https://plus.google.com/+JoostdeValk';
		add_user_meta( $author_id, 'googleplus', $gplus );
		$expected = '<link rel="author" href="' . esc_url( $gplus ) . '"/>' . "\n";

		// post author meta and user meta set
		$this->assertTrue( self::$class_instance->author() );
		$this->expectOutput( $expected );

		// post type default and user meta set
		WPSEO_Meta::set_value( 'authorship', '-', $post_id );
		$this->assertTrue( self::$class_instance->author() );
		$this->expectOutput( $expected );

	}

	/**
	 * @covers WPSEO_Frontend::metakeywords
	 */
	public function test_metakeywords() {
		// @todo
	}

	/**
	 * @covers WPSEO_Frontend::metadesc
	 */
	public function test_metadesc() {
		// @todo
	}

	/**
	 * @covers WPSEO_Frontend::page_redirect
	 */
	public function test_page_redirect() {
		// should not redirect on home pages
		$this->go_to_home();
		$this->assertFalse( self::$class_instance->page_redirect() );

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// should not redirect when no redirect URL was set
		$this->assertFalse( self::$class_instance->page_redirect() );
	}

	/**
	 * @covers WPSEO_Frontend::noindex_page
	 */
	public function test_noindex_page() {
		$expected = '<meta name="robots" content="noindex" />' . "\n";
		$this->expectOutput( $expected, self::$class_instance->noindex_page( ) );

	}

	/**
	 * @covers WPSEO_Frontend::noindex_feed
	 */
	public function test_noindex_feed() {
		// @todo
	}

	/**
	 * @covers WPSEO_Frontend::nofollow_link
	 */
	public function test_nofollow_link() {
		$input = '<a href="#">A link</a>';
		$expected = str_replace( '<a ', '<a rel="nofollow" ', $input );
		$this->assertEquals( $expected, self::$class_instance->nofollow_link( $input ) );
	}

	/**
	 * @covers WPSEO_Frontend::archive_redirect
	 */
	public function test_archive_redirect() {

		global $wp_query;

		$c = self::$class_instance;

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

	/**
	 * @covers WPSEO_Frontend::attachment_redirect
	 */
	public function test_attachment_redirect() {

		// should not redirect on home page
		$this->go_to_home();
		$this->assertFalse( self::$class_instance->attachment_redirect() );

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// should not redirect on regular post pages
		$this->assertFalse( self::$class_instance->attachment_redirect() );
	}

	/**
	 * @covers WPSEO_Frontend::add_trailingslash
	 */
	public function test_add_trailingslash() {
		$url = 'http://yoast.com/post';

		// test single pages
		$expected = $url;
		$this->assertEquals( $expected, self::$class_instance->add_trailingslash( $url, 'single' ) );

		// test other
		$expected = trailingslashit( $url );
		$this->assertEquals( $expected, self::$class_instance->add_trailingslash( $url, 'other' ) );
	}

	/**
	 * @covers WPSEO_Frontend::remove_reply_to_com
	 */
	public function test_remove_reply_to_com() {

		$link = '<a href="http://yoast.com/post?replytocom=123#respond">Reply to Comment</a>';
		$expected = '<a href="#comment-123">Reply to Comment</a>';

		$this->assertEquals( $expected, self::$class_instance->remove_reply_to_com( $link ) );
	}

	/**
	 * @covers WPSEO_Frontend::replytocom_redirect
	 */
	public function test_replytocom_redirect() {
		$c = self::$class_instance;

		// test with cleanreplytocom set to false
		$c->options['cleanreplytocom'] = false;
		$this->assertFalse( $c->replytocom_redirect() );

		// enable clean replytocom
		$c->options['cleanreplytocom'] = true;

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

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

	/**
	 * @covers WPSEO_Frontend::clean_permalink
	 */
	public function test_clean_permalink() {

		$c = self::$class_instance;

		// test requests to the robots file
		$this->go_to( add_query_arg( array( 'robots' => 1 ), home_url() ) );
		$this->assertFalse( $c->clean_permalink() );

		// test requests to the sitemap
		// @todo get_query_var only returns 'known' query_vars.. 'sitemap' will always return an empty string
		// $this->go_to( add_query_arg( array( 'sitemap' => 1 ), home_url() ) );
		// $this->assertFalse( $c->clean_permalink() );

		// @todo test actual function... good luck ;)
	}

	/**
	 * @covers WPSEO_Frontend::rss_replace_vars
	 */
	public function test_rss_replace_vars() {

		$c = self::$class_instance;

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

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

	/**
	 * @covers WPSEO_Frontend::embed_rssfooter
	 */
	public function test_embed_rssfooter() {

		$input = 'Some content';

		// go to home (non-feed)
		$this->go_to_home();

		// test if input was unchanged
		$expected = $input;
		$this->assertEquals( $expected, self::$class_instance->embed_rssfooter( $input ) );

		// go to feed
		$this->go_to( get_bloginfo( 'rss2_url' ) );

		// test if input was changed
		$expected = self::$class_instance->embed_rss( $input, 'full' );
		$this->assertEquals( $expected, self::$class_instance->embed_rssfooter( $input ) );
	}

	/**
	 * @covers WPSEO_Frontend::embed_rssfooter_excerpt
	 */
	public function test_embed_rssfooter_excerpt() {

		$input = 'Some content';

		// go to home (non-feed)
		$this->go_to_home();

		// test if input was unchanged
		$expected = $input;
		$this->assertEquals( $expected, self::$class_instance->embed_rssfooter_excerpt( $input ) );

		// go to feed
		$this->go_to( get_bloginfo( 'rss2_url' ) );

		// test if input was changed
		$expected = self::$class_instance->embed_rss( $input, 'excerpt' );
		$this->assertEquals( $expected, self::$class_instance->embed_rssfooter_excerpt( $input ) );
	}

	/**
	 * @covers WPSEO_Frontend::embed_rss
	 */
	public function test_embed_rss() {
		$input = 'Some content';

		// go to home (non-feed)
		$this->go_to_home();

		// test if input was unchanged
		$expected = $input;
		$this->assertEquals( $expected, self::$class_instance->embed_rss( $input, 'full' ) );

		// go to feed
		$this->go_to( get_bloginfo( 'rss2_url' ) );

		// test if input was changed
		self::$class_instance->options['rssbefore'] = "Some RSS before text";
		$expected = wpautop( self::$class_instance->options['rssbefore'] ) . $input;
		$this->assertEquals( $expected, self::$class_instance->embed_rss( $input, 'full' ) );
	}

	/**
	 * @covers WPSEO_Frontend::flush_cache
	 */
	public function test_flush_cache() {

		$c = self::$class_instance;

		// should not run when output buffering is not turned on
		$this->assertFalse( self::$class_instance->flush_cache() );

		// turn on output buffering
		self::$class_instance->force_rewrite_output_buffer();

		$content = '<!DOCTYPE><html><head><title>TITLETOBEREPLACED</title>' . self::$class_instance->debug_marker( false ) . '</head><body>Some body content. Should remain unchanged.</body></html>';

		// create expected output
		global $sep;
		$title = self::$class_instance->title( '', $sep );
		$expected = preg_replace( '/<title(.*)\/title>/i', '', $content );
		$expected = str_replace( $c->debug_marker( false ), $c->debug_marker( false ) . "\n" . '<title>' . $title . '</title>', $expected );
		echo $content;

		// run function
		$result = self::$class_instance->flush_cache();

		// run assertions
		$this->expectOutput( $expected, $result );
		$this->assertTrue( $result );
	}

	/**
	 * @covers WPSEO_Frontend::force_rewrite_output_buffer
	 */
	public function test_force_rewrite_output_buffer() {
		self::$class_instance->force_rewrite_output_buffer();
		$this->assertTrue( ( ob_get_level() > 0 ) );
	}

	/**
	 * @covers WPSEO_Frontend::title_test_helper
	 */
	public function test_title_test_helper() {
		// @todo
	}

	/**
	* @param string $name
	* @return string
	*/
	private function get_option( $name ) {
		return self::$class_instance->options[$name];
	}

	/**
	 * @param string $option_name
	 * @param string $expected
	 * @return void
	 */
	private function run_webmaster_tools_authentication_option_test( $option_name, $expected ) {
		self::$class_instance->options[$option_name] = $option_name;
		$this->expectOutput( $expected, self::$class_instance->webmaster_tools_authentication( ) );
		self::$class_instance->options[$option_name] = '';
	}


}