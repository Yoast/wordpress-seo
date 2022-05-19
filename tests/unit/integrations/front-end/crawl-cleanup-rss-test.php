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
	 * @covers ::feed_links_extra_replacement
	 */
	public function test_feed_links_extra_replacement_when_is_singular_and_feeds_disabled() {
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
	 * Tests if the expected replacements are performed when a post is displayed and the RSS cleanup is disabled.
	 *
	 * @covers ::feed_links_extra_replacement
	 */
	public function test_feed_links_extra_replacement_when_is_singular_and_feeds_enabled() {
		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturn( true );

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
	 * Tests if the expected replacements are performed when a post is displayed and the RSS cleanup is disabled.
	 *
	 * @covers ::feed_links_extra_replacement
	 */
	public function test_feed_links_extra_replacement_when_not_singular() {
		Monkey\Functions\expect( 'is_singular' )
			->once()
			->andReturn( false );

		$this->options_helper
			->expects( 'get' )
			->never();

		Monkey\Functions\expect( 'remove_action' )
			->never();

		$this->instance->maybe_disable_feeds();
	}
}
