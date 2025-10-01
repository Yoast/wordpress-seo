<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Default_SEO_Data\Application;

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
	 * @param string[] $default_seo_title_types   The content types with default SEO title in their most recent.
	 * @param string[] $default_seo_desc_types    The content types with default SEO description in their most recent.
	 * @param int      $remove_notification_times The time we are removing a notification.
	 * @param int      $add_notification_times    The time we are adding a notification.
	 * @param string   $expected_message          The expected notification message.
	 *
	 * @return void
	 */
	public function test_add_notifications(
		$default_seo_title_types,
		$default_seo_desc_types,
		$remove_notification_times,
		$add_notification_times,
		$expected_message
	) {
		$admin_user     = Mockery::mock( WP_User::class );
		$admin_user->ID = 1;

		Functions\expect( 'get_current_user_id' )
			->andReturn( $admin_user->ID );

		$this->default_seo_data_collector
			->expects( 'get_types_with_default_seo_title' )
			->once()
			->andReturn( $default_seo_title_types );

		$this->default_seo_data_collector
			->expects( 'get_types_with_default_seo_description' )
			->once()
			->andReturn( $default_seo_desc_types );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->times( $remove_notification_times )
			->with( 'wpseo-default-seo-data' );

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
		yield 'Alert for both title and description' => [
			'default_seo_title_types'   => [ 'post' ],
			'default_seo_desc_types'    => [ 'post' ],
			'remove_notification_times' => 0,
			'add_notification_times'    => 1,
			'expected_message'          => 'It looks like you are using default SEO title and meta description for your most recent modified posts. <strong>Change your SEO title and meta description</strong> to make your content stand out in search results.',
		];
		yield 'Alert for only title' => [
			'default_seo_title_types'   => [ 'post' ],
			'default_seo_desc_types'    => [],
			'remove_notification_times' => 0,
			'add_notification_times'    => 1,
			'expected_message'          => 'It looks like you are using the default SEO title for your most recent posts. <strong>Change your SEO title</strong> to make your content stand out in search results.',
		];
		yield 'Alert for only description' => [
			'default_seo_title_types'   => [],
			'default_seo_desc_types'    => [ 'post' ],
			'remove_notification_times' => 0,
			'add_notification_times'    => 1,
			'expected_message'          => 'It looks like you are using the default meta description for your most recent posts. <strong>Change your meta description</strong> to make your content stand out in search results.',
		];
		yield 'No alerts' => [
			'default_seo_title_types'   => [],
			'default_seo_desc_types'    => [],
			'remove_notification_times' => 1,
			'add_notification_times'    => 0,
			'expected_message'          => 'irrelevant',
		];
	}
}
