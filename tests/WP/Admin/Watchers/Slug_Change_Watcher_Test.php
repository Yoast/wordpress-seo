<?php

namespace Yoast\WP\SEO\Tests\WP\Admin\Watchers;

use WPSEO_Slug_Change_Watcher;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Slug_Change_Watcher_Test extends TestCase {

	/**
	 * Post ID.
	 *
	 * @var int
	 */
	private static $post_id;

	/**
	 * Nav menu item ID.
	 *
	 * @var int
	 */
	private static $nav_menu_item_id;

	/**
	 * Category ID (public taxonomy).
	 *
	 * @var int
	 */
	private static $category_id;

	/**
	 * Nav menu ID (non-public taxonomy).
	 *
	 * @var int
	 */
	private static $nav_menu_id;

	/**
	 * Sets up posts and terms to use in tests.
	 *
	 * @param WP_UnitTest_Factory $factory Unit test factory instance.
	 *
	 * @return void
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$post_id          = $factory->post->create( [ 'post_type' => 'post' ] );
		self::$nav_menu_item_id = $factory->post->create( [ 'post_type' => 'nav_menu_item' ] );
		self::$category_id      = $factory->term->create( [ 'taxonomy' => 'category' ] );
		self::$nav_menu_id      = $factory->term->create( [ 'taxonomy' => 'nav_menu' ] );
	}

	/**
	 * Deletes the posts and terms used in tests.
	 *
	 * @return void
	 */
	public static function wpTearDownAfterClass() {
		\wp_delete_post( self::$post_id, true );
		\wp_delete_post( self::$nav_menu_item_id, true );
		\wp_delete_term( self::$category_id, 'category' );
		\wp_delete_term( self::$nav_menu_id, 'nav_menu' );
	}

	/**
	 * Tests showing notification when a post is moved to trash.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_trash
	 *
	 * @return void
	 */
	public function test_detect_post_trash() {
		$instance = $this
			->getMockBuilder( WPSEO_Slug_Change_Watcher::class )
			->setMethods( [ 'add_notification' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'add_notification' );

		$instance->register_hooks();

		\wp_trash_post( self::$post_id );
	}

	/**
	 * Tests showing notification when a non visible post is moved to trash.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_trash
	 *
	 * @return void
	 */
	public function test_detect_post_trash_no_visible_post_status() {

		// Make sure we're working with a draft.
		$post_args = [
			'ID'          => self::$post_id,
			'post_status' => 'draft',
		];
		\wp_update_post( $post_args );

		$instance = $this
			->getMockBuilder( WPSEO_Slug_Change_Watcher::class )
			->setMethods( [ 'add_notification' ] )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$instance->register_hooks();

		\wp_trash_post( self::$post_id );
	}

	/**
	 * Tests showing notification when a post is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_delete
	 *
	 * @return void
	 */
	public function test_detect_post_delete() {
		$instance = $this
			->getMockBuilder( WPSEO_Slug_Change_Watcher::class )
			->setMethods( [ 'add_notification' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'add_notification' );

		$instance->register_hooks();

		\wp_delete_post( self::$post_id );
	}

	/**
	 * Tests not showing the notification when the nav menu item is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_delete
	 *
	 * @return void
	 */
	public function test_detect_post_delete_menu_item() {
		$instance = $this
			->getMockBuilder( WPSEO_Slug_Change_Watcher::class )
			->setMethods( [ 'add_notification' ] )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$instance->register_hooks();

		\wp_delete_post( self::$nav_menu_item_id );
	}

	/**
	 * Tests not showing the notification when a trashed post is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_delete
	 *
	 * @return void
	 */
	public function test_detect_post_delete_trashed_post() {
		// Make sure we're working with a trashed post.
		$post_args = [
			'ID'          => self::$post_id,
			'post_status' => 'trash',
		];
		\wp_update_post( $post_args );

		$instance = $this
			->getMockBuilder( WPSEO_Slug_Change_Watcher::class )
			->setMethods( [ 'add_notification' ] )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$instance->register_hooks();

		\wp_delete_post( self::$post_id );
	}

	/**
	 * Tests not showing the notification when a post revision is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_delete
	 *
	 * @return void
	 */
	public function test_detect_post_delete_revision() {
		$revision_id = \wp_save_post_revision( self::$post_id );

		$instance = $this
			->getMockBuilder( WPSEO_Slug_Change_Watcher::class )
			->setMethods( [ 'add_notification' ] )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$instance->register_hooks();

		\wp_delete_post( $revision_id );
	}

	/**
	 * Tests not showing the notification when a pending post is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_delete
	 *
	 * @return void
	 */
	public function test_detect_post_delete_when_not_visible() {

		// Make sure we're working with a pending post.
		$post_args = [
			'ID'          => self::$post_id,
			'post_status' => 'pending',
		];
		\wp_update_post( $post_args );

		$instance = $this
			->getMockBuilder( WPSEO_Slug_Change_Watcher::class )
			->setMethods( [ 'add_notification' ] )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$instance->register_hooks();

		\wp_delete_post( self::$post_id );
	}

	/**
	 * Tests showing the notification when a term of a public taxonomy is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_term_delete
	 *
	 * @return void
	 */
	public function test_detect_term_delete() {
		$instance = $this
			->getMockBuilder( WPSEO_Slug_Change_Watcher::class )
			->setMethods( [ 'add_notification' ] )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'add_notification' );

		$instance->register_hooks();

		\wp_delete_term( self::$category_id, 'category' );
	}

	/**
	 * Tests showing the notification when a term of a non-public taxonomy is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_term_delete
	 *
	 * @return void
	 */
	public function test_detect_term_delete_when_not_viewable() {
		$instance = $this
			->getMockBuilder( WPSEO_Slug_Change_Watcher::class )
			->setMethods( [ 'add_notification' ] )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$instance->register_hooks();

		\wp_delete_term( self::$nav_menu_id, 'nav_menu' );
	}

	/**
	 * Tests showing the notification when a non-existing term is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_term_delete
	 *
	 * @return void
	 */
	public function test_detect_term_delete_when_not_exists() {
		$instance = $this
			->getMockBuilder( WPSEO_Slug_Change_Watcher::class )
			->setMethods( [ 'add_notification' ] )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$instance->register_hooks();

		\wp_delete_term( 11111, 'category' );
	}
}
