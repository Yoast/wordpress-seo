<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group frontend
 */
class WPSEO_Frontend_Test extends WPSEO_UnitTestCase_Frontend {

	/**
	 * Setting up.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		self::$class_instance = WPSEO_Frontend_Double::get_instance();
	}

	/**
	 * Reset permalink structure.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();
		$this->set_permalink_structure( '' );
		create_initial_taxonomies();
	}

	/**
	 * Reset after running a test.
	 */
	public function tearDown() {
		parent::tearDown();

		$this->reset_post_types();

		ob_clean();
		self::$class_instance->reset();
		update_option( 'posts_per_page', 10 );
	}

	/**
	 * @covers WPSEO_Frontend::get_debug_mark
	 */
	public function test_debug_mark() {
		// Test if the version number is shown in the debug marker.
		$this->assertContains( 'v' . WPSEO_VERSION, self::$class_instance->get_debug_mark() );
	}

	/**
	 * @covers WPSEO_Frontend::get_debug_mark
	 */
	public function test_debug_mark_hide_version_only_in_premium() {
		add_filter( 'wpseo_hide_version', '__return_true' );

		self::$class_instance->set_is_premium( false );
		// Test if the version number is shown in the debug marker.
		$this->assertContains( 'v' . WPSEO_VERSION, self::$class_instance->get_debug_mark() );

		self::$class_instance->set_is_premium( true );
		// Test if the version number is shown in the debug marker.
		$this->assertNotContains( 'v' . WPSEO_VERSION, self::$class_instance->get_debug_mark() );

		remove_filter( 'wpseo_hide_version', '__return_true' );
	}

	/**
	 * @covers WPSEO_Frontend::get_debug_mark
	 */
	public function test_debug_mark_contains_hard_link() {
		// Test if the version number is shown in the debug marker.
		$this->assertContains( 'https://yoast.com/wordpress/plugins/seo/', self::$class_instance->get_debug_mark() );
	}

