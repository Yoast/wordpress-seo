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
		$this->options_helper->expects( 'get' )
			->with( 'remove_feed_global' )
			->andReturnTrue();

		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'feed_links_show_posts_feed', '__return_false' ) );
		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'maybe_disable_feeds' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'maybe_redirect_feeds' ] ) );
	}

	/**
	 * Tests if the expected replacements are performed when a post is displayed and the RSS feed is disabled.
	 *
	 * @covers ::maybe_disable_feeds
	 */
	public function test_maybe_disable_feeds_when_is_singular_and_feeds_disabled() {
		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturn( true );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_feed_post_comments' )
			->andReturn( true );

		Monkey\Functions\expect( 'remove_action' )
			->once();

		$this->instance->maybe_disable_feeds();
	}

	/**
	 * Tests if the expected replacements are performed when a post is displayed and the RSS feed is enabled.
	 *
	 * @covers ::maybe_disable_feeds
	 */
	public function test_maybe_disable_feeds_when_is_singular_and_feeds_enabled() {
		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturnTrue();

		Monkey\Functions\expect( 'is_author' )
			->once()
			->andReturnFalse();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_feed_post_comments' )
			->andReturn( false );

		Monkey\Functions\expect( 'remove_action' )
			->never();

		$this->instance->maybe_disable_feeds();
	}

	/**
	 * Tests if the expected replacements are performed when an author archive is displayed and the RSS feed is disabled.
	 *
	 * @covers ::maybe_disable_feeds
	 */
	public function test_maybe_disable_feeds_when_is_author_and_feed_disabled() {
		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturnFalse();

		Monkey\Functions\expect( 'is_author' )
			->once()
			->andReturnTrue();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_feed_authors' )
			->andReturnTrue();

		Monkey\Functions\expect( 'remove_action' )
			->once();

		$this->instance->maybe_disable_feeds();
	}

	/**
	 * Tests if the expected replacements are performed when an author archive is displayed and the RSS feed is enabled.
	 *
	 * @covers ::maybe_disable_feeds
	 */
	public function test_maybe_disable_feeds_when_is_author_and_feeds_enabled() {
		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturnFalse();

		Monkey\Functions\expect( 'is_author' )
			->once()
			->andReturnTrue();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_feed_authors' )
			->andReturnFalse();

		Monkey\Functions\expect( 'remove_action' )
			->never();

		$this->instance->maybe_disable_feeds();
	}

	/**
	 * Tests no replacements are performed when neither a post nor an author archive is displayed.
	 *
	 * @covers ::maybe_disable_feeds
	 */
	public function test_maybe_disable_feeds_when_not_matching() {
		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'is_author' )
			->once()
			->andReturnFalse();

		$this->options_helper
			->expects( 'get' )
			->never();

		Monkey\Functions\expect( 'remove_action' )
			->never();

		$this->instance->maybe_disable_feeds();
	}
}
