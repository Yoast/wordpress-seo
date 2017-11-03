<?php
/**
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Frontend_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Frontend_Double
	 */
	private static $class_instance;

	/**
	 * Setting up.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		require_once WPSEO_TESTS_PATH . 'doubles/frontend-double.php';

		self::$class_instance = WPSEO_Frontend_Double::get_instance();
	}

	/**
	 * Reset after running a test.
	 */
	public function tearDown() {
		parent::tearDown();

		ob_clean();
		self::$class_instance->reset();
		update_option( 'posts_per_page', 10 );
	}

	/**
	 * @covers WPSEO_Frontend::is_home_posts_page
	 */
	public function test_is_home_posts_page() {

		$this->go_to_home();
		$this->assertTrue( self::$class_instance->is_home_posts_page() );

		update_option( 'show_on_front', 'page' );
		$this->assertFalse( self::$class_instance->is_home_posts_page() );

		// Create and go to post.
		update_option( 'show_on_front', 'notapage' );
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );
		$this->assertFalse( self::$class_instance->is_home_posts_page() );
	}

	/**
	 * @covers WPSEO_Frontend::is_home_static_page
	 */
	public function test_is_home_static_page() {

		// On front page.
		$this->go_to_home();
		$this->assertFalse( self::$class_instance->is_home_static_page() );

		// On front page and show_on_front = page.
		update_option( 'show_on_front', 'page' );
		$this->assertFalse( self::$class_instance->is_home_static_page() );

		// Create page and set it as front page.
		$post_id = $this->factory->post->create( array( 'post_type' => 'page' ) );
		update_option( 'page_on_front', $post_id );
		$this->go_to( get_permalink( $post_id ) );

		// On front page, show_on_front = page and on static page.
		$this->assertTrue( self::$class_instance->is_home_static_page() );

		// Go to differen post but preserve previous options.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Options set but not on front page, should return false.
		$this->assertFalse( self::$class_instance->is_home_static_page() );
	}

	/**
	 * @covers WPSEO_Frontend::is_posts_page
	 */
	public function test_is_posts_page() {

		// On home with show_on_front != page.
		update_option( 'show_on_front', 'something' );
		$this->go_to_home();
		$this->assertFalse( self::$class_instance->is_posts_page() );

		// On home with show_on_front = page.
		update_option( 'show_on_front', 'page' );
		$this->assertTrue( self::$class_instance->is_posts_page() );

		// Go to different post but preserve previous options.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );
		$this->assertFalse( self::$class_instance->is_posts_page() );
	}

	/**
	 * @covers WPSEO_Frontend::get_content_title
	 */
	public function test_get_content_title() {

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );
		$this->assertFalse( self::$class_instance->is_home_posts_page() );

		// Test title according to format.
		$expected_title = self::$class_instance->get_title_from_options( 'title-post', get_queried_object() );
		$this->assertEquals( $expected_title, self::$class_instance->get_content_title() );

		// Test explicit post title.
		$explicit_title = 'WPSEO Post Title %%sitename%%';
		WPSEO_Meta::set_value( 'title', $explicit_title, $post_id );

		$post           = get_post( $post_id );
		$expected_title = wpseo_replace_vars( $explicit_title, $post );
		$this->assertEquals( $expected_title, self::$class_instance->get_content_title() );
	}

	/**
	 * @covers WPSEO_Frontend::get_taxonomy_title
	 */
	public function test_get_taxonomy_title() {

		// Create and go to cat archive.
		$category_id = wp_create_category( 'Category Name' );
		flush_rewrite_rules();

		$this->go_to( get_category_link( $category_id ) );

		// Test title according to format.
		$expected_title = self::$class_instance->get_title_from_options( 'title-tax-category', (array) get_queried_object() );
		$this->assertEquals( $expected_title, self::$class_instance->get_taxonomy_title() );

		// @todo Add test for an explicit wpseo title format.
		// We need an easy way to set taxonomy meta though...
	}

	/**
	 * @covers WPSEO_Frontend::get_author_title
	 */
	public function test_get_author_title() {

		// Create and go to author.
		$user_id = $this->factory->user->create();
		$this->go_to( get_author_posts_url( $user_id ) );

		// Test general author title.
		$expected_title = self::$class_instance->get_title_from_options( 'title-author-wpseo' );
		$this->assertEquals( $expected_title, self::$class_instance->get_author_title() );

		// Add explicit title to author meta.
		$explicit_title = 'WPSEO Author Title %%sitename%%';
		add_user_meta( $user_id, 'wpseo_title', $explicit_title );

		// Test explicit title.
		$expected_title = wpseo_replace_vars( 'WPSEO Author Title %%sitename%%', array() );
		$this->assertEquals( $expected_title, self::$class_instance->get_author_title() );
	}

	/**
	 * @covers WPSEO_Frontend::get_title_from_options
	 */
	public function test_get_title_from_options() {
		// Should return an empty string.
		$this->assertEmpty( self::$class_instance->get_title_from_options( '__not-existing-index' ) );

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$var_source     = (array) get_queried_object();
		$expected_title = wpseo_replace_vars( '%%title%% %%sep%% %%sitename%%', $var_source );
		$this->assertEquals( $expected_title, self::$class_instance->get_title_from_options( '__not-existing-index', $var_source ) );

		// Test with an option that exists.
		$index          = 'title-post';
		$expected_title = wpseo_replace_vars( self::$class_instance->options[ $index ], $var_source );
		$this->assertEquals( $expected_title, self::$class_instance->get_title_from_options( $index, $var_source ) );
	}

	/**
	 * @covers WPSEO_Frontend::get_default_title
	 */
	public function test_get_default_title() {
		// @todo
	}

	/**
	 * @covers WPSEO_Frontend::add_paging_to_title
	 */
	public function test_add_paging_to_title() {
		$input = 'Initial title';

		// Test without paged query var set.
		$expected = $input;
		$this->assertEquals( $input, self::$class_instance->add_paging_to_title( '', '', $input ) );

		// Test with paged set.
		set_query_var( 'paged', 2 );
		global $wp_query;
		$expected = self::$class_instance->add_to_title( '', '', $input, $wp_query->query_vars['paged'] . '/' . $wp_query->max_num_pages );
		$this->assertEquals( $expected, self::$class_instance->add_paging_to_title( '', '', $input ) );
	}

	/**
	 * @covers WPSEO_Frontend::add_to_title
	 */
	public function test_add_to_title() {

		$title      = 'Title';
		$sep        = ' >> ';
		$title_part = 'Title Part';

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
	 * @covers WPSEO_Frontend::debug_mark
	 */
	public function test_debug_mark() {
		// Test if the version number is shown in the debug marker.
		$version_found = ( stristr( self::$class_instance->debug_mark( false ), WPSEO_VERSION ) !== false );
		$this->assertTrue( $version_found );
	}

	/**
	 * @covers WPSEO_Frontend::webmaster_tools_authentication
	 */
	public function test_webmaster_tools_authentication_home() {

		$this->go_to_home();

		$this->run_webmaster_tools_authentication_option_test( 'msverify', '<meta name="msvalidate.01" content="msverify" />' . "\n" );
		$this->run_webmaster_tools_authentication_option_test( 'googleverify', '<meta name="google-site-verification" content="googleverify" />' . "\n" );
		$this->run_webmaster_tools_authentication_option_test( 'yandexverify', '<meta name="yandex-verification" content="yandexverify" />' . "\n" );
	}

	/**
	 * @covers WPSEO_Frontend::head
	 */
	public function test_head() {
		self::$class_instance->head();

		$this->assertEquals( 1, did_action( 'wpseo_head' ) );
	}

	/**
	 * @covers WPSEO_Frontend::canonical
	 */
	public function test_canonical_single_post() {
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );
		$expected = get_permalink( $post_id );
		$this->assertEquals( $expected, self::$class_instance->canonical( false ) );
	}

	/**
	 * @covers WPSEO_Frontend::canonical
	 */
	public function test_canonical_single_post_override() {

		// Create and go to post.
		$post_id = $this->factory->post->create();

		// Test default canonical.
		$expected = get_permalink( $post_id );

		// Test manual override while using no override.
		$meta_canon = 'http://canonic.al';
		WPSEO_Meta::set_value( 'canonical', $meta_canon, $post_id );
		$this->go_to( get_permalink( $post_id ) );
		$this->assertEquals( $expected, self::$class_instance->canonical( false, false, true ) );

		// Test manual override.
		$this->assertEquals( $meta_canon, self::$class_instance->canonical( false ) );
	}

	/**
	 * @covers WPSEO_Frontend::canonical
	 */
	public function test_canonical_home() {
		update_option( 'posts_per_page', 1 );

		$this->factory->post->create_many( 3 );

		$url = WPSEO_Utils::home_url();

		$this->run_test_on_consecutive_pages( $url );
	}

	/**
	 * @covers WPSEO_Frontend::canonical
	 */
	public function test_canonical_search() {
		update_option( 'posts_per_page', 1 );

		$this->factory->post->create_many( 3, array( 'post_title' => 'sample post %d' ) );

		// Test search.
		$search_link = get_search_link( 'sample post' );

		$this->run_test_on_consecutive_pages( $search_link );
	}

	/**
	 * @covers WPSEO_Frontend::adjacent_rel_links
	 * @covers WPSEO_Frontend::canonical
	 */
	public function test_adjacent_rel_links_canonical_post_type() {
		update_option( 'posts_per_page', 1 );

		register_post_type(
			'yoast',
			array(
				'public'      => true,
				'has_archive' => true,
			)
		);

		$this->factory->post->create_many( 3, array( 'post_type' => 'yoast' ) );

		flush_rewrite_rules();

		$archive_url = get_post_type_archive_link( 'yoast' );

		$this->run_test_on_consecutive_pages( $archive_url );
	}

	/**
	 * @covers WPSEO_Frontend::adjacent_rel_links
	 * @covers WPSEO_Frontend::canonical
	 */
	public function test_adjacent_rel_links_canonical_author() {
		update_option( 'posts_per_page', 1 );

		$user_id = $this->factory->user->create( array( 'role' => 'editor' ) );

		$this->factory->post->create_many( 3, array( 'post_author' => $user_id ) );

		$user     = new WP_User( $user_id );
		$user_url = get_author_posts_url( $user_id, $user->user_nicename );

		$this->run_test_on_consecutive_pages( $user_url );
	}

	/**
	 * @covers WPSEO_Frontend::adjacent_rel_links
	 * @covers WPSEO_Frontend::canonical
	 */
	public function test_adjacent_rel_links_canonical_date_archive() {
		update_option( 'posts_per_page', 1 );

		$this->factory->post->create_many( 3 );

		$date_link = get_day_link( false, false, false );  // Having three times false generates a link for today, which is what we need.
		$this->run_test_on_consecutive_pages( $date_link );
	}

	/**
	 * @covers WPSEO_Frontend::adjacent_rel_links
	 * @covers WPSEO_Frontend::canonical
	 */
	public function test_adjacent_rel_links_canonical_category() {
		update_option( 'posts_per_page', 1 );

		// Create a category, add 26 posts to it, go to page 2 of its archives.
		$category_id = wp_create_category( 'Yoast SEO Plugins' );
		$this->factory->post->create_many( 3, array( 'post_category' => array( $category_id ) ) );

		// This shouldn't be necessary but apparently multisite's rewrites are borked when you create a category and you don't flush (on 4.0 only).
		flush_rewrite_rules();

		$category_link = get_category_link( $category_id );

		$this->run_test_on_consecutive_pages( $category_link );
	}

	/**
	 * @covers WPSEO_Frontend::canonical
	 */
	public function test_canonical_filter() {
		add_filter( 'wpseo_canonical', '__return_false' );
		self::$class_instance->canonical();
		$this->expectOutput( '' );

		self::$class_instance->reset();
		remove_filter( 'wpseo_canonical', '__return_false' );
		add_filter( 'wpseo_canonical', array( $this, 'filter_canonical_test' ) );
		$this->go_to( home_url() );
		$this->assertEquals( 'http://canonic.al', self::$class_instance->canonical( false ) );
	}

	/**
	 * Used to test the workings of canonical.
	 *
	 * @return string
	 */
	public function filter_canonical_test() {
		return 'http://canonic.al';
	}

	/**
	 * @covers WPSEO_Frontend::publisher
	 */
	public function test_publisher() {

		// No publisher set.
		$this->assertFalse( self::$class_instance->publisher() );

		// Set publisher option.
		self::$class_instance->options['plus-publisher'] = 'https://plus.google.com/+JoostdeValk';

		// Publisher set, should echo.
		$expected = '<link rel="publisher" href="' . esc_url( self::$class_instance->options['plus-publisher'] ) . '"/>' . "\n";

		$this->assertTrue( self::$class_instance->publisher() );
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
		// Should not redirect on home pages.
		$this->go_to_home();
		$this->assertFalse( self::$class_instance->page_redirect() );

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Should not redirect when no redirect URL was set.
		$this->assertFalse( self::$class_instance->page_redirect() );
	}

	/**
	 * @covers WPSEO_Frontend::nofollow_link
	 */
	public function test_nofollow_link() {
		$input    = '<a href="#">A link</a>';
		$expected = str_replace( '<a ', '<a rel="nofollow" ', $input );
		$this->assertEquals( $expected, self::$class_instance->nofollow_link( $input ) );
	}

	/**
	 * @covers WPSEO_Frontend::archive_redirect
	 */
	public function test_archive_redirect() {

		global $wp_query;

		$c = self::$class_instance;

		// Test on author, authors enabled -> false.
		$wp_query->is_author          = true;
		$c->options['disable-author'] = false;
		$this->assertFalse( $c->archive_redirect() );

		// Test not on author, authors disabled -> false.
		$wp_query->is_author          = false;
		$c->options['disable-author'] = true;
		$this->assertFalse( $c->archive_redirect() );

		// Test on date, dates enabled -> false.
		$wp_query->is_date          = true;
		$c->options['disable-date'] = false;
		$this->assertFalse( $c->archive_redirect() );

		// Test not on date, dates disabled -> false.
		$wp_query->is_date          = false;
		$c->options['disable-date'] = true;
		$this->assertFalse( $c->archive_redirect() );
	}

	/**
	 * Tests for attachment redirect an attachment page with parent.
	 *
	 * @covers WPSEO_Frontend::attachment_redirect
	 */
	public function test_attachment_redirect() {
		// Create parent post ID.
		$parent_post_id = $this->factory->post->create();

		// Create an attachment with parent.
		$post_id = $this->factory->post->create( array(
			'post_type' => 'attachment',
			'post_parent' => $parent_post_id
		));
		$this->go_to( get_permalink( $post_id ) );

		// Make sure the redirect is applied.
		$this->assertTrue( self::$class_instance->attachment_redirect() );
	}

	/**
	 * Tests for attachment redirect on a non-attachment page.
	 *
	 * @covers WPSEO_Frontend::attachment_redirect
	 */
	public function test_attachment_redirect_no_attachment() {
		$post_id = $this->factory->post->create( array(
			'post_type' => 'post'
		));
		$this->go_to( get_permalink( $post_id ) );

		// Should not redirect on regular post pages.
		$this->assertFalse( self::$class_instance->attachment_redirect() );
	}

	/**
	 * Tests for a request without a valid post object.
	 *
	 * @covers WPSEO_Frontend::attachment_redirect
	 */
	public function test_attachment_redirect_no_post_object() {
		global $post;

		$saved_post = $post;
		$post = null;

		$this->assertFalse( self::$class_instance->attachment_redirect() );

		// Restore global Post.
		$post = $saved_post;
	}

	/**
	 * Tests for a request without a parent on an attachment.
	 *
	 * @covers WPSEO_Frontend::attachment_redirect
	 */
	public function test_attachment_redirect_no_parent() {
		// create and go to post
		$post_id = $this->factory->post->create( array(
			'post_type' => 'attachment',
			'post_parent' => 0,
		));
		$this->go_to( get_permalink( $post_id ) );

		$this->assertFalse( self::$class_instance->attachment_redirect() );
		$this->assertEquals( 1, did_action( 'wpseo_redirect_orphan_attachment' ) );
	}

	/**
	 * @covers WPSEO_Frontend::add_trailingslash
	 */
	public function test_add_trailingslash() {
		$url = 'http://yoast.com/post';

		// Test single pages.
		$expected = $url;
		$this->assertEquals( $expected, self::$class_instance->add_trailingslash( $url, 'single' ) );

		// Test other.
		$expected = trailingslashit( $url );
		$this->assertEquals( $expected, self::$class_instance->add_trailingslash( $url, 'other' ) );
	}

	/**
	 * @covers WPSEO_Frontend::remove_reply_to_com
	 */
	public function test_remove_reply_to_com() {

		$link     = '<a href="http://yoast.com/post?replytocom=123#respond">Reply to Comment</a>';
		$expected = '<a href="#comment-123">Reply to Comment</a>';

		$this->assertEquals( $expected, self::$class_instance->remove_reply_to_com( $link ) );
	}

	/**
	 * @covers WPSEO_Frontend::replytocom_redirect
	 */
	public function test_replytocom_redirect() {
		$c = self::$class_instance;

		// Test with cleanreplytocom set to false.
		$c->options['cleanreplytocom'] = false;
		$this->assertFalse( $c->replytocom_redirect() );

		// Enable clean replytocom.
		$c->options['cleanreplytocom'] = true;

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Test with no replytocom set in $_GET.
		$this->assertFalse( $c->replytocom_redirect() );

		$_GET['replytocom'] = 123;
		$_SERVER['QUERY_STRING'] = '';

		// The following call should redirect.
		$this->assertTrue( $c->replytocom_redirect() );

		// Go to home / move away from singular page.
		$this->go_to_home();

		// Test while not on singular page.
		$this->assertFalse( $c->replytocom_redirect() );
	}

	/**
	 * @covers WPSEO_Frontend::clean_permalink
	 */
	public function test_clean_permalink() {

		$c = self::$class_instance;

		// Test requests to the robots file.
		$this->go_to( add_query_arg( array( 'robots' => 1 ), home_url( '/' ) ) );
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

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Input.
		$text = 'Some text with some RSS Variables. Written by %%AUTHORLINK%%, the post is %%POSTLINK%% on the blog %%BLOGLINK%%. %%BLOGDESCLINK%%.';

		// Generate expected output.
		$post           = get_post( $post_id );
		$author_link    = '<a rel="nofollow" href="' . esc_url( get_author_posts_url( $post->post_author ) ) . '">' . get_the_author() . '</a>';
		$post_link      = '<a rel="nofollow" href="' . esc_url( get_permalink() ) . '">' . get_the_title() . '</a>';
		$blog_link      = '<a rel="nofollow" href="' . esc_url( get_bloginfo( 'url' ) ) . '">' . get_bloginfo( 'name' ) . '</a>';
		$blog_desc_link = '<a rel="nofollow" href="' . esc_url( get_bloginfo( 'url' ) ) . '">' . get_bloginfo( 'name' ) . ' - ' . get_bloginfo( 'description' ) . '</a>';
		$expected       = stripslashes( trim( $text ) );
		$expected       = str_replace(
			array( '%%AUTHORLINK%%', '%%POSTLINK%%', '%%BLOGLINK%%', '%%BLOGDESCLINK%%' ),
			array( $author_link, $post_link, $blog_link, $blog_desc_link ),
			$expected
		);

		// Run test.
		$this->assertEquals( $expected, $c->rss_replace_vars( $text ) );
	}

	/**
	 * @covers WPSEO_Frontend::embed_rssfooter
	 */
	public function test_embed_rssfooter() {

		$input = 'Some content';

		// Go to home (non-feed).
		$this->go_to_home();

		// Test if input was unchanged.
		$expected = $input;
		$this->assertEquals( $expected, self::$class_instance->embed_rssfooter( $input ) );

		// Go to feed.
		$this->go_to( get_bloginfo( 'rss2_url' ) );

		// Test if input was changed.
		$expected = self::$class_instance->embed_rss( $input, 'full' );
		$this->assertEquals( $expected, self::$class_instance->embed_rssfooter( $input ) );
	}

	/**
	 * @covers WPSEO_Frontend::embed_rssfooter_excerpt
	 */
	public function test_embed_rssfooter_excerpt() {

		$input = 'Some content';

		// Go to home (non-feed).
		$this->go_to_home();

		// Test if input was unchanged.
		$expected = $input;
		$this->assertEquals( $expected, self::$class_instance->embed_rssfooter_excerpt( $input ) );

		// Go to feed.
		$this->go_to( get_bloginfo( 'rss2_url' ) );

		// Test if input was changed.
		$expected = self::$class_instance->embed_rss( $input, 'excerpt' );
		$this->assertEquals( $expected, self::$class_instance->embed_rssfooter_excerpt( $input ) );
	}

	/**
	 * @covers WPSEO_Frontend::embed_rss
	 */
	public function test_embed_rss() {
		$input = 'Some other content';

		// Go to home (non-feed).
		$this->go_to_home();

		// Test if input was unchanged.
		$expected = $input;
		$this->assertEquals( $expected, self::$class_instance->embed_rss( $input ) );

		// Go to feed.
		$this->go_to( get_bloginfo( 'rss2_url' ) );

		// Test if input was changed.
		self::$class_instance->options['rssbefore'] = 'Some RSS before text';
		self::$class_instance->options['rssafter']  = '';
		$expected                                   = wpautop( self::$class_instance->options['rssbefore'] ) . $input;
		$this->assertEquals( $expected, self::$class_instance->embed_rss( $input, 'full' ) );
	}

	/**
	 * @covers WPSEO_Frontend::flush_cache
	 */
	public function test_flush_cache() {

		$c = self::$class_instance;

		// Should not run when output buffering is not turned on.
		$this->assertFalse( self::$class_instance->flush_cache() );

		// Turn on output buffering.
		self::$class_instance->force_rewrite_output_buffer();

		$content = '<!DOCTYPE><html><head><title>TITLETOBEREPLACED</title>' . self::$class_instance->debug_mark( false ) . '</head><body>Some body content. Should remain unchanged.</body></html>';

		// Create expected output.
		global $sep;
		$title    = self::$class_instance->title( '', $sep );
		$expected = preg_replace( '/<title(.*)\/title>/i', '', $content );
		$expected = str_replace( $c->debug_mark( false ), $c->debug_mark( false ) . "\n" . '<title>' . $title . '</title>', $expected );
		echo $content;

		// Run function.
		$result = self::$class_instance->flush_cache();

		// Run assertions.
		$this->expectOutput( $expected, $result );
		$this->assertTrue( $result );
	}

	/**
	 * @covers WPSEO_Frontend::force_rewrite_output_buffer
	 */
	public function test_force_rewrite_output_buffer() {
		self::$class_instance->force_rewrite_output_buffer();
		$this->assertTrue( ( ob_get_level() > 0 ) );
		ob_get_clean();
	}

	/**
	 * @covers WPSEO_Frontend::title_test_helper
	 */
	public function test_title_test_helper() {
		// @todo
	}



	/**
	 * @param string $initial_url
	 *
	 * @return void
	 */
	private function run_test_on_consecutive_pages( $initial_url ) {
		// Test page 1 of the post type archives, should have just a rel=next and a canonical.
		$this->go_to( $initial_url );

		$page_2_link = get_pagenum_link( 2, false );
		$expected    = '<link rel="next" href="' . esc_url( $page_2_link ) . '" />' . "\n";

		self::$class_instance->adjacent_rel_links();
		$this->assertEquals( $initial_url, self::$class_instance->canonical( false ) );
		$this->expectOutput( $expected );


		// Test page 2 of the post type archives, should have a rel=next and rel=prev and a canonical.
		self::$class_instance->reset();
		$this->go_to( $page_2_link );

		$page_3_link = get_pagenum_link( 3, false );
		$expected    = '<link rel="prev" href="' . esc_url( $initial_url ) . '" />' . "\n" . '<link rel="next" href="' . esc_url( $page_3_link ) . '" />' . "\n";

		self::$class_instance->adjacent_rel_links();
		$this->assertEquals( $page_2_link, self::$class_instance->canonical( false ) );
		$this->expectOutput( $expected );

		// Test page 3 of the author archives, should have just a rel=prev and a canonical.
		self::$class_instance->reset();
		$this->go_to( $page_3_link );

		$expected = '<link rel="prev" href="' . esc_url( $page_2_link ) . '" />' . "\n";
		self::$class_instance->adjacent_rel_links();
		$this->assertEquals( $page_3_link, self::$class_instance->canonical( false ) );
		$this->expectOutput( $expected );
	}

	/**
	 * @param string $name
	 *
	 * @return string
	 */
	private function get_option( $name ) {
		return self::$class_instance->options[ $name ];
	}

	/**
	 * @param string $option_name
	 * @param string $expected
	 *
	 * @return void
	 */
	private function run_webmaster_tools_authentication_option_test( $option_name, $expected ) {
		self::$class_instance->options[ $option_name ] = $option_name;
		$this->expectOutput( $expected, self::$class_instance->webmaster_tools_authentication() );
		self::$class_instance->options[ $option_name ] = '';
	}

	/**
	 * @param string $expected
	 *
	 * @return void
	 */
	private function run_json_ld_test( $expected ) {
		$this->expectOutput( $expected, self::$class_instance->internal_search_json_ld() );
	}

	/**
	 * Override the go_to function in core as its broken when path isn't set.
	 *
	 * Can be removed when https://core.trac.wordpress.org/ticket/31417 is fixed and in all releases we're testing (so when 4.2 is the lowest common denominator).
	 *
	 * @param string $url
	 */
	public function go_to( $url ) {
		// Note: the WP and WP_Query classes like to silently fetch parameters
		// from all over the place (globals, GET, etc), which makes it tricky
		// to run them more than once without very carefully clearing everything.
		$_GET  = array();
		$_POST = array();

		$keys = array(
			'query_string',
			'id',
			'postdata',
			'authordata',
			'day',
			'currentmonth',
			'page',
			'pages',
			'multipage',
			'more',
			'numpages',
			'pagenow',
		);

		foreach ( $keys as $v ) {
			if ( isset( $GLOBALS[ $v ] ) ) {
				unset( $GLOBALS[ $v ] );
			}
		}
		$parts = wp_parse_url( $url );
		if ( isset( $parts['scheme'] ) ) {
			$req = isset( $parts['path'] ) ? $parts['path'] : '';
			if ( isset( $parts['query'] ) ) {
				$req .= '?' . $parts['query'];
				// Parse the url query vars into $_GET.
				parse_str( $parts['query'], $_GET );
			}
		}
		else {
			$req = $url;
		}
		if ( ! isset( $parts['query'] ) ) {
			$parts['query'] = '';
		}

		$_SERVER['REQUEST_URI'] = $req;
		unset( $_SERVER['PATH_INFO'] );

		$this->flush_cache();
		unset( $GLOBALS['wp_query'], $GLOBALS['wp_the_query'] );
		$GLOBALS['wp_the_query'] = new WP_Query();
		$GLOBALS['wp_query']     = $GLOBALS['wp_the_query'];
		$GLOBALS['wp']           = new WP();
		_cleanup_query_vars();

		$GLOBALS['wp']->main( $parts['query'] );
	}
}
