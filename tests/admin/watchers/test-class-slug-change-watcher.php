<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Watchers
 */

/**
 * Unit Test Class.
 *
 * @group test
 */
class WPSEO_Slug_Change_Watcher_Test extends WPSEO_UnitTestCase {

	public function test_detect_slug_change() {
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

		$post->post_name = 'altered_post';

		wp_update_post( $post );
	}

	public function test_detect_slug_change_for_revision() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Slug_Change_Watcher' )
			->setMethods( array( 'add_notification' ) )
			->getMock();

		$instance
			->expects( $this->never() )
			->method( 'add_notification' );

		$post = self::factory()
			->post
			->create_and_get(
				array(
					'post_name' => 'new_post',
				)
			);

		$revision_id         = wp_save_post_revision( $post->ID );
		$revision            = get_post( $revision_id );
		$revision->post_name = 'revision';

		$instance->register_hooks();

		wp_update_post( $revision );
	}

	public function test_detect_slug_change_no_slug_change() {
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

		wp_update_post( $post );
	}

	public function test_detect_slug_change_no_visible_post_status() {
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

		$post->post_name = 'altered_post';

		wp_update_post( $post );
	}

	public function test_detect_slug_change_public_becomes_draft() {
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
					'post_status' => 'public',
				)
			);

		$post->post_status = 'draft';
		$post->post_name   = 'altered_post';

		wp_update_post( $post );
	}

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

}
