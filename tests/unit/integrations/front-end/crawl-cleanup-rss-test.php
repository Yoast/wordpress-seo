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
	 * Tests if the expected hooks are registered
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_when_remove_feed_post_comments() {

		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'redirect_unwanted_feeds' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'wp_head', [ $this->instance, 'feed_links_extra_replacement' ] ) );
	}

	/**
	 * Tests if the expected replacements are performed when a post is displayed and the toggle is set to true (rss disabled)
	 *
	 * @covers ::feed_links_extra_replacement
	 */
	public function test_feed_links_extra_replacement_when_is_singular_true_and_rss_disabled() {

		$this->options_helper
			->expects( 'get' )
			->with( 'remove_feed_post_comments' )
			->andReturn( true );

		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'feed_links_extra' )
			->never();

		$this->instance->feed_links_extra_replacement();
	}

	/**
	 * Tests if the standard wp behavior is kept when a post is displayed and the toggle is set to false (rss enabled)
	 *
	 * @covers ::feed_links_extra_replacement
	 */
	public function test_feed_links_extra_replacement_when_is_singular_true_and_rss_enabled() {

		$this->options_helper
			->expects( 'get' )
			->with( 'remove_feed_post_comments' )
			->andReturn( false );

		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'feed_links_extra' )
			->once();

		$this->instance->feed_links_extra_replacement();
	}

	/**
	 * Tests if the standard wp behavior is kept when anything than a post is displayed
	 *
	 * @covers ::feed_links_extra_replacement
	 */
	public function test_feed_links_extra_replacement_when_is_singular_false() {

		$this->options_helper
			->expects( 'get' )
			->never();

		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'feed_links_extra' )
			->once();

		$this->instance->feed_links_extra_replacement();
	}
}
