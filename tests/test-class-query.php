<?php
/**
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group test
 */
class WPSEO_Query_Test extends WPSEO_UnitTestCase {
	/**
	 * @covers WPSEO_Frontend::is_home_posts_page
	 */
	public function test_is_home_posts_page() {

		$this->go_to_home();
		$this->assertTrue( WPSEO_Query::is_home_posts_page() );

		update_option( 'show_on_front', 'page' );
		$this->assertFalse( WPSEO_Query::is_home_posts_page() );

		// Create and go to post.
		update_option( 'show_on_front', 'notapage' );
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );
		$this->assertFalse( WPSEO_Query::is_home_posts_page() );
	}

	/**
	 * @covers WPSEO_Frontend::is_home_static_page
	 */
	public function test_is_home_static_page() {

		// On front page.
		$this->go_to_home();
		$this->assertFalse( WPSEO_Query::is_home_static_page() );

		// On front page and show_on_front = page.
		update_option( 'show_on_front', 'page' );
		$this->assertFalse( WPSEO_Query::is_home_static_page() );

		// Create page and set it as front page.
		$post_id = $this->factory->post->create( array( 'post_type' => 'page' ) );
		update_option( 'page_on_front', $post_id );
		$this->go_to( get_permalink( $post_id ) );

		// On front page, show_on_front = page and on static page.
		$this->assertTrue( WPSEO_Query::is_home_static_page() );

		// Go to differen post but preserve previous options.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Options set but not on front page, should return false.
		$this->assertFalse( WPSEO_Query::is_home_static_page() );
	}

	/**
	 * @covers WPSEO_Frontend::is_posts_page
	 */
	public function test_is_posts_page() {

		// On home with show_on_front != page.
		update_option( 'show_on_front', 'something' );
		$this->go_to_home();
		$this->assertFalse( WPSEO_Query::is_posts_page() );

		// On home with show_on_front = page.
		update_option( 'show_on_front', 'page' );
		$this->assertTrue( WPSEO_Query::is_posts_page() );

		// Go to different post but preserve previous options.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );
		$this->assertFalse( WPSEO_Query::is_posts_page() );
	}

}