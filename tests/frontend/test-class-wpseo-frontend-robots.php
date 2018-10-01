<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Frontend
 */

/**
 * Unit Test Class.
 *
 * @group frontend
 */
final class WPSEO_Frontend_Robots_Test extends WPSEO_UnitTestCase_Frontend {

	/**
	 * Provision tests.
	 */
	public function setUp() {
		parent::setUp();
		WPSEO_Frontend::get_instance()->reset();

		// Start each test on the home page.
		$this->go_to_home();
	}

	/**
	 * Reset after running a test.
	 */
	public function tearDown() {
		parent::tearDown();

		ob_clean();
	}

	/**
	 * @covers WPSEO_Frontend::robots()
	 *
	 * @todo Test post type archives.
	 * @todo Test with page_for_posts option.
	 * @todo Test date archives.
	 * @todo Test search results.
	 */
	public function test_robots() {
		// Go to home.
		$this->go_to( get_home_url() );

		// Test home page with no special options.
		$this->assertEquals( '', self::$class_instance->robots() );
	}

	/**
	 * @covers WPSEO_Frontend::robots()
	 */
	public function test_robots_on_private_blog() {
		// Go to home.
		$this->go_to_home();

		// Test WP visibility setting.
		update_option( 'blog_public', '0' );
		$this->assertEquals( 'noindex,follow', self::$class_instance->robots() );

		// Clean-up.
		update_option( 'blog_public', '1' );
	}

	/**
	 * @covers WPSEO_Frontend::robots()
	 */
	public function test_with_replytocom_attribute() {
		// Go to home.
		$this->go_to_home();

		$expected = 'noindex,follow';
		// Test replytocom.
		$_GET['replytocom'] = '1';
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// Clean-up.
		unset( $_GET['replytocom'] );
	}

	/**
	 * @covers WPSEO_Frontend::robots()
	 */
	public function test_subpages_with_robots_using_default_state() {
		// Go to home.
		$this->go_to_home();

		// Test 'paged' query var.
		set_query_var( 'paged', 2 );
		$this->assertEquals( '', self::$class_instance->robots() );
		set_query_var( 'paged', 0 );
	}

	/**
	 * @covers WPSEO_Frontend::robots()
	 */
	public function test_post_robots_default_state() {
		WPSEO_Options::set( 'noindex-post', false );

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Test regular post with no special options.
		$expected = '';
		$this->assertEquals( $expected, self::$class_instance->robots() );
	}

	/**
	 * @covers WPSEO_Frontend::robots()
	 */
	public function test_post_noindex() {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Test noindex-post option.
		WPSEO_Options::set( 'noindex-post', true );
		$this->assertEquals( 'noindex,follow', self::$class_instance->robots() );
	}

	/**
	 * @covers WPSEO_Frontend::robots()
	 */
	public function test_private_post() {
		// Create and go to post.
		$post_id = $this->factory->post->create( array( 'post_status' => 'private' ) );
		$this->go_to( get_permalink( $post_id ) );

		// Test private posts.
		$this->assertEquals( 'noindex,follow', self::$class_instance->robots() );
	}

	/**
	 * @covers WPSEO_Frontend::robots()
	 */
	public function test_category() {
		// Go to category page.
		$category_id = wp_create_category( 'Category Name' );
		flush_rewrite_rules();

		// Add posts to category.
		$this->factory->post->create_many( 6, array( 'post_category' => array( $category_id ) ) );

		$category_link = get_category_link( $category_id );
		$this->go_to( $category_link );

		// Test regular category with no special options.
		$expected = '';
		$this->assertEquals( $expected, self::$class_instance->robots() );
	}

	/**
	 * @covers WPSEO_Frontend::robots()
	 */
	public function test_category_noindex() {
		// Go to category page.
		$category_id = wp_create_category( 'Category Name' );
		flush_rewrite_rules();

		// Add posts to category.
		$this->factory->post->create_many( 6, array( 'post_category' => array( $category_id ) ) );

		$category_link = get_category_link( $category_id );
		$this->go_to( $category_link );

		// Test category with noindex-tax-category option.
		$expected = 'noindex,follow';
		WPSEO_Options::set( 'noindex-tax-category', true );
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// Clean-up.
		self::$class_instance->options['noindex-tax-category'] = false;
	}

