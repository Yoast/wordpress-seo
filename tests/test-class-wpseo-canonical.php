<?php
/**
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group test
 */
class WPSEO_Canonical_Test extends WPSEO_UnitTestCase {
	/**
	 * @var WPSEO_Frontend_Double
	 */
	private static $class_instance;

	/**
	 * Setting up.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		self::$class_instance = WPSEO_Canonical_Double::get_instance();
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

}