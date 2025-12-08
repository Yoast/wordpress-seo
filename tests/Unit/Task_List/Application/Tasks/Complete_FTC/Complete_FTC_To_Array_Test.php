<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Complete_FTC;

use Brain\Monkey;

/**
 * Test class for getting the id.
 *
 * @group Complete_FTC
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Complete_FTC::get_id
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Complete_FTC::get_duration
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Complete_FTC::get_priority
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Complete_FTC::get_badge
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Complete_FTC::get_is_completed
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Complete_FTC::get_call_to_action
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Complete_FTC::get_copy_set
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Complete_FTC::to_array
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry::to_array
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set::to_array
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Complete_FTC_To_Array_Test extends Abstract_Complete_FTC_Test {

	/**
	 * Tests the task's to_array method when completed.
	 *
	 * @return void
	 */
	public function test_to_array_completed() {
		$this->ftc_notice_helper
			->expects( 'is_first_time_configuration_finished' )
			->once()
			->with( true )
			->andReturn( true );

		Monkey\Functions\expect( 'self_admin_url' )
			->once()
			->with( 'admin.php?page=wpseo_dashboard#/first-time-configuration' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_dashboard#/first-time-configuration' );

		$expected_result = [
			'id'           => 'complete-ftc',
			'duration'     => 15,
			'priority'     => 'high',
			'badge'        => null,
			'isCompleted' => true,
			'callToAction' => [
				'label' => 'Start configuration',
				'type' => 'link',
				'href'  => 'https://example.com/wp-admin/admin.php?page=wpseo_dashboard#/first-time-configuration',
			],
			'title'        => 'Complete the First-time configuration',
			'why'          => 'Skipping setup limits how much Yoast SEO can help you. Completing it makes sure the core settings are working in your favor.',
			'how'          => null,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when not completed.
	 *
	 * @return void
	 */
	public function test_to_array_not_completed() {
		$this->ftc_notice_helper
			->expects( 'is_first_time_configuration_finished' )
			->once()
			->with( true )
			->andReturn( false );

		Monkey\Functions\expect( 'self_admin_url' )
			->once()
			->with( 'admin.php?page=wpseo_dashboard#/first-time-configuration' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_dashboard#/first-time-configuration' );

		$expected_result = [
			'id'           => 'complete-ftc',
			'duration'     => 15,
			'priority'     => 'high',
			'badge'        => null,
			'isCompleted' => false,
			'callToAction' => [
				'label' => 'Start configuration',
				'type' => 'link',
				'href'  => 'https://example.com/wp-admin/admin.php?page=wpseo_dashboard#/first-time-configuration',
			],
			'title'        => 'Complete the First-time configuration',
			'why'          => 'Skipping setup limits how much Yoast SEO can help you. Completing it makes sure the core settings are working in your favor.',
			'how'          => null,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}
}
