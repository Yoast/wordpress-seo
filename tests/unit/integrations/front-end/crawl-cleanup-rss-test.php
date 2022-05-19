<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Front_End\Crawl_Cleanup_Rss;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Crawl_Cleanup_Rss_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Crawl_Cleanup_Rss
 *
 * @group integrations
 * @group front-end
 */
class Crawl_Cleanup_Rss_Test extends TestCase {

	/**
	 * Robots helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The test instance.
	 *
	 * @var Crawl_Cleanup_Rss|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Crawl_Cleanup_Rss( $this->options_helper );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			Crawl_Cleanup_Rss::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered when the remove_feed_post_comments option is set to true.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_when_remove_feed_post_comments_is_true() {
		$this->options_helper
			->expects( 'get' )
			->with( 'remove_feed_post_comments' )
			->andReturn( true );

		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'redirect_unwanted_feeds' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'wp_head', [ $this->instance, 'feed_links_extra_replacement' ] ) );
	}

	/**
	 * Tests if the expected hooks are registered when the remove_feed_post_comments option is set to false.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_when_remove_feed_post_comments_is_false() {
		$this->options_helper
			->expects( 'get' )
			->with( 'remove_feed_post_comments' )
			->andReturn( false );

		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'redirect_unwanted_feeds' ] ) );
		$this->assertFalse( Monkey\Actions\has( 'wp_head', [ $this->instance, 'feed_links_extra_replacement' ] ) );
	}
}