	/**
	 * @covers WPSEO_Frontend::webmaster_tools_authentication
	 */
	public function test_webmaster_tools_authentication_home() {

		$this->go_to_home();

		$this->run_webmaster_tools_authentication_option_test( 'baiduverify', 'hasdfa34ds', '<meta name="baidu-site-verification" content="hasdfa34ds" />' . "\n" );
		$this->run_webmaster_tools_authentication_option_test( 'googleverify', 'googleverify', '<meta name="google-site-verification" content="googleverify" />' . "\n" );
		$this->run_webmaster_tools_authentication_option_test( 'msverify', 'acfacfacf', '<meta name="msvalidate.01" content="acfacfacf" />' . "\n" );
		$this->run_webmaster_tools_authentication_option_test( 'yandexverify', 'defdefdef', '<meta name="yandex-verification" content="defdefdef" />' . "\n" );
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
	 * Tests for canonical on search pages.
	 *
	 * @covers WPSEO_Frontend::canonical
	 *
	 * @return void
	 */
	public function test_canonical_search() {
		update_option( 'posts_per_page', 1 );

		$this->factory->post->create_many( 3, array( 'post_title' => 'sample post %d' ) );

		// Test search.
		$search_link = get_search_link( 'sample post' );

		$this->run_test_on_consecutive_pages( $search_link );
	}

	/**
	 * Tests adjacent rel links on post type overview pages.
	 *
	 * @covers WPSEO_Frontend::adjacent_rel_links
	 * @covers WPSEO_Frontend::rel_links_archive
	 * @covers WPSEO_Frontend::adjacent_rel_link
	 * @covers WPSEO_Frontend::get_pagination_base
	 * @covers WPSEO_Frontend::canonical
	 *
	 * @return void
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
	 * Tests adjacent rel links on author overview.
	 *
	 * @covers WPSEO_Frontend::adjacent_rel_links
	 * @covers WPSEO_Frontend::rel_links_archive
	 * @covers WPSEO_Frontend::adjacent_rel_link
	 * @covers WPSEO_Frontend::get_pagination_base
	 * @covers WPSEO_Frontend::canonical
	 *
	 * @return void
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
	 * Tests adjacent rel links in a date archive.
	 *
	 * @covers WPSEO_Frontend::adjacent_rel_links
	 * @covers WPSEO_Frontend::rel_links_archive
	 * @covers WPSEO_Frontend::adjacent_rel_link
	 * @covers WPSEO_Frontend::get_pagination_base
	 * @covers WPSEO_Frontend::canonical
	 *
	 * @return void
	 */
	public function test_adjacent_rel_links_canonical_date_archive() {
		update_option( 'posts_per_page', 1 );

		$this->factory->post->create_many( 3 );

		$date_link = get_day_link( false, false, false );  // Having three times false generates a link for today, which is what we need.
		$this->run_test_on_consecutive_pages( $date_link );
	}

	/**
	 * Tests adjacent rel links on a category.
	 *
	 * @covers WPSEO_Frontend::adjacent_rel_links
	 * @covers WPSEO_Frontend::rel_links_archive
	 * @covers WPSEO_Frontend::adjacent_rel_link
	 * @covers WPSEO_Frontend::get_pagination_base
	 * @covers WPSEO_Frontend::canonical
	 *
	 * @return void
	 */
	public function test_adjacent_rel_links_canonical_category() {
		update_option( 'posts_per_page', 1 );

		// Create a category, add 26 posts to it, go to page 2 of its archives.
		$category_id = wp_create_category( 'Yoast SEO Plugins' );
		$this->factory->post->create_many( 3, array( 'post_category' => array( $category_id ) ) );

		/*
		 * This shouldn't be necessary but apparently multisite's rewrites are borked
		 * when you create a category and you don't flush (on 4.0 only).
		 */
		flush_rewrite_rules();

		$category_link = get_category_link( $category_id );

		$this->run_test_on_consecutive_pages( $category_link );
	}

	/**
	 * Makes sure posts which are paginated have the correct next/prev links.
	 *
	 * @covers WPSEO_Frontend::adjacent_rel_links
	 * @covers WPSEO_Frontend::rel_links_single
	 * @covers WPSEO_Frontend::adjacent_rel_link
	 * @covers WPSEO_Frontend::get_pagination_base
	 * @covers WPSEO_Frontend::canonical
	 *
	 * @return void
	 */
	public function test_adjacent_rel_links_canonical_split_up_post_pretty_permalinks() {
		$this->set_permalink_structure( '/%postname%/' );
		create_initial_taxonomies();

		$post_id = $this->factory->post->create(
			array(
				'post_type'    => 'post',
				'post_content' => '
Page 1/5
<!--nextpage-->
Page 2/3
<!--nextpage-->
Page 3/3
',
			)
		);

		$url = get_permalink( $post_id );

		$this->run_test_on_consecutive_post_parts( $url );
	}

	/**
	 * Makes sure posts which are paginated have the correct next/prev links.
	 *
	 * @covers WPSEO_Frontend::adjacent_rel_links
	 * @covers WPSEO_Frontend::rel_links_archive
	 * @covers WPSEO_Frontend::adjacent_rel_link
	 * @covers WPSEO_Frontend::get_pagination_base
	 * @covers WPSEO_Frontend::canonical
	 *
	 * @return void
	 */
	public function test_adjacent_rel_links_canonical_split_up_post() {
		$post_id = $this->factory->post->create(
			array(
				'post_type'    => 'post',
				'post_content' => '
Page 1/5
<!--nextpage-->
Page 2/3
<!--nextpage-->
Page 3/3
',
			)
		);

		$url = get_permalink( $post_id );

		$this->run_test_on_consecutive_post_parts( $url );
	}

	/**
	 * Makes sure no rel/next will be output when the post is not split up.
	 *
	 * @covers WPSEO_Frontend::adjacent_rel_links
	 * @covers WPSEO_Frontend::rel_links_single
	 * @covers WPSEO_Frontend::adjacent_rel_link
	 * @covers WPSEO_Frontend::get_pagination_base
	 * @covers WPSEO_Frontend::canonical
	 *
	 * @return void
	 */
	public function test_adjacent_rel_links_non_split_post() {
		$post_id = $this->factory->post->create(
			array(
				'post_type'    => 'post',
				'post_content' => 'No nextpage HTML comment present.',
			)
		);

		$url = get_permalink( $post_id );

		// Test page 1 of the post type archives, should have just a rel=next and a canonical.
		$this->go_to( $url );

		self::$class_instance->adjacent_rel_links();
		$this->expectOutput( '' );
	}

	/**
	 * Tests for use of the canonical filter.
	 *
	 * @covers WPSEO_Frontend::canonical
	 *
	 * @return void
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
	 * @return string Fixed canonical string.
	 */
	public function filter_canonical_test() {
		return 'http://canonic.al';
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
		$this->go_to( get_feed_link() );

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
		$this->go_to( get_feed_link() );

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
		$this->go_to( get_feed_link() );

		// Test if input was changed.
		$expected_string = 'Some RSS before text';
		WPSEO_Options::set( 'rssbefore', $expected_string );
		WPSEO_Options::set( 'rssafter', '' );

		$expected = wpautop( $expected_string ) . $input;
		$this->assertEquals( $expected, self::$class_instance->embed_rss( $input, 'full' ) );
	}

	/**
	 * Tests the situation for flush cache when the debug_mark is not being hooked.
	 *
	 * @covers WPSEO_Frontend::flush_cache
	 */
	public function test_flush_cache_with_output_buffering_not_turned_on() {
		// Should not run when output buffering is not turned on.
		$this->assertFalse( self::$class_instance->flush_cache() );
	}

	/**
	 * Tests the situation for flush cache when the debug_mark is not being hooked.
	 *
	 * @covers WPSEO_Frontend::flush_cache
	 */
	public function test_flush_cache_with_debug_mark_hook_not_being_set() {
		/** @var $frontend WPSEO_Frontend_Double */
		$frontend = $this
			->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'show_debug_marker', 'get_debug_mark' ) )
			->getMock();

