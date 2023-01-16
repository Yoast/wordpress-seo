<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions;

use Mockery;
use Yoast\WP\SEO\Actions\Settings_Introduction_Action;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Settings_Introduction_Action_Test class.
 *
 * @group actions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Settings_Introduction_Action
 */
class Settings_Introduction_Action_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Settings_Introduction_Action
	 */
	protected $instance;

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\MockInterface|Settings_Introduction_Action
	 */
	protected $mock_instance;

	/**
	 * Represents the User_Helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * Represents the Yoast_Notification_Center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->user_helper = Mockery::mock( User_Helper::class );

		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );

		$this->instance = new Settings_Introduction_Action(
			$this->user_helper,
			$this->notification_center
		);
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);

		$this->assertInstanceOf(
			Yoast_Notification_Center::class,
			$this->getPropertyValue( $this->instance, 'notification_center' )
		);
	}

	/**
	 * Test retrieving the wistia embed permission: happy path.
	 *
	 * @covers ::get_wistia_embed_permission
	 * @covers ::get_values_for_user
	 */
	public function test_get_wistia_embed_permission() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn(
				[
					'wistia_embed_permission' => true,
					'show'                    => true,
				]
			);

		$this->assertTrue( $this->instance->get_wistia_embed_permission() );
	}

	/**
	 * Test setting the wistia embed permission: happy path.
	 *
	 * @covers ::set_wistia_embed_permission
	 * @covers ::get_values_for_user
	 */
	public function test_set_wistia_embed_permission() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn(
				[
					'wistia_embed_permission' => false,
					'show'                    => true,
				]
			);

		$this->user_helper->expects( 'update_meta' )
			->with(
				1,
				'_yoast_settings_introduction',
				[
					'wistia_embed_permission' => true,
					'show'                    => true,
				]
			)
			->andReturnTrue();

		$this->assertTrue( $this->instance->set_wistia_embed_permission( true ) );
	}

	/**
	 * Test setting the wistia embed permission: value is unchanged.
	 *
	 * @covers ::set_wistia_embed_permission
	 * @covers ::get_values_for_user
	 */
	public function test_set_wistia_embed_permission_unchanged() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn(
				[
					'wistia_embed_permission' => true,
					'show'                    => true,
				]
			);

		$this->user_helper->expects( 'update_meta' )
			->never();

		$this->assertTrue( $this->instance->set_wistia_embed_permission( true ) );
	}

	/**
	 * Test retrieving show: happy path.
	 *
	 * @covers ::get_show
	 * @covers ::get_values_for_user
	 */
	public function test_get_show() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn(
				[
					'wistia_embed_permission' => true,
					'show'                    => false,
				]
			);

		$this->assertFalse( $this->instance->get_show() );
	}

	/**
	 * Test setting show: happy path.
	 *
	 * @covers ::set_show
	 * @covers ::get_values_for_user
	 */
	public function test_set_show() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn(
				[
					'wistia_embed_permission' => true,
					'show'                    => true,
				]
			);

		$this->user_helper->expects( 'update_meta' )
			->with(
				1,
				'_yoast_settings_introduction',
				[
					'wistia_embed_permission' => true,
					'show'                    => false,
				]
			)
			->andReturnTrue();

		$this->assertTrue( $this->instance->set_show( false ) );
	}

	/**
	 * Test setting show: value is unchanged.
	 *
	 * @covers ::set_show
	 * @covers ::get_values_for_user
	 */
	public function test_set_show_unchanged() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn(
				[
					'wistia_embed_permission' => true,
					'show'                    => true,
				]
			);

		$this->user_helper->expects( 'update_meta' )
			->never();

		$this->assertTrue( $this->instance->set_show( true ) );
	}

	/**
	 * Test retrieving the values with an invalid user ID.
	 *
	 * @covers ::get_values_for_user
	 */
	public function test_get_values_with_invalid_user_id() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( -1 );

		$this->user_helper->expects( 'get_meta' )
			->with( -1, '_yoast_settings_introduction', true )
			->andReturnFalse();

		$this->expectExceptionMessage( 'Invalid User ID' );

		$this->instance->get_show();
	}

	/**
	 * Test retrieving the values will use fallback values.
	 *
	 * @covers ::get_values_for_user
	 */
	public function test_get_values_fallback() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn( '' );

		$this->assertTrue( $this->instance->get_show() );
	}

	/**
	 * Test removing a notification.
	 *
	 * @covers ::remove_notification
	 * @dataProvider remove_notification_provider
	 *
	 * @param int  $first_count  The initial number of notifications.
	 * @param int  $second_count The number of notifications after the removal.
	 * @param bool $expected     The expected result.
	 */
	public function test_remove_notification( $first_count, $second_count, $expected ) {

		$this->notification_center
			->expects( 'get_notification_count' )
			->once()
			->andReturn( $first_count );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->once()
			->andReturns();

			$this->notification_center
				->expects( 'get_notification_count' )
				->once()
				->andReturn( $second_count );

		$this->assertEquals( $expected, $this->instance->remove_notification( 'test-id' ) );
	}

	/**
	 * Dataprovider for test_remove_notification.
	 *
	 * @covers ::remove_notification
	 */
	public function remove_notification_provider() {
		return [
			[ 5, 4, true ],
			[ 5, 5, false ],
		];
	}
}
