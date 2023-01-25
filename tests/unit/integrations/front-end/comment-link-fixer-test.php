<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Helpers\Robots_Helper;
use Yoast\WP\SEO\Integrations\Front_End\Comment_Link_Fixer;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Comment_Link_Fixer_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Comment_Link_Fixer
 *
 * @group integrations
 * @group front-end
 */
class Comment_Link_Fixer_Test extends TestCase {

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
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->redirect = Mockery::mock( Redirect_Helper::class );
		$this->robots   = Mockery::mock( Robots_Helper::class );
		$this->instance = Mockery::mock( Comment_Link_Fixer::class, [ $this->redirect, $this->robots ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			Comment_Link_Fixer::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::__construct
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance
			->expects( 'has_replytocom_parameter' )
			->andReturnTrue();

		$this->instance->register_hooks();

		\add_filter( 'wpseo_remove_reply_to_com', '__return_false' );

		$this->assertNotFalse( \has_filter( 'comment_reply_link', [ $this->instance, 'remove_reply_to_com' ] ) );
		$this->assertNotFalse( \has_action( 'template_redirect', [ $this->instance, 'replytocom_redirect' ] ) );
		$this->assertNotFalse( \has_filter( 'wpseo_robots_array', [ $this->robots, 'set_robots_no_index' ] ) );
	}

	/**
	 * Tests the situation on a non singular page.
	 *
	 * @covers ::replytocom_redirect
	 */
	public function test_replytocom_redirect_not_single() {
		$_GET['replytocom'] = true;
		Monkey\Functions\expect( 'is_singular' )->once()->andReturn( false );
		$this->assertFalse( $this->instance->replytocom_redirect() );
		unset( $_GET['replytocom'] );
	}

	/**
	 * Tests the replytocom redirect with no query param not set.
	 *
	 * @covers ::replytocom_redirect
	 */
	public function test_replytocom_redirect_no_param() {
		$this->assertFalse( $this->instance->replytocom_redirect() );
	}

	/**
	 * Tests the replytocom redirect.
	 *
	 * @covers ::replytocom_redirect
	 */
	public function test_replytocom_redirect() {
		$this->redirect->expects( 'do_safe_redirect' )->once()->with( 'https://permalink#comment-unique_hash', 301 )->andReturn( true );

		$_GET['replytocom'] = 'unique_hash';
		Monkey\Functions\expect( 'is_singular' )->once()->andReturn( true );
		$GLOBALS['post'] = (object) [ 'ID' => 1 ];
		Monkey\Functions\expect( 'get_permalink' )->once()->with( 1 )->andReturn( 'https://permalink' );

		$this->assertTrue( $this->instance->replytocom_redirect() );

		unset( $_GET['replytocom'], $GLOBALS['post'] );
	}

	/**
	 * Tests the replytocom redirect with having a query string.
	 *
	 * @covers ::replytocom_redirect
	 */
	public function test_replytocom_redirect_with_query_string() {
		$this->redirect->expects( 'do_safe_redirect' )->once()->with( 'https://permalink?param=foo#comment-unique_hash', 301 )->andReturn( true );

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
	 * Tests the removal of the reply to com.
	 *
	 * @covers ::remove_reply_to_com
	 */
	public function test_remove_reply_to_com() {
		$link     = '<a href="http://yoast.com/post?replytocom=123#respond">Reply to Comment</a>';
		$expected = '<a href="#comment-123">Reply to Comment</a>';

		$this->assertEquals( $expected, $this->instance->remove_reply_to_com( $link ) );
	}
}
