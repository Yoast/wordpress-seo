<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\User_Interface\Default_SEO_Data\Cron_Callback;

use Brain\Monkey\Functions;
use Generator;
use stdClass;

/**
 * Test class for the detect_default_seo_data_in_recent method.
 *
 * @group Default_SEO_Data
 *
 * @covers Yoast\WP\SEO\Alerts\User_Interface\Default_SEO_Data\Default_SEO_Data_Cron_Callback_Integration::detect_default_seo_data_in_recent
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Cron_Callback_Integration_Detect_Default_SEO_Data_In_Recent_Test extends Abstract_Default_SEO_Data_Cron_Callback_Integration_Test {

	/**
	 * Tests the detect_default_seo_data_in_recent method.
	 *
	 * @dataProvider detect_default_seo_data_in_recent_provider
	 *
	 * @param bool       $wp_doing_cron                     Whether WordPress is doing cron.
	 * @param stdClass[] $recent_posts                      The recent posts returned by the repository.
	 * @param int        $get_recently_modified_posts_times The number of times get_recently_modified_posts should be called.
	 * @param int[]      $expected_title_ids                The expected array of IDs for posts with default titles.
	 * @param int[]      $expected_desc_ids                 The expected array of IDs for posts with default descriptions.
	 * @param int        $set_title_option_times            The number of times the title option should be set.
	 * @param int        $set_desc_option_times             The number of times the description option should be set.
	 *
	 * @return void
	 */
	public function test_detect_default_seo_data_in_recent(
		$wp_doing_cron,
		$recent_posts,
		$get_recently_modified_posts_times,
		$expected_title_ids,
		$expected_desc_ids,
		$set_title_option_times,
		$set_desc_option_times
	) {
		Functions\expect( 'wp_doing_cron' )
			->once()
			->andReturn( $wp_doing_cron );

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->times( $get_recently_modified_posts_times )
			->with( 'post', 5, false )
			->andReturn( $recent_posts );

		$this->options_helper
			->expects( 'set' )
			->times( $set_title_option_times )
			->with( 'default_seo_title', $expected_title_ids );

		$this->options_helper
			->expects( 'set' )
			->times( $set_desc_option_times )
			->with( 'default_seo_meta_desc', $expected_desc_ids );

		$this->instance->detect_default_seo_data_in_recent();
	}

	/**
	 * Data provider for the test_detect_default_seo_data_in_recent test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function detect_default_seo_data_in_recent_provider() {
		yield 'Not doing cron - early return' => [
			'wp_doing_cron'                     => false,
			'recent_posts'                      => [],
			'get_recently_modified_posts_times' => 0,
			'expected_title_ids'                => [],
			'expected_desc_ids'                 => [],
			'set_title_option_times'            => 0,
			'set_desc_option_times'             => 0,
		];

		yield 'No recent posts - empty arrays set' => [
			'wp_doing_cron'                     => true,
			'recent_posts'                      => [],
			'get_recently_modified_posts_times' => 1,
			'expected_title_ids'                => [],
			'expected_desc_ids'                 => [],
			'set_title_option_times'            => 1,
			'set_desc_option_times'             => 1,
		];

		$post_with_custom_title_and_desc              = new stdClass();
		$post_with_custom_title_and_desc->object_id   = 1;
		$post_with_custom_title_and_desc->title       = 'Custom Title';
		$post_with_custom_title_and_desc->description = 'Custom Description';

		yield 'Posts with custom title and description - empty arrays set' => [
			'wp_doing_cron'                     => true,
			'recent_posts'                      => [ $post_with_custom_title_and_desc ],
			'get_recently_modified_posts_times' => 1,
			'expected_title_ids'                => [],
			'expected_desc_ids'                 => [],
			'set_title_option_times'            => 1,
			'set_desc_option_times'             => 1,
		];

		$post_with_default_title              = new stdClass();
		$post_with_default_title->object_id   = 2;
		$post_with_default_title->title       = null;
		$post_with_default_title->description = 'Custom Description';

		yield 'Post with default title only - title ID added' => [
			'wp_doing_cron'                     => true,
			'recent_posts'                      => [ $post_with_default_title ],
			'get_recently_modified_posts_times' => 1,
			'expected_title_ids'                => [ 2 ],
			'expected_desc_ids'                 => [],
			'set_title_option_times'            => 1,
			'set_desc_option_times'             => 1,
		];

		$post_with_default_desc              = new stdClass();
		$post_with_default_desc->object_id   = 3;
		$post_with_default_desc->title       = 'Custom Title';
		$post_with_default_desc->description = null;

		yield 'Post with default description only - description ID added' => [
			'wp_doing_cron'                     => true,
			'recent_posts'                      => [ $post_with_default_desc ],
			'get_recently_modified_posts_times' => 1,
			'expected_title_ids'                => [],
			'expected_desc_ids'                 => [ 3 ],
			'set_title_option_times'            => 1,
			'set_desc_option_times'             => 1,
		];

		$post_with_both_default              = new stdClass();
		$post_with_both_default->object_id   = 4;
		$post_with_both_default->title       = null;
		$post_with_both_default->description = null;

		yield 'Post with both default title and description - both IDs added' => [
			'wp_doing_cron'                     => true,
			'recent_posts'                      => [ $post_with_both_default ],
			'get_recently_modified_posts_times' => 1,
			'expected_title_ids'                => [ 4 ],
			'expected_desc_ids'                 => [ 4 ],
			'set_title_option_times'            => 1,
			'set_desc_option_times'             => 1,
		];

		yield 'Mixed posts - correct IDs in arrays' => [
			'wp_doing_cron'                     => true,
			'recent_posts'                      => [
				$post_with_custom_title_and_desc,
				$post_with_default_title,
				$post_with_default_desc,
				$post_with_both_default,
			],
			'get_recently_modified_posts_times' => 1,
			'expected_title_ids'                => [ 2, 4 ],
			'expected_desc_ids'                 => [ 3, 4 ],
			'set_title_option_times'            => 1,
			'set_desc_option_times'             => 1,
		];
	}
}
