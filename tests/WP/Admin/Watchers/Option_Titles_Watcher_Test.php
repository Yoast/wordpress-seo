<?php

namespace Yoast\WP\SEO\Tests\WP\Admin\Watchers;

use Yoast\WP\SEO\Integrations\Watchers\Option_Titles_Watcher;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Option_Titles_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Option_Titles_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Option_Titles_Watcher
 */
final class Option_Titles_Watcher_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Option_Titles_Watcher
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Option_Titles_Watcher();
	}

	/**
	 * Tests the method delete_ancestors.
	 *
	 * @covers ::check_option
	 * @covers ::delete_ancestors
	 *
	 * @dataProvider data_provider_category
	 *
	 * @param array<string> $old_value The old value of the option.
	 * @param array<string> $new_value The new value of the option.
	 * @param bool          $expected  The expected result.
	 *
	 * @return void
	 */
	public function test_delete_ancestors( $old_value, $new_value, $expected ) {
		$this->assertSame( $expected, $this->instance->check_option( $old_value, $new_value ) );
	}

	/**
	 * Data provider for test_category.
	 *
	 * @return array<array<bool,array<string>>>
	 */
	public static function data_provider_category() {
		return [
			'Should delete ancestors' => [
				'old_value' => [ 'post_types-post-maintax' => 'tag' ],
				'new_value' => [ 'post_types-post-maintax' => 'category' ],
				'expected'  => true,
			],
			'Should not delete ancestors' => [
				'old_value' => [ 'post_types-post-maintax' => 'category' ],
				'new_value' => [ 'post_types-post-maintax' => 'category' ],
				'expected'  => false,
			],
		];
	}
}