	/**
	 * @covers WPSEO_Frontend::robots()
	 */
	public function test_author_archive() {
		// Go to author page.
		$user_id = $this->factory->user->create();
		$this->go_to( get_author_posts_url( $user_id ) );

		// Test author archive with no special options.
		$expected = '';
		$this->assertEquals( $expected, self::$class_instance->robots() );
	}

	/**
	 * @covers WPSEO_Frontend::robots()
	 */
	public function test_author_archive_noindex() {
		// Go to author page.
		$user_id = $this->factory->user->create();
		$this->go_to( get_author_posts_url( $user_id ) );

		// Test author archive with 'noindex-author-wpseo'.
		$expected = 'noindex,follow';
		WPSEO_Options::set( 'noindex-author-wpseo', true );
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// Clean-up.
		self::$class_instance->options['noindex-author-wpseo'] = false;
	}

	/**
	 * Tests whether an author, when set to not appear in search results, gets a noindex.
	 *
	 * @covers WPSEO_Frontend::robots()
	 */
	public function test_individual_archive_noindex() {
		// Go to author page.
		$user_id = $this->factory->user->create();
		update_user_meta( $user_id, 'wpseo_noindex_author', 'on' );
		$this->go_to( get_author_posts_url( $user_id ) );

		$expected = 'noindex,follow';
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// Test that when this is _not_ set, we also do NOT have a noindex.
		$user_id = $this->factory->user->create();
		$this->go_to( get_author_posts_url( $user_id ) );
		$expected = ''; // The default "index,follow" is automatically set to empty string.
		$this->assertEquals( $expected, self::$class_instance->robots() );
	}

	/**
	 * This test was broken when it was located in test-class-wpseo-frontend.php.
	 *
	 * @covers WPSEO_Frontend::robots
	 */
	public function test_robots_for_404() {
		// Save 404 state.
		global $wp_query;
		$original_404_state = is_404();

		// Assertion.
		$wp_query->is_404 = true;
		$expected         = 'noindex,follow';
		$this->assertEquals( $expected, self::$class_instance->robots() );

		// Clean-up.
		$wp_query->is_404 = false;
	}

	/**
	 * @covers WPSEO_Frontend::robots_for_single_post
	 */
	public function test_robots_for_single_post() {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$robots   = array(
			'index'  => 'index',
			'follow' => 'follow',
			'other'  => array(),
		);
		$expected = $robots;

		// Test noindex.
		WPSEO_Meta::set_value( 'meta-robots-noindex', '1', $post_id );
		$expected['index'] = 'noindex';
		$this->assertEquals( $expected, self::$class_instance->robots_for_single_post( $robots, $post_id ) );

		// Test nofollow.
		WPSEO_Meta::set_value( 'meta-robots-nofollow', 1, $post_id );
		$expected['follow'] = 'nofollow';
		$this->assertEquals( $expected, self::$class_instance->robots_for_single_post( $robots, $post_id ) );

		// Test meta-robots adv nosnippet.
		WPSEO_Meta::set_value( 'meta-robots-adv', 'nosnippet', $post_id );
		$expected['other'] = array( 'nosnippet' );
		$this->assertEquals( $expected, self::$class_instance->robots_for_single_post( $robots, $post_id ) );

		WPSEO_Meta::set_value( 'meta-robots-noindex', '2', $post_id );
		$expected['index'] = 'index';
		$this->assertEquals( $expected, self::$class_instance->robots_for_single_post( $robots, $post_id ) );
	}

	/**
	 * @covers WPSEO_Frontend::noindex_page
	 */
	public function test_noindex_page() {
		$expected = '<meta name="robots" content="noindex" />' . "\n";
		$this->expectOutput( $expected, self::$class_instance->noindex_page() );
	}
}
