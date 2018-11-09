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
final class WPSEO_Frontend_Redirects_Test extends WPSEO_UnitTestCase_Frontend {

	/**
	 * Test if no redirect is done when not set.
	 *
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
	 * Tests that no redirects are done for archives.
	 *
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
	 * Tests the situation where the archive redirect has been redirected.
	 *
	 * @covers WPSEO_Frontend::archive_redirect()
	 */
	public function test_archive_redirect_being_redirected() {
		global $wp_query;

		$frontend = self::$class_instance;

		$wp_query->is_author = true;
		WPSEO_Options::set( 'disable-author', true );
		$this->assertTrue( $frontend->archive_redirect() );

		$wp_query->is_date = true;
		WPSEO_Options::set( 'disable-date', true );
		$this->assertTrue( $frontend->archive_redirect() );
	}

	/**
	 * Tests for attachment redirect an attachment page with parent.
	 *
	 * @covers WPSEO_Frontend::attachment_redirect
	 */
	public function test_attachment_redirect() {
		WPSEO_Options::set( 'disable-attachment', true );

		// Create an attachment with parent.
		$post_id = $this->factory->post->create(
			array(
				'post_type'   => 'attachment',
			)
		);
		$this->go_to( get_permalink( $post_id ) );

		// Make sure the redirect is applied.
		$this->assertTrue( self::$class_instance->attachment_redirect() );
		WPSEO_Options::set( 'disable-attachment', false );
	}

	/**
	 * Tests for attachment redirect on a non-attachment page.
	 *
	 * @covers WPSEO_Frontend::attachment_redirect
	 */
	public function test_attachment_redirect_no_attachment() {
		WPSEO_Options::set( 'disable-attachment', true );

		$post_id = $this->factory->post->create( array( 'post_type' => 'post' ) );
		$this->go_to( get_permalink( $post_id ) );

		// Should not redirect on regular post pages.
		$this->assertFalse( self::$class_instance->attachment_redirect() );
		WPSEO_Options::set( 'disable-attachment', false );
	}

	/**
	 * Tests for a request without a valid post object.
	 *
	 * @covers WPSEO_Frontend::attachment_redirect
	 */
	public function test_attachment_redirect_no_post_object() {
		global $post;

		$saved_post = $post;
		$post       = null;

		$this->assertFalse( self::$class_instance->attachment_redirect() );

		// Restore global Post.
		$post = $saved_post;
	}

	/**
	 * Tests for a request when attachment redirect is not enabled.
	 *
	 * @covers WPSEO_Frontend::attachment_redirect
	 */
	public function test_attachment_redirect_not_enabled() {
		WPSEO_Options::set( 'disable-attachment', false );

		// Create and go to post.
		$post_id = $this->factory->post->create(
			array(
				'post_type'   => 'attachment',
			)
		);
		$this->go_to( get_permalink( $post_id ) );

		$this->assertFalse( self::$class_instance->attachment_redirect() );
	}

	/**
	 * Tests if do_attachment_redirect has been called.
	 *
	 * @covers WPSEO_Frontend::attachment_redirect
	 */
	public function test_do_attachment_redirect() {
		WPSEO_Options::set( 'disable-attachment', true );
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'do_attachment_redirect' ) )
			->getMock();


		$class_instance
			->expects( $this->once() )
			->method( 'do_attachment_redirect' );

		// Create an attachment with parent.
		$post_id = $this->factory->post->create(
			array(
				'post_type'   => 'attachment',
			)
		);
		$this->go_to( get_permalink( $post_id ) );

		// Make sure the redirect is applied.
		$class_instance->attachment_redirect();
		WPSEO_Options::set( 'disable-attachment', false );
	}
}
