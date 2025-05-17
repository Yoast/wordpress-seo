<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Alert_Dismissal_Action;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Alert_Dismissal_Action_Test.
 *
 * @group actions
 * @group dismissable-alerts
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Alert_Dismissal_Action
 */
final class Alert_Dismissal_Action_Test extends TestCase {

	/**
	 * Holds the class instance.
	 *
	 * @var Alert_Dismissal_Action
	 */
	protected $instance;

	/**
	 * Holds the user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->user     = Mockery::mock( User_Helper::class );
		$this->instance = new Alert_Dismissal_Action( $this->user );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user' )
		);
	}

	/**
	 * Tests dismissing an alert.
	 *
	 * @covers ::dismiss
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_dismiss_alert() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( [ 'other alert' => true ] );

		$this->user
			->expects( 'update_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn(
				[
					'other alert' => true,
					'test'        => true,
				]
			);

		$this->assertTrue( $this->instance->dismiss( 'test' ) );
	}

	/**
	 * Tests dismissing an alert that is not allowed.
	 *
	 * @covers ::dismiss
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_dismiss_alert_not_allowed() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'allowed_alert' ] );

		$this->user
			->expects( 'get_meta' )
			->never();

		$this->user
			->expects( 'update_meta' )
			->never();

		$this->assertFalse( $this->instance->dismiss( 'test' ) );
	}

	/**
	 * Tests dismissing an alert that is already dismissed.
	 *
	 * @covers ::dismiss
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_dismiss_alert_already_dismissed() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'already_dismissed' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( [ 'already_dismissed' => true ] );

		$this->user
			->expects( 'update_meta' )
			->never();

		$this->assertTrue( $this->instance->dismiss( 'already_dismissed' ) );
	}

	/**
	 * Tests dismissing an alert - retrieving the dismissed alerts goes wrong.
	 *
	 * @covers ::dismiss
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_dismiss_alert_wrong_dismissed_alerts() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( false );

		$this->user
			->expects( 'update_meta' )
			->never();

		$this->assertFalse( $this->instance->dismiss( 'test' ) );
	}

	/**
	 * Tests dismissing an alert - retrieving the current user ID goes wrong.
	 *
	 * @covers ::dismiss
	 *
	 * @return void
	 */
	public function test_dismiss_alert_wrong_current_user_id() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 0 );

		$this->user
			->expects( 'get_meta' )
			->never();

		$this->user
			->expects( 'update_meta' )
			->never();

		$this->assertFalse( $this->instance->dismiss( 'test' ) );
	}

	/**
	 * Tests dismissing an alert - but receiving an update failure.
	 *
	 * @covers ::dismiss
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_dismiss_alert_update_failure() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( [ 'other alert' => true ] );

		$this->user
			->expects( 'update_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( false );

		$this->assertFalse( $this->instance->dismiss( 'test' ) );
	}

	/**
	 * Tests resetting an alert.
	 *
	 * @covers ::reset
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_reset_alert() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn(
				[
					'some alert'  => true,
					'test'        => true,
					'other alert' => true,
				]
			);

		$this->user
			->expects( 'delete_meta' )
			->never();

		$this->user
			->expects( 'update_meta' )
			->with(
				1,
				Alert_Dismissal_Action::USER_META_KEY,
				[
					'some alert'  => true,
					'other alert' => true,
				]
			)
			->once()
			->andReturn(
				[
					'some alert'  => true,
					'other alert' => true,
				]
			);

		$this->assertTrue( $this->instance->reset( 'test' ) );
	}

	/**
	 * Tests resetting an alert - that is not allowed.
	 *
	 * @covers ::reset
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_reset_alert_not_allowed() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'allowed_alert' ] );

		$this->user
			->expects( 'get_meta' )
			->never();

		$this->user
			->expects( 'delete_meta' )
			->never();

		$this->user
			->expects( 'update_meta' )
			->never();

		$this->assertFalse( $this->instance->reset( 'test' ) );
	}

	/**
	 * Tests resetting the only dismissed alert.
	 *
	 * @covers ::reset
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_reset_alert_last_remaining() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( [ 'test' => true ] );

		$this->user
			->expects( 'delete_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, [ 'test' => true ] )
			->andReturn( true );

		$this->user
			->expects( 'update_meta' )
			->never();

		$this->assertTrue( $this->instance->reset( 'test' ) );
	}

	/**
	 * Tests resetting the only dismissed alert - but receiving a delete failure.
	 *
	 * @covers ::reset
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_reset_alert_last_remaining_delete_failure() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( [ 'test' => true ] );

		$this->user
			->expects( 'delete_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, [ 'test' => true ] )
			->andReturn( false );

		$this->user
			->expects( 'update_meta' )
			->never();

		$this->assertFalse( $this->instance->reset( 'test' ) );
	}

	/**
	 * Tests resetting a non-dismissed alert.
	 *
	 * @covers ::reset
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_reset_alert_non_dismissed_alert() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( [ 'other alert' => true ] );

		$this->user
			->expects( 'delete_meta' )
			->never();

		$this->user
			->expects( 'update_meta' )
			->never();

		$this->assertTrue( $this->instance->reset( 'test' ) );
	}

	/**
	 * Tests resetting an alert when the user has no dismissed alerts.
	 *
	 * @covers ::reset
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_reset_alert_no_dismissed_alerts() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( [] );

		$this->user
			->expects( 'delete_meta' )
			->never();

		$this->user
			->expects( 'update_meta' )
			->never();

		$this->assertTrue( $this->instance->reset( 'test' ) );
	}

	/**
	 * Tests resetting an alert - retrieving the dismissed alerts goes wrong.
	 *
	 * @covers ::reset
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_reset_alert_wrong_dismissed_alerts() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( false );

		$this->user
			->expects( 'delete_meta' )
			->never();

		$this->user
			->expects( 'update_meta' )
			->never();

		$this->assertFalse( $this->instance->reset( 'test' ) );
	}

	/**
	 * Tests resetting an alert - retrieving the current user ID goes wrong.
	 *
	 * @covers ::reset
	 *
	 * @return void
	 */
	public function test_reset_alert_wrong_current_user_id() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 0 );

		$this->user
			->expects( 'get_meta' )
			->never();

		$this->user
			->expects( 'delete_meta' )
			->never();

		$this->user
			->expects( 'update_meta' )
			->never();

		$this->assertFalse( $this->instance->reset( 'test' ) );
	}

	/**
	 * Tests resetting an alert - but returning an update failure.
	 *
	 * @covers ::reset
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_reset_alert_update_failure() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn(
				[
					'some alert'  => true,
					'test'        => true,
					'other alert' => true,
				]
			);

		$this->user
			->expects( 'delete_meta' )
			->never();

		$this->user
			->expects( 'update_meta' )
			->with(
				1,
				Alert_Dismissal_Action::USER_META_KEY,
				[
					'some alert'  => true,
					'other alert' => true,
				]
			)
			->once()
			->andReturn( false );

		$this->assertFalse( $this->instance->reset( 'test' ) );
	}

	/**
	 * Tests that the alert is dismissed.
	 *
	 * @covers ::is_dismissed
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_is_dismissed_true() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( [ 'test' => true ] );

		$this->assertTrue( $this->instance->is_dismissed( 'test' ) );
	}

	/**
	 * Tests that the alert is not dismissed.
	 *
	 * @covers ::is_dismissed
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_is_dismissed_false() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( [ 'other alert' => true ] );

		$this->assertFalse( $this->instance->is_dismissed( 'test' ) );
	}

	/**
	 * Tests that the alert is not dismissed when it is not allowed.
	 *
	 * @covers ::is_dismissed
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_is_dismissed_not_allowed() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'allowed_alert' ] );

		$this->user
			->expects( 'get_meta' )
			->never();

		$this->assertFalse( $this->instance->is_dismissed( 'test' ) );
	}

	/**
	 * Tests that the alert is not dismissed - retrieving the dismissed alerts goes wrong.
	 *
	 * @covers ::is_dismissed
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_is_dismissed_wrong_dismissed_alerts() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( false );

		$this->assertFalse( $this->instance->is_dismissed( 'test' ) );
	}

	/**
	 * Tests that the alert is not dismissed - retrieving the current user ID goes wrong.
	 *
	 * @covers ::is_dismissed
	 * @covers ::get_dismissed_alerts
	 *
	 * @return void
	 */
	public function test_is_dismissed_wrong_current_user_id() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 0 );

		$this->user
			->expects( 'get_meta' )
			->never();

		$this->assertFalse( $this->instance->is_dismissed( 'test' ) );
	}

	/**
	 * Tests that get dismissed alerts returns an empty array when get_meta returns an empty string.
	 *
	 * @covers ::get_dismissed_alerts
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_get_dismissed_alerts_empty_array() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 'test' ] );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( '' );

		$this->assertFalse( $this->instance->is_dismissed( 'test' ) );
	}

	/**
	 * Tests that all dismissed returns an array with the alertkey(s) begin true for the (valid) user_id.
	 *
	 * @covers ::all_dismissed
	 * @covers ::get_dismissed_alerts
	 *
	 * @return void
	 */
	public function test_all_dismissed() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( [ 'testalert1' => true ] );

		$this->assertEquals( [ 'testalert1' => true ], $this->instance->all_dismissed() );
	}

	/**
	 * Tests that all dismissed returns false when there is no current user.
	 *
	 * @covers ::all_dismissed
	 *
	 * @return void
	 */
	public function test_all_dismissed_no_current_user() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 0 );

		$this->user
			->expects( 'get_meta' )
			->never();

		$this->assertFalse( $this->instance->all_dismissed() );
	}

	/**
	 * Tests that all dismissed returns false when get_dismissed_alerts returns false.
	 *
	 * @covers ::all_dismissed
	 * @covers ::get_dismissed_alerts
	 *
	 * @return void
	 */
	public function test_all_dismissed_get_dismissed_false() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( false );

		$this->assertFalse( $this->instance->all_dismissed() );
	}

	/**
	 * Tests that all dismissed returns an empty array when get_dismissed_alerts returns an empty array.
	 *
	 * @covers ::all_dismissed
	 * @covers ::get_dismissed_alerts
	 *
	 * @return void
	 */
	public function test_all_dismissed_no_dismissed_alerts() {
		$this->user
			->expects( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		$this->user
			->expects( 'get_meta' )
			->with( 1, Alert_Dismissal_Action::USER_META_KEY, true )
			->once()
			->andReturn( [] );

		$this->assertEquals( [], $this->instance->all_dismissed() );
	}

	/**
	 * Tests that get allowed dismissable alerts requires an array back.
	 *
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_get_allowed_array_check() {
		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( 'not an array' );

		$this->assertFalse( $this->instance->is_allowed( 'test' ) );
	}

	/**
	 * Tests that get allowed dismissable alerts requires an array with only strings.
	 *
	 * @covers ::is_allowed
	 * @covers ::get_allowed_dismissable_alerts
	 *
	 * @return void
	 */
	public function test_get_allowed_string_check() {
		Monkey\Filters\expectApplied( 'wpseo_allowed_dismissable_alerts' )
			->with( [] )
			->once()
			->andReturn( [ 1 ] );

		$this->assertFalse( $this->instance->is_allowed( 1 ) );
	}
}
