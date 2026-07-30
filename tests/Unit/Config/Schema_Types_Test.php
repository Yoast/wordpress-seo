<?php

namespace Yoast\WP\SEO\Tests\Unit\Config;

use Brain\Monkey;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Schema_Types_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\Schema_Types
 */
final class Schema_Types_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Schema_Types
	 */
	protected $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Monkey\Functions\stubs(
			[
				'__' => null,
			],
		);

		Monkey\Functions\when( 'apply_filters' )->alias(
			static function ( $tag, $value ) {
				return $value;
			},
		);

		Monkey\Functions\when( 'wp_list_pluck' )->alias(
			static function ( $items, $field ) {
				return \array_map(
					static function ( $item ) use ( $field ) {
						return $item[ $field ];
					},
					$items,
				);
			},
		);

		$this->instance = new Schema_Types();
	}

	/**
	 * Tests that the PodcastEpisode schema type is available as a page type.
	 *
	 * @covers ::get_page_type_options
	 *
	 * @return void
	 */
	public function test_page_type_options_contains_podcast_episode() {
		$options = $this->instance->get_page_type_options();

		$values = \wp_list_pluck( $options, 'value' );

		self::assertContains( 'PodcastEpisode', $values );
	}

	/**
	 * Tests that the PodcastEpisode schema type is available as an article type.
	 *
	 * @covers ::get_article_type_options
	 *
	 * @return void
	 */
	public function test_article_type_options_contains_podcast_episode() {
		$options = $this->instance->get_article_type_options();

		$values = \wp_list_pluck( $options, 'value' );

		self::assertContains( 'PodcastEpisode', $values );
	}
}
