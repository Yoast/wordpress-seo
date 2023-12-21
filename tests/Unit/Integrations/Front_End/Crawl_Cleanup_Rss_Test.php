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
final class Crawl_Cleanup_Rss_Test extends TestCase {

	/**
	 * Options helper.
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->options_helper
			->expects( 'get' )
			->twice()
			->andReturnTrue();

		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'feed_links_show_posts_feed', '__return_false' ) );
		$this->assertNotFalse( Monkey\Actions\has( 'feed_links_show_comments_feed', '__return_false' ) );
		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'maybe_disable_feeds' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'maybe_redirect_feeds' ] ) );
	}

	/**
	 * Tests different cases of maybe_disable_feeds using a dataprovider.
	 *
	 * @covers ::maybe_disable_feeds
	 * @dataProvider maybe_disable_feeds_dataprovider
	 *
	 * @param array $types          Flags identifying the type of feed.
	 * @param array $options        Values set for the different options.
	 * @param int   $expected_times Number of times (0 or 1) the removal of the feed function is expected.
	 *
	 * @return void
	 */
	public function test_maybe_disable_feeds( $types, $options, $expected_times ) {

		foreach ( $types as $type => $value ) {
			Monkey\Functions\expect( $type )
				->atMost()
				->once()
				->andReturn( $value );
		}

		foreach ( $options as $option => $value ) {
			$this->options_helper
				->allows( 'get' )
				->with( $option )
				->andReturn( $value );
		}

		Monkey\Functions\expect( 'remove_action' )
			->times( $expected_times );

		$this->instance->maybe_disable_feeds();
	}

	/**
	 * A data provider for the tests of the maybe_disable_feeds function.
	 *
	 * @return array[]
	 */
	public static function maybe_disable_feeds_dataprovider() {
		return [
			'singular, feed enabled' => [
				'types'           => [
					'is_singular'          => true,
					'is_author'            => false,
					'is_category'          => false,
					'is_tag'               => false,
					'is_tax'               => false,
					'is_post_type_archive' => false,
					'is_search'            => false,
				],
				'options'         => [
					'remove_feed_post_comments'     => false,
					'remove_feed_authors'           => false,
					'remove_feed_categories'        => false,
					'remove_feed_tags'              => false,
					'remove_feed_custom_taxonomies' => false,
					'remove_feed_post_types'        => false,
					'remove_feed_search'            => false,
				],
				'expected_times'  => 0,
			],
			'singular, feed disabled' => [
				'types'          => [
					'is_singular'          => true,
					'is_author'            => false,
					'is_category'          => false,
					'is_tag'               => false,
					'is_tax'               => false,
					'is_post_type_archive' => false,
					'is_search'            => false,
				],
				'options'        => [
					'remove_feed_post_comments'     => true,
					'remove_feed_authors'           => false,
					'remove_feed_categories'        => false,
					'remove_feed_tags'              => false,
					'remove_feed_custom_taxonomies' => false,
					'remove_feed_post_types'        => false,
					'remove_feed_search'            => false,
				],
				'expected_times' => 1,
			],
			'author, feed enabled' => [
				'types'          => [
					'is_singular'          => false,
					'is_author'            => true,
					'is_category'          => false,
					'is_tag'               => false,
					'is_tax'               => false,
					'is_post_type_archive' => false,
					'is_search'            => false,
				],
				'options'        => [
					'remove_feed_post_comments'     => true,
					'remove_feed_authors'           => false,
					'remove_feed_categories'        => false,
					'remove_feed_tags'              => false,
					'remove_feed_custom_taxonomies' => false,
					'remove_feed_post_types'        => false,
					'remove_feed_search'            => false,
				],
				'expected_times' => 0,
			],
			'author, feed disabled' => [
				'types'          => [
					'is_singular'          => false,
					'is_author'            => true,
					'is_category'          => false,
					'is_tag'               => false,
					'is_tax'               => false,
					'is_post_type_archive' => false,
					'is_search'            => false,
				],
				'options'        => [
					'remove_feed_post_comments'     => true,
					'remove_feed_authors'           => true,
					'remove_feed_categories'        => false,
					'remove_feed_tags'              => false,
					'remove_feed_custom_taxonomies' => false,
					'remove_feed_post_types'        => false,
					'remove_feed_search'            => false,
				],
				'expected_times' => 1,
			],
		];
	}
}
