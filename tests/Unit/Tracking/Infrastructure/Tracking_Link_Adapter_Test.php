<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Tracking\Infrastructure;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Tracking\Infrastructure\Tracking_Link_Adapter;

/**
 * Tests the Tracking_Link_Adapter class.
 *
 * @group tracking
 *
 * @covers Yoast\WP\SEO\Tracking\Infrastructure\Tracking_Link_Adapter::create_tracking_link_for_tasks
 */
final class Tracking_Link_Adapter_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Tracking_Link_Adapter
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Tracking_Link_Adapter();
	}

	/**
	 * Tests create_tracking_link_for_tasks when URL is null.
	 *
	 * @return void
	 */
	public function test_create_tracking_link_for_tasks_null_url() {
		$result = $this->instance->create_tracking_link_for_tasks( null );

		$this->assertNull( $result );
	}

	/**
	 * Tests create_tracking_link_for_tasks when URL is a valid string.
	 *
	 * @return void
	 */
	public function test_create_tracking_link_for_tasks_valid_url() {
		$input_url    = 'https://example.com/test';
		$nonce_value  = 'test_nonce_123';
		$expected_url = 'https://example.com/test?wpseo_tracked_action=task_first_actioned_on&wpseo_tracking_nonce=test_nonce_123';

		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wpseo_tracking_nonce' )
			->once()
			->andReturn( $nonce_value );

		Monkey\Functions\expect( 'add_query_arg' )
			->with(
				[
					'wpseo_tracked_action' => 'task_first_actioned_on',
					'wpseo_tracking_nonce' => $nonce_value,
				],
				$input_url
			)
			->once()
			->andReturn( $expected_url );

		$result = $this->instance->create_tracking_link_for_tasks( $input_url );

		$this->assertSame( $expected_url, $result );
	}
}