		$frontend
			->expects( $this->never() )
			->method( 'get_debug_mark' );

		$frontend
			->expects( $this->once() )
			->method( 'show_debug_marker' )
			->will( $this->returnValue( false ) );

		// Enables the output buffering.
		$frontend->force_rewrite_output_buffer();

		// Run function.
		$result = $frontend->flush_cache();

		// Run assertions.
		$this->assertTrue( $result );
	}

	/**
	 * Checks the value of the debug mark getter when the premium version is 'active'.
	 *
	 * @covers WPSEO_Frontend::head_product_name()
	 */
	public function test_head_get_debug_mark_for_premium() {
		/** @var $frontend WPSEO_Frontend_Double */
		$frontend = $this
			->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'is_premium' ) )
			->getMock();

		$frontend
			->expects( $this->once() )
			->method( 'is_premium' )
			->will( $this->returnValue( true ) );

		$this->assertNotFalse( stripos( $frontend->get_debug_mark(), 'Premium' ) );
	}

	/**
	 * Checks the value of the debug mark getter when the free version is 'active'.
	 *
	 * @covers WPSEO_Frontend::head_product_name()
	 */
	public function test_head_get_debug_mark_for_free() {
		/** @var $frontend WPSEO_Frontend_Double */
		$frontend = $this
			->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'is_premium' ) )
			->getMock();

		$frontend
			->expects( $this->once() )
			->method( 'is_premium' )
			->will( $this->returnValue( false ) );

		$this->assertFalse( stripos( $frontend->get_debug_mark(), 'Premium' ) );
	}

	/**
	 * Tests the situation for flush cache when the debug_mark is being hooked.
	 *
	 * @covers WPSEO_Frontend::flush_cache
	 */
	public function test_flush_cache_with_debug_mark_hook_being_set() {
		/** @var $frontend WPSEO_Frontend_Double */
		$frontend = $this
			->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'show_debug_marker', 'get_debug_mark' ) )
			->getMock();

		$frontend
			->expects( $this->once() )
			->method( 'show_debug_marker' )
			->will( $this->returnValue( true ) );

		$frontend
			->expects( $this->exactly( 1 ) )
			->method( 'get_debug_mark' );

		// Enables the output buffering.
		$frontend->force_rewrite_output_buffer();

		// Run function.
		$result = $frontend->flush_cache();

		// Run assertions.
		$this->assertTrue( $result );
	}

	/**
	 * Tests the situation where the closing debug mark should be shown.
	 *
	 * @covers WPSEO_Frontend::show_closing_debug_mark
	 */
	public function test_show_closing_debug_mark_with_debug_mark_hook_being_set() {
		/** @var $frontend WPSEO_Frontend_Double */
		$frontend = $this
			->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'show_debug_marker' ) )
			->getMock();

		$frontend
			->expects( $this->once() )
			->method( 'show_debug_marker' )
			->will( $this->returnValue( true ) );

		$frontend->head();

		$this->expectOutputContains( '<!-- / Yoast SEO plugin. -->' );
	}

	/**
	 * Tests the situation where the closing debug mark shouldn't be shown.
	 *
	 * @covers WPSEO_Frontend::show_closing_debug_mark
	 */
	public function test_show_closing_debug_mark_with_debug_mark_hook_not_being_set() {
		/** @var $frontend WPSEO_Frontend_Double */
		$frontend = $this
			->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'show_debug_marker' ) )
			->getMock();

		$frontend
			->expects( $this->once() )
			->method( 'show_debug_marker' )
			->will( $this->returnValue( false ) );

		$frontend->head();

		$output = $this->getActualOutput();

		$this->assertFalse( stripos( $output, '<!-- / Yoast SEO plugin. -->' ) );
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
	 * Runs tests for consecutive pages.
	 *
	 * @param string $initial_url URL to start off from.
	 *
	 * @return void
	 */
	private function run_test_on_consecutive_pages( $initial_url ) {
		// Test page 1 of the post type archives, should have just a rel=next and a canonical.
		$this->go_to( $initial_url );

		$page_2_link = get_pagenum_link( 2, false );
		$page_3_link = get_pagenum_link( 3, false );

		$expected = '<link rel="next" href="' . esc_url( $page_2_link ) . '" />' . "\n";

		self::$class_instance->adjacent_rel_links();
		$this->assertEquals( $initial_url, self::$class_instance->canonical( false ) );
		$this->expectOutput( $expected );

		self::$class_instance->reset();

		// Test page 2 of the post type archives, should have a rel=next and rel=prev and a canonical.
		$this->go_to( $page_2_link );

		$expected = '<link rel="prev" href="' . esc_url( $initial_url ) . '" />' . "\n" . '<link rel="next" href="' . esc_url( $page_3_link ) . '" />' . "\n";

		self::$class_instance->adjacent_rel_links();
		$this->assertEquals( $page_2_link, self::$class_instance->canonical( false ), 'Testing the link for the next page' );
		$this->expectOutput( $expected, 'Expecting previous and next URLs to be set for the 2nd page.' );

		self::$class_instance->reset();

		// Test page 3 of the author archives, should have just a rel=prev and a canonical.
		$this->go_to( $page_3_link );

		$expected = '<link rel="prev" href="' . esc_url( $page_2_link ) . '" />' . "\n";
		self::$class_instance->adjacent_rel_links();
		$this->assertEquals( $page_3_link, self::$class_instance->canonical( false ), 'Testing the link for the previous page' );
		$this->expectOutput( $expected, 'Expecting previous URL to be set for the 3nd page.' );

		self::$class_instance->reset();
	}

	/**
	 * Returns tests for consecutive post pages (paginated post/page).
	 *
	 * @param string $initial_url URL to start off from.
	 *
	 * @return void
	 */
	private function run_test_on_consecutive_post_parts( $initial_url ) {
		/** @var WP_Rewrite $wp_rewrite */
		global $wp_rewrite;

		// Test page 1 of the post type archives, should have just a rel=next and a canonical.
		$this->go_to( $initial_url );

		/*
		 * As WordPress core is internally completely broken on this functionality, adding logic here
		 * is the only way to test for the different situations.
		 */
		if ( ! $wp_rewrite->using_permalinks() ) {
			$page_2_link = get_pagenum_link( 2, false );
			$page_3_link = get_pagenum_link( 3, false );

			// Prepare for is_single usage.
			$page_2_link = str_replace( 'paged=', 'page=', $page_2_link );
			$page_3_link = str_replace( 'paged=', 'page=', $page_3_link );
		}
		else {
			$page_2_link = user_trailingslashit( rtrim( $initial_url, '/' ) . '/2' );
			$page_3_link = user_trailingslashit( rtrim( $initial_url, '/' ) . '/3' );
		}

		self::$class_instance->adjacent_rel_links();
		$this->expectOutput(
			'<link rel="next" href="' . esc_url( $page_2_link ) . '" />' . "\n",
			'Expect next link to be present in the output.'
		);

		$this->assertEquals( $initial_url, self::$class_instance->canonical( false ) );

		self::$class_instance->reset();

		// Test page 2 of the post type archives, should have a rel=next and rel=prev and a canonical.
		$this->go_to( $page_2_link );

		self::$class_instance->adjacent_rel_links();
		$this->expectOutput(
			'<link rel="prev" href="' . esc_url( $initial_url ) . '" />' . "\n" .
			'<link rel="next" href="' . esc_url( $page_3_link ) . '" />' . "\n",
			'Expecting previous and next URLs to be set for the 2nd page.'
		);

		$this->assertEquals( $page_2_link, self::$class_instance->canonical( false ), 'Testing the link for the next page' );

		self::$class_instance->reset();

		// Test page 3 of the author archives, should have just a rel=prev and a canonical.
		$this->go_to( $page_3_link );

		$expected = '<link rel="prev" href="' . esc_url( $page_2_link ) . '" />' . "\n";
		self::$class_instance->adjacent_rel_links();
		$this->assertEquals( $page_3_link, self::$class_instance->canonical( false ), 'Testing the link for the previous page' );
		$this->expectOutput( $expected, 'Expecting previous URL to be set for the 3nd page.' );
	}

	/**
	 * Tests the output for webmaster tools authentication.
	 *
	 * @param string $option_name Option name.
	 * @param string $test_value  Test value to use.
	 * @param string $expected    Expected output.
	 *
	 * @return void
	 */
	private function run_webmaster_tools_authentication_option_test( $option_name, $test_value, $expected ) {
		WPSEO_Options::set( $option_name, $test_value );

		self::$class_instance->webmaster_tools_authentication();
		$this->expectOutput( $expected );

		WPSEO_Options::set( $option_name, '' );
	}

	/**
	 * Tests if the queried post type is fetched properly.
	 *
	 * @covers WPSEO_Frontend::get_queried_post_type()
	 *
	 * @return void
	 */
	public function test_get_queried_post_type() {
		$wp_query = $this
			->getMockBuilder( 'WP_Query' )
			->setMethods( array( 'get' ) )
			->getMock();

		$wp_query
			->expects( $this->once() )
			->method( 'get' )
			->with( 'post_type' )
			->will( $this->returnValue( 'my_post_type' ) );

		$GLOBALS['wp_query'] = $wp_query;

		$this->assertEquals( 'my_post_type', self::$class_instance->get_queried_post_type() );
	}

	/**
	 * Tests for post type when given as multiple items.
	 *
	 * @covers WPSEO_Frontend::get_queried_post_type()
	 *
	 * @return void
	 */
	public function test_get_queried_post_type_array() {
		$wp_query = $this
			->getMockBuilder( 'WP_Query' )
			->setMethods( array( 'get' ) )
			->getMock();

		$wp_query
			->expects( $this->once() )
			->method( 'get' )
			->with( 'post_type' )
			->will( $this->returnValue( array( 'my_post_type', 'your_post_type' ) ) );

		$GLOBALS['wp_query'] = $wp_query;

		$this->assertEquals( 'my_post_type', self::$class_instance->get_queried_post_type() );
	}
}
