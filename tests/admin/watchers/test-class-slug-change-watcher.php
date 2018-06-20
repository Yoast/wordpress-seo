<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Watchers
 */

/**
 * Unit Test Class.
 */
class WPSEO_Slug_Change_Watcher_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests showing notification when a post is moved to trash.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_trash()
	 */
	public function test_detect_post_trash() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Slug_Change_Watcher' )
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'add_notification' );

		$instance->register_hooks();

		$post = self::factory()
			->post
			->create_and_get(
				array(
					'post_name' => 'new_post',
				)
			);

		wp_trash_post( $post->ID );
	}

	/**
	 * Tests showing notification when a non visible post is moved to trash.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_trash()
	 */
	public function test_detect_post_trash_no_visible_post_status() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Slug_Change_Watcher' )
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$instance->register_hooks();

		$post = self::factory()
			->post
			->create_and_get(
				array(
					'post_name'   => 'new_post',
					'post_status' => 'draft',
				)
			);

		wp_trash_post( $post->ID );
	}


	/**
	 * Tests showing notification when a post is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_delete()
	 */
	public function test_detect_post_delete() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Slug_Change_Watcher' )
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'add_notification' );

		$instance->register_hooks();

		$post = self::factory()
			->post
			->create_and_get(
				array(
					'post_name' => 'new_post',
				)
			);

		wp_delete_post( $post->ID );
	}

	/**
	 * Tests not showing the notification when the nav menu item is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_delete()
	 */
	public function test_detect_post_delete_menu_item() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Slug_Change_Watcher' )
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$instance->register_hooks();

		$post = self::factory()
			->post
			->create_and_get(
				array(
					'post_name' => 'new_post',
					'post_type' => 'nav_menu_item',
				)
			);

		wp_delete_post( $post->ID );
	}

	/**
	 * Tests not showing the notification when a trashed post is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_delete()
	 */
	public function test_detect_post_delete_trashed_post() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Slug_Change_Watcher' )
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$instance->register_hooks();

		$post = self::factory()
			->post
			->create_and_get(
				array(
					'post_name' => 'new_post',
					'post_status' => 'trash',
				)
			);

		wp_delete_post( $post->ID );
	}

	/**
	 * Tests not showing the notification when a post revision is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_delete()
	 */
	public function test_detect_post_delete_revision() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Slug_Change_Watcher' )
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$instance->register_hooks();

		$post = self::factory()
			->post
			->create_and_get(
				array(
					'post_name' => 'new_post',
				)
			);

		$revision_id = wp_save_post_revision( $post->ID );

		wp_delete_post( $revision_id );
	}

	/**
	 * Tests not showing the notification when a pending post is deleted.
	 *
	 * @covers WPSEO_Slug_Change_Watcher::detect_post_delete()
	 */
	public function test_detect_post_delete_when_not_visible() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Slug_Change_Watcher' )
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$instance->register_hooks();

		$post = self::factory()
			->post
			->create_and_get(
				array(
					'post_name'     => 'new_post',
					'post_status'   => 'pending',
				)
			);

		wp_delete_post( $post->ID );
	}
}
