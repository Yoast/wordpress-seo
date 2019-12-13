<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\Free\Tests\Integrations\Front_End
 */

namespace Yoast\WP\Free\Tests\Integrations\Front_End;

use Mockery;
use Brain\Monkey;
use Yoast\WP\Free\Helpers\Redirect_Helper;
use Yoast\WP\Free\Helpers\Robots_Helper;
use Yoast\WP\Free\Integrations\Front_End\Comment_Link_Fixer;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\Free\Integrations\Front_End\Comment_Link_Fixer
 * @covers ::<!public>
 *
 * @group integrations
 * @group front-end
 */
class Comment_link_Fixer_Test extends TestCase {

	/**
	 * The redirect helper.
	 *
	 * @var Mockery\MockInterface|Redirect_Helper
	 */
	protected $redirect;

	/**
	 * The instance to test against.
	 *
	 * @var Comment_Link_Fixer
	 */
	protected $instance;

	/**
	 * The robots helper.
	 *
	 * @var Mockery\MockInterface|Robots_Helper
	 */
	protected $robots;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->redirect = Mockery::mock( Redirect_Helper::class );
		$this->robots   = Mockery::mock( Robots_Helper::class );
		$this->instance = new Comment_Link_Fixer( $this->redirect, $this->robots );
	}

	/**
	 * @covers ::__construct
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		add_filter( 'wpseo_remove_reply_to_com', '__return_false' );

		$this->assertFalse( \has_filter( 'comment_reply_link', [ $this->instance, 'remove_reply_to_com' ] ) );
		$this->assertFalse( \has_action( 'template_redirect', [ $this->instance, 'replytocom_redirect' ] ) );
	}

	/**
	 * @covers ::replytocom_redirect
	 */
	public function test_replytocom_redirect_not_single() {
		$_GET['replytocom'] = true;
		Monkey\Functions\expect( 'is_singular' )->once()->andReturn( false );
		$this->assertFalse( $this->instance->replytocom_redirect() );
		unset( $_GET['replytocom'] );
	}

	/**
	 * @covers ::replytocom_redirect
	 */
	public function test_replytocom_redirect_no_param() {
		$this->assertFalse( $this->instance->replytocom_redirect() );
	}

	/**
	 * @covers ::replytocom_redirect
	 */
	public function test_replytocom_redirect() {
		$this->redirect->expects( 'do_redirect' )->once()->with( 'https://permalink#comment-unique_hash', 301 )->andReturn( true );

		$_GET['replytocom'] = 'unique_hash';
		Monkey\Functions\expect( 'is_singular' )->once()->andReturn( true );
		$GLOBALS['post'] = (object) [ 'ID' => 1 ];
		Monkey\Functions\expect( 'get_permalink' )->once()->with( 1 )->andReturn( 'https://permalink' );

		$this->assertTrue( $this->instance->replytocom_redirect() );

		unset( $_GET['replytocom'], $GLOBALS['post'] );
	}

	/**
	 * @covers ::replytocom_redirect
	 */
	public function test_replytocom_redirect_with_query_string() {
		$this->redirect->expects( 'do_redirect' )->once()->with( 'https://permalink?param=foo#comment-unique_hash', 301 )->andReturn( true );

		$_GET['replytocom'] = 'unique_hash';
		Monkey\Functions\expect( 'is_singular' )->once()->andReturn( true );
		$GLOBALS['post'] = (object) [ 'ID' => 1 ];
		Monkey\Functions\expect( 'get_permalink' )->once()->with( 1 )->andReturn( 'https://permalink' );
		$_SERVER['QUERY_STRING'] = 'param=foo';
		Monkey\Functions\expect( 'remove_query_arg' )->once()->with( 'replytocom', 'param=foo' )->andReturn( 'param=foo' );

		$this->assertTrue( $this->instance->replytocom_redirect() );

		unset( $_GET['replytocom'], $GLOBALS['post'] );
	}

	/**
	 * @covers ::remove_reply_to_com
	 */
	public function test_remove_reply_to_com() {
		$link     = '<a href="http://yoast.com/post?replytocom=123#respond">Reply to Comment</a>';
		$expected = '<a href="#comment-123">Reply to Comment</a>';

		$this->assertEquals( $expected, $this->instance->remove_reply_to_com( $link ) );
	}
}
