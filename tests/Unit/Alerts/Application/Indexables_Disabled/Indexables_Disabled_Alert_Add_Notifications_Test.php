<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Indexables_Disabled;

use Brain\Monkey\Functions;
use Generator;
use Mockery;

/**
 * Test class adding notifications.
 *
 * @group Indexables_Disabled
 *
 * @covers Yoast\WP\SEO\Alerts\Application\Indexables_Disabled\Indexables_Disabled_Alert::add_notifications
 * @covers Yoast\WP\SEO\Alerts\Application\Indexables_Disabled\Indexables_Disabled_Alert::get_indexables_disabled_notification
 * @covers Yoast\WP\SEO\Alerts\Application\Indexables_Disabled\Indexables_Disabled_Alert::get_message
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Indexables_Disabled_Alert_Add_Notifications_Test extends Abstract_Indexables_Disabled_Alert_Test {

	/**
	 * Tests adding notifications.
	 *
	 * @dataProvider add_notifications_data
	 *
	 * @param bool   $should_index_indexables   Whether the indexables should be indexed.
	 * @param int    $remove_notification_times The number of times we are removing a notification.
	 * @param int    $get_shortlink_times       The number of times we are getting the shortlink.
	 * @param string $shortlink                 The shortlink to return.
	 * @param int    $add_notification_times    The number of times we are adding a notification.
	 * @param string $expected_message          The expected notification message.
	 *
	 * @return void
	 */
	public function test_add_notifications(
		$should_index_indexables,
		$remove_notification_times,
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

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->times( $remove_notification_times )
			->with( 'wpseo-indexables-disabled' );

		$this->short_link_helper
			->expects( 'get' )
			->with( 'https://yoa.st/indexables-disabled' )
			->times( $get_shortlink_times )
			->andReturn( $shortlink );

		$this->notification_center
			->expects( 'add_notification' )
			->times( $add_notification_times )
			->withArgs(
				static function ( $notification ) use ( $expected_message ) {
					$notification_array = $notification->to_array();
					return $notification_array['message'] === $expected_message;
				},
			);

		$this->instance->add_notifications();
	}

	/**
	 * Data provider for the test_add_notifications test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function add_notifications_data() {
		yield 'Indexables enabled - removes notification' => [
			'should_index_indexables'   => true,
			'remove_notification_times' => 1,
			'get_shortlink_times'       => 0,
			'shortlink'                 => 'irrelevant',
			'add_notification_times'    => 0,
			'expected_message'          => 'irrelevant',
		];

		yield 'Indexables disabled - adds notification' => [
			'should_index_indexables'   => false,
			'remove_notification_times' => 0,
			'get_shortlink_times'       => 1,
			'shortlink'                 => 'https://yoa.st/indexables-disabled?some=params',
			'add_notification_times'    => 1,
			'expected_message'          => 'Yoast indexables are disabled because your site is in a non-production environment or custom code is blocking them. This may affect your SEO features. <a href="https://yoa.st/indexables-disabled?some=params" target="_blank">Learn more about this</a>.',
		];
	}
}
