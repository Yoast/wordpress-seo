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
class WPSEO_Remove_Reply_To_Com_Test extends WPSEO_UnitTestCase_Frontend {

	/**
	 * Setting up.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		self::$class_instance = new WPSEO_Remove_Reply_To_Com();
	}

	/**
	 * Reset after running a test.
	 */
	public function tearDown() {
		parent::tearDown();

		ob_clean();
	}

	/**
	 * @covers WPSEO_Frontend::replytocom_redirect
	 */
	public function test_replytocom_redirect() {
		$c = self::$class_instance;

		// Test with clean wpseo_remove_reply_to_com filter set to false.
		add_filter( 'wpseo_remove_reply_to_com', '__return_false' );
		$this->assertFalse( $c->replytocom_redirect() );

		// Enable clean replytocom.
		remove_filter( 'wpseo_remove_reply_to_com', '__return_false' );

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Test with no replytocom set in $_GET.
		$this->assertFalse( $c->replytocom_redirect() );

		// The following call should redirect.
		$_SERVER['QUERY_STRING'] = '';
		$this->go_to( add_query_arg( 'replytocom', '123', get_permalink( $post_id ) ) );
		$this->assertTrue( $c->replytocom_redirect() );

		// Go to home / move away from singular page.
		$this->go_to_home();

		// Test while not on singular page.
		$this->assertFalse( $c->replytocom_redirect() );
	}

	/**
	 * @covers WPSEO_Frontend::remove_reply_to_com
	 */
	public function test_remove_reply_to_com() {

		$link     = '<a href="http://yoast.com/post?replytocom=123#respond">Reply to Comment</a>';
		$expected = '<a href="#comment-123">Reply to Comment</a>';

		$this->assertEquals( $expected, self::$class_instance->remove_reply_to_com( $link ) );
	}
}
