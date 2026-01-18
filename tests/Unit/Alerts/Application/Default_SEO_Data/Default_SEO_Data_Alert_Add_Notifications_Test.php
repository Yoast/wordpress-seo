<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Default_SEO_Data;

use Brain\Monkey\Functions;
use Generator;
use Mockery;

/**
 * Test class adding notifications.
 *
 * @group Default_SEO_Data_Alert
 *
 * @covers Yoast\WP\SEO\Alerts\Application\Default_SEO_Data\Default_SEO_Data_Alert::add_notifications
 * @covers Yoast\WP\SEO\Alerts\Application\Default_SEO_Data\Default_SEO_Data_Alert::get_default_seo_data_notification
 * @covers Yoast\WP\SEO\Alerts\Application\Default_SEO_Data\Default_SEO_Data_Alert::get_default_seo_data_message
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Alert_Add_Notifications_Test extends Abstract_Default_SEO_Data_Alert_Test {

	/**
	 * Tests adding notifications.
	 *
	 * @dataProvider add_notifications_data
	 *
	 * @param bool     $should_index_indexables   Whether the indexables should be indexed.
	 * @param int      $is_indexable_times        The number of times is_indexable is called.
	 * @param bool     $is_indexable              Whether the post type is indexable.
	 * @param int      $has_metabox_times         The number of times has_metabox is called.
	 * @param bool     $has_metabox               Whether the post type has a metabox.
	 * @param int      $get_default_data_times    The number of times we try to get default SEO data is called.
	 * @param string[] $default_seo_title_posts   The posts with default SEO title in their most recent.
	 * @param string[] $default_seo_desc_posts    The posts with default SEO description in their most recent.
	 * @param int      $remove_notification_times The time we are removing a notification.
	 * @param int      $is_premium_times          The time we are checking if premium is active.
	 * @param bool     $is_premium                Whether premium is active.
	 * @param string   $url                       The URL to get the shortlink for.
	 * @param int      $get_shortlink_times       The time we are getting the shortlink.
	 * @param string   $shortlink                 The shortlink to return.
	 * @param int      $add_notification_times    The time we are adding a notification.
	 * @param string   $expected_message          The expected notification message.
	 *
	 * @return void
	 */
	public function test_add_notifications(
		$should_index_indexables,
		$is_indexable_times,
		$is_indexable,
		$has_metabox_times,
		$has_metabox,
		$get_default_data_times,
		$default_seo_title_posts,
		$default_seo_desc_posts,
		$remove_notification_times,
		$is_premium_times,
		$is_premium,
		$url,
		$get_shortlink_times,
		$shortlink,
		$add_notification_times,
		$expected_message
	) {
		$admin_user     = Mockery::mock( WP_User::class );
		$admin_user->ID = 1;

		Functions\expect( 'get_current_user_id' )
			->andReturn( $admin_user->ID );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->andReturn( $should_index_indexables );

		$this->post_type_helper
			->expects( 'is_indexable' )
			->times( $is_indexable_times )
			->with( 'post' )
			->andReturn( $is_indexable );

		$this->post_type_helper
			->expects( 'has_metabox' )
			->times( $has_metabox_times )
			->with( 'post' )
			->andReturn( $has_metabox );

		$this->default_seo_data_collector
			->expects( 'get_posts_with_default_seo_title' )
			->times( $get_default_data_times )
			->andReturn( $default_seo_title_posts );

		$this->default_seo_data_collector
			->expects( 'get_posts_with_default_seo_description' )
			->times( $get_default_data_times )
			->andReturn( $default_seo_desc_posts );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->times( $remove_notification_times )
			->with( 'wpseo-default-seo-data' );

		$this->product_helper
			->expects( 'is_premium' )
			->times( $is_premium_times )
			->andReturn( $is_premium );

		$this->short_link_helper
			->expects( 'get' )
			->with( $url )
			->times( $get_shortlink_times )
			->andReturn( $shortlink );

		$this->notification_center
			->expects( 'add_notification' )
			->times( $add_notification_times )
			->withArgs(
				static function ( $notification ) use ( $expected_message ) {
					$notification_array = $notification->to_array();
					return $notification_array['message'] === $expected_message;
				}
			);

		$this->instance->add_notifications();
	}

	/**
	 * Data provider for the test_add_notifications test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function add_notifications_data() {
		yield 'Should not index indexables - early return' => [
			'should_index_indexables'   => false,
			'is_indexable_times'        => 0,
			'is_indexable'              => 'irrelevant',
			'has_metabox_times'         => 0,
			'has_metabox'               => 'irrelevant',
			'get_default_data_times'    => 0,
			'default_seo_title_posts'   => 'irrelevant',
			'default_seo_desc_posts'    => 'irrelevant',
			'remove_notification_times' => 1,
			'is_premium_times'          => 0,
			'is_premium'                => 'irrelevant',
			'url'                       => 'irrelevant',
			'get_shortlink_times'       => 0,
			'shortlink'                 => 'irrelevant',
			'add_notification_times'    => 0,
			'expected_message'          => 'irrelevant',
		];

		yield 'Post type not indexable - early return' => [
			'should_index_indexables'   => true,
			'is_indexable_times'        => 1,
			'is_indexable'              => false,
			'has_metabox_times'         => 0,
			'has_metabox'               => 'irrelevant',
			'get_default_data_times'    => 0,
			'default_seo_title_posts'   => 'irrelevant',
			'default_seo_desc_posts'    => 'irrelevant',
			'remove_notification_times' => 1,
			'is_premium_times'          => 0,
			'is_premium'                => 'irrelevant',
			'url'                       => 'irrelevant',
			'get_shortlink_times'       => 0,
			'shortlink'                 => 'irrelevant',
			'add_notification_times'    => 0,
			'expected_message'          => 'irrelevant',
		];

		yield 'Post type has no metabox - early return' => [
			'should_index_indexables'   => true,
			'is_indexable_times'        => 1,
			'is_indexable'              => true,
			'has_metabox_times'         => 1,
			'has_metabox'               => false,
			'get_default_data_times'    => 0,
			'default_seo_title_posts'   => 'irrelevant',
			'default_seo_desc_posts'    => 'irrelevant',
			'remove_notification_times' => 1,
			'is_premium_times'          => 0,
			'is_premium'                => 'irrelevant',
			'url'                       => 'irrelevant',
			'get_shortlink_times'       => 0,
			'shortlink'                 => 'irrelevant',
			'add_notification_times'    => 0,
			'expected_message'          => 'irrelevant',
		];

		yield 'Not enough posts with default titles or descriptions - remove notification' => [
			'should_index_indexables'   => true,
			'is_indexable_times'        => 1,
			'is_indexable'              => true,
			'has_metabox_times'         => 1,
			'has_metabox'               => true,
			'get_default_data_times'    => 1,
			'default_seo_title_posts'   => [ 'post1', 'post2' ],
			'default_seo_desc_posts'    => [ 'post1', 'post3' ],
			'remove_notification_times' => 1,
			'is_premium_times'          => 0,
			'is_premium'                => 'irrelevant',
			'url'                       => 'irrelevant',
			'get_shortlink_times'       => 0,
			'shortlink'                 => 'irrelevant',
			'add_notification_times'    => 0,
			'expected_message'          => 'irrelevant',
		];

		yield 'Enough posts with default titles only - add notification (free)' => [
			'should_index_indexables'   => true,
			'is_indexable_times'        => 1,
			'is_indexable'              => true,
			'has_metabox_times'         => 1,
			'has_metabox'               => true,
			'get_default_data_times'    => 1,
			'default_seo_title_posts'   => [ 'post1', 'post2', 'post3', 'post4', 'post5' ],
			'default_seo_desc_posts'    => [ 'post1' ],
			'remove_notification_times' => 0,
			'is_premium_times'          => 2,
			'is_premium'                => false,
			'url'                       => 'https://yoa.st/ai-generate-alert-free/',
			'get_shortlink_times'       => 1,
			'shortlink'                 => 'https://yoa.st/ai-generate-alert-free/',
			'add_notification_times'    => 1,
			'expected_message'          => 'Your recent posts are using default SEO titles, which can make them easy to overlook in search results. Update them for better visibility or <a href="https://yoa.st/ai-generate-alert-free/" target="_blank">try <strong>Yoast AI Generate</strong> for free to do it faster.</a>',
		];

		yield 'Enough posts with default descriptions only - add notification (free)' => [
			'should_index_indexables'   => true,
			'is_indexable_times'        => 1,
			'is_indexable'              => true,
			'has_metabox_times'         => 1,
			'has_metabox'               => true,
			'get_default_data_times'    => 1,
			'default_seo_title_posts'   => [ 'post1' ],
			'default_seo_desc_posts'    => [ 'post1', 'post2', 'post3', 'post4', 'post5' ],
			'remove_notification_times' => 0,
			'is_premium_times'          => 2,
			'is_premium'                => false,
			'url'                       => 'https://yoa.st/ai-generate-alert-free/',
			'get_shortlink_times'       => 1,
			'shortlink'                 => 'https://yoa.st/ai-generate-alert-free/',
			'add_notification_times'    => 1,
			'expected_message'          => 'Your recent posts are using default meta descriptions, which can make them easy to overlook in search results. Update them for better visibility or <a href="https://yoa.st/ai-generate-alert-free/" target="_blank">try <strong>Yoast AI Generate</strong> for free to do it faster.</a>',
		];

		yield 'Enough posts with default titles and descriptions - add notification (free)' => [
			'should_index_indexables'   => true,
			'is_indexable_times'        => 1,
			'is_indexable'              => true,
			'has_metabox_times'         => 1,
			'has_metabox'               => true,
			'get_default_data_times'    => 1,
			'default_seo_title_posts'   => [ 'post1', 'post2', 'post3', 'post4', 'post5' ],
			'default_seo_desc_posts'    => [ 'post1', 'post2', 'post3', 'post4', 'post5' ],
			'remove_notification_times' => 0,
			'is_premium_times'          => 2,
			'is_premium'                => false,
			'url'                       => 'https://yoa.st/ai-generate-alert-free/',
			'get_shortlink_times'       => 1,
			'shortlink'                 => 'https://yoa.st/ai-generate-alert-free/',
			'add_notification_times'    => 1,
			'expected_message'          => 'Your recent posts are using default SEO titles and meta descriptions, which can make them easy to overlook in search results. Update them for better visibility or <a href="https://yoa.st/ai-generate-alert-free/" target="_blank">try <strong>Yoast AI Generate</strong> for free to do it faster.</a>',
		];

		yield 'Enough posts with default titles only - add notification (premium)' => [
			'should_index_indexables'   => true,
			'is_indexable_times'        => 1,
			'is_indexable'              => true,
			'has_metabox_times'         => 1,
			'has_metabox'               => true,
			'get_default_data_times'    => 1,
			'default_seo_title_posts'   => [ 'post1', 'post2', 'post3', 'post4', 'post5' ],
			'default_seo_desc_posts'    => [ 'post1' ],
			'remove_notification_times' => 0,
			'is_premium_times'          => 2,
			'is_premium'                => true,
			'url'                       => 'https://yoa.st/ai-generate-alert-premium/',
			'get_shortlink_times'       => 1,
			'shortlink'                 => 'https://yoa.st/ai-generate-alert-premium/',
			'add_notification_times'    => 1,
			'expected_message'          => 'Your recent posts are using default SEO titles, which can make them easy to overlook in search results. Update them manually or <a href="https://yoa.st/ai-generate-alert-premium/" target="_blank">find out how <strong>Yoast AI Generate</strong> can improve them for you.</a>',
		];

		yield 'Enough posts with default descriptions only - add notification (premium)' => [
			'should_index_indexables'   => true,
			'is_indexable_times'        => 1,
			'is_indexable'              => true,
			'has_metabox_times'         => 1,
			'has_metabox'               => true,
			'get_default_data_times'    => 1,
			'default_seo_title_posts'   => [ 'post1' ],
			'default_seo_desc_posts'    => [ 'post1', 'post2', 'post3', 'post4', 'post5' ],
			'remove_notification_times' => 0,
			'is_premium_times'          => 2,
			'is_premium'                => true,
			'url'                       => 'https://yoa.st/ai-generate-alert-premium/',
			'get_shortlink_times'       => 1,
			'shortlink'                 => 'https://yoa.st/ai-generate-alert-premium/',
			'add_notification_times'    => 1,
			'expected_message'          => 'Your recent posts are using default meta descriptions, which can make them easy to overlook in search results. Update them manually or <a href="https://yoa.st/ai-generate-alert-premium/" target="_blank">find out how <strong>Yoast AI Generate</strong> can improve them for you.</a>',
		];

		yield 'Enough posts with default titles and descriptions - add notification (premium)' => [
			'should_index_indexables'   => true,
			'is_indexable_times'        => 1,
			'is_indexable'              => true,
			'has_metabox_times'         => 1,
			'has_metabox'               => true,
			'get_default_data_times'    => 1,
			'default_seo_title_posts'   => [ 'post1', 'post2', 'post3', 'post4', 'post5' ], // > 4 posts
			'default_seo_desc_posts'    => [ 'post1', 'post2', 'post3', 'post4', 'post5' ], // > 4 posts
			'remove_notification_times' => 0,
			'is_premium_times'          => 2,
			'is_premium'                => true,
			'url'                       => 'https://yoa.st/ai-generate-alert-premium/',
			'get_shortlink_times'       => 1,
			'shortlink'                 => 'https://yoa.st/ai-generate-alert-premium/',
			'add_notification_times'    => 1,
			'expected_message'          => 'Your recent posts are using default SEO titles and meta descriptions, which can make them easy to overlook in search results. Update them manually or <a href="https://yoa.st/ai-generate-alert-premium/" target="_blank">find out how <strong>Yoast AI Generate</strong> can improve them for you.</a>',
		];
	}
}
