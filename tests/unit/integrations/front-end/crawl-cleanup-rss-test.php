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
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'maybe_disable_feeds' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'maybe_redirect_feeds' ] ) );
	}

	/**
	 * Tests if the expected replacements are performed when a post is displayed and the RSS cleanup is enabled.
	 *
	 * @param bool $post_comment_removed   Whether post comment feeds are set to be removed.
	 * @param bool $global_comment_removed Whether global comment feeds are set to be removed.
	 * @param int  $remove_action_times    The times we're gonna remove the wp_head action.
	 * @param int  $add_action_times       The times we're gonna add to the feed_links_show_comments_feed action.
	 *
	 * @covers ::maybe_disable_feeds
	 * @dataProvider provide_maybe_disable_feeds
	 */
	public function test_maybe_disable_feeds_when_is_singular_and_feeds_disabled( $post_comment_removed, $global_comment_removed, $remove_action_times, $add_action_times ) {
		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturn( true );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_feed_post_comments' )
			->andReturn( $post_comment_removed );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_feed_global_comments' )
			->andReturn( $global_comment_removed );

		Monkey\Functions\expect( 'remove_action' )
			->with( 'wp_head', 'feed_links_extra', 3 )
			->times( $remove_action_times );

		Monkey\Functions\expect( 'add_action' )
			->with( 'feed_links_show_comments_feed', '__return_false' )
			->times( $add_action_times );

		$this->instance->maybe_disable_feeds();
	}

	/**
	 * Dataprovider for maybe_disable_feeds function.
	 *
	 * @return array Data for maybe_disable_feeds function.
	 */
	public function provide_maybe_disable_feeds() {
		$post_and_global_removed = [
			'post_comment_removed'   => true,
			'global_comment_removed' => true,
			'remove_action_times   ' => 1,
			'add_action_times'       => 1,
		];

		$post_removed = [
			'post_comment_removed'   => true,
			'global_comment_removed' => false,
			'remove_action_times   ' => 1,
			'add_action_times'       => 0,
		];

		$global_removed = [
			'post_comment_removed'   => false,
			'global_comment_removed' => true,
			'remove_action_times   ' => 0,
			'add_action_times'       => 1,
		];

		$no_feeds_removed = [
			'post_comment_removed'   => false,
			'global_comment_removed' => false,
			'remove_action_times   ' => 0,
			'add_action_times'       => 0,
		];

		return [
			'Both Post and Global commment feeds are removed' => $post_and_global_removed,
			'Only Post commment feeds are removed'            => $post_removed,
			'Only Global commment feeds are removed'          => $global_removed,
			'No commment feeds are removed'                   => $no_feeds_removed,
		];
	}

	/**
	 * Tests if the expected replacements are performed when a post is displayed and the RSS cleanup is disabled.
	 *
	 * @covers ::maybe_disable_feeds
	 */
	public function test_maybe_disable_feeds_when_not_singular() {
		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturn( false );

		$this->options_helper
			->expects( 'get' )
			->with( 'remove_feed_post_comments' )
			->never();

		Monkey\Functions\expect( 'remove_action' )
			->never();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_feed_global_comments' )
			->andReturn( true );

		Monkey\Functions\expect( 'add_action' )
			->with( 'feed_links_show_comments_feed', '__return_false' )
			->once();

		$this->instance->maybe_disable_feeds();
	}
}
