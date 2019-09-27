<?php
/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\Free\Tests\Integrations\Front_End;

use Mockery;
use Brain\Monkey;
use Yoast\WP\Free\Helpers\Redirect_Helper;
use Yoast\WP\Free\Integrations\Front_End\Comment_Link_Fixer;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\Free\Integrations\Front_End\Comment_Link_Fixer
 * @covers ::<!public>
 */
class Comment_link_Fixer_Test extends TestCase {

	/**
	 * @covers ::__construct
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$redirect_helper_mock = Mockery::mock( Redirect_Helper::class );

		add_filter( 'wpseo_remove_reply_to_com', '__return_false' );
		$instance = new Comment_Link_Fixer( $redirect_helper_mock );

		$this->assertFalse( \has_filter( 'comment_reply_link', [ $instance, 'remove_reply_to_com' ] ) );
		$this->assertFalse( \has_action( 'template_redirect', [ $instance, 'replytocom_redirect' ] ) );
	}

	/**
	 * @covers ::replytocom_redirect
	 */
	public function test_replytocom_redirect_not_single() {
		$redirect_helper_mock = Mockery::mock( Redirect_Helper::class );
		$instance             = new Comment_Link_Fixer( $redirect_helper_mock );

		$_GET[ 'replytocom' ] = true;
		Monkey\Functions\expect( 'is_singular' )->once()->andReturn( false );
		$this->assertFalse( $instance->replytocom_redirect() );
		unset( $_GET[ 'replytocom' ] );
	}

	/**
	 * @covers ::replytocom_redirect
	 */
	public function test_replytocom_redirect_no_param() {
		$redirect_helper_mock = Mockery::mock( Redirect_Helper::class );
		$instance             = new Comment_Link_Fixer( $redirect_helper_mock );

		$this->assertFalse( $instance->replytocom_redirect() );
	}

	/**
	 * @covers ::replytocom_redirect
	 */
	public function test_replytocom_redirect() {
		$redirect_helper_mock = Mockery::mock( Redirect_Helper::class );
		$redirect_helper_mock->expects( 'do_redirect' )->once()->with( 'https://permalink#comment-unique_hash', 301 )->andReturn( true );

		$instance = new Comment_Link_Fixer( $redirect_helper_mock );

		$_GET[ 'replytocom' ] = 'unique_hash';
		Monkey\Functions\expect( 'is_singular' )->once()->andReturn( true );
		$GLOBALS[ 'post' ] = (object) [ 'ID' => 1 ];
		Monkey\Functions\expect( 'get_permalink' )->once()->with( 1 )->andReturn( 'https://permalink' );
		Monkey\Functions\expect( 'wp_unslash' )->once()->with( 'unique_hash' )->andReturn( 'unique_hash' );

		$this->assertTrue( $instance->replytocom_redirect() );

		unset( $_GET[ 'replytocom' ] );
		unset( $GLOBALS[ 'post' ] );
	}

	/**
	 * @covers ::replytocom_redirect
	 */
	public function test_replytocom_redirect_with_query_string() {
		$redirect_helper_mock = Mockery::mock( Redirect_Helper::class );
		$redirect_helper_mock->expects( 'do_redirect' )->once()->with( 'https://permalink?param=foo#comment-unique_hash', 301 )->andReturn( true );

		$instance = new Comment_Link_Fixer( $redirect_helper_mock );

		$_GET[ 'replytocom' ] = 'unique_hash';
		Monkey\Functions\expect( 'is_singular' )->once()->andReturn( true );
		$GLOBALS[ 'post' ] = (object) [ 'ID' => 1 ];
		Monkey\Functions\expect( 'get_permalink' )->once()->with( 1 )->andReturn( 'https://permalink' );
		Monkey\Functions\expect( 'wp_unslash' )->once()->with( 'unique_hash' )->andReturn( 'unique_hash' );
		$_SERVER['QUERY_STRING'] = 'param=foo';
		Monkey\Functions\expect( 'wp_unslash' )->once()->with( 'param=foo' )->andReturn( 'param=foo' );
		Monkey\Functions\expect( 'remove_query_arg' )->once()->with( 'replytocom', 'param=foo' )->andReturn( 'param=foo' );

		$this->assertTrue( $instance->replytocom_redirect() );

		unset( $_GET[ 'replytocom' ] );
		unset( $GLOBALS[ 'post' ] );
	}

	/**
	 * @covers ::remove_reply_to_com
	 */
	public function test_remove_reply_to_com() {
		$redirect_helper_mock = Mockery::mock( Redirect_Helper::class );
		$instance             = new Comment_Link_Fixer( $redirect_helper_mock );

		$link     = '<a href="http://yoast.com/post?replytocom=123#respond">Reply to Comment</a>';
		$expected = '<a href="#comment-123">Reply to Comment</a>';

		$this->assertEquals( $expected, $instance->remove_reply_to_com( $link ) );
	}
}
