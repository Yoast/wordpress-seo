<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Tracking\Infrastructure\Tracking_On_Page_Load;

use Brain\Monkey;
use Generator;

/**
 * Tests the Tracking_On_Page_Load_Integration store_version_on_page_load method.
 *
 * @group tracking
 *
 * @covers Yoast\WP\SEO\Tracking\Infrastructure\Tracking_On_Page_Load_Integration::store_version_on_page_load
 */
final class Store_Version_On_Page_Load_Test extends Abstract_Tracking_On_Page_Load_Integration_Test {

	/**
	 * Tests store_version_on_page_load.
	 *
	 * @dataProvider provider_store_version_on_page_load
	 *
	 * @param string|int $wpseo_tracked_action    The wpseo_tracked_action query parameter.
	 * @param string     $wpseo_tracking_nonce    The wpseo_tracking_nonce query parameter.
	 * @param int        $capability_check_times  How many times current_user_can is expected to be called.
	 * @param bool       $capability_check_result The result of current_user_can.
	 * @param int        $verify_nonce_times      How many times wp_verify_nonce is expected to be called.
	 * @param bool       $verify_nonce_result     The result of wp_verify_nonce.
	 * @param int        $track_times             How many times track_version_for_performed_action is expected to be called.
	 *
	 * @return void
	 */
	public function test_store_version_on_page_load(
		$wpseo_tracked_action,
		$wpseo_tracking_nonce,
		$capability_check_times,
		$capability_check_result,
		$verify_nonce_times,
		$verify_nonce_result,
		$track_times
	) {
		$_GET['wpseo_tracked_action'] = $wpseo_tracked_action;
		$_GET['wpseo_tracking_nonce'] = $wpseo_tracking_nonce;

		$this->capability_helper
			->expects( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->times( $capability_check_times )
			->andReturn( $capability_check_result );

		Monkey\Functions\expect( 'wp_verify_nonce' )
			->times( $verify_nonce_times )
			->with( $wpseo_tracking_nonce, 'wpseo_tracking_nonce' )
			->andReturn( $verify_nonce_result );

		$this->action_tracker
			->expects( 'track_version_for_performed_action' )
			->with( $wpseo_tracked_action )
			->times( $track_times );

		$this->instance->store_version_on_page_load();
	}

	/**
	 * Dataprovider for test_store_version_on_page_load.
	 *
	 * @return Generator The test data.
	 */
	public static function provider_store_version_on_page_load() {
		yield 'Invalid tracked action query parameter' => [
			'wpseo_tracked_action'    => 1,
			'wpseo_tracking_nonce'    => 'irrelevant',
			'capability_check_times'  => 0,
			'capability_check_result' => 'irrelevant',
			'verify_nonce_times'      => 0,
			'verify_nonce_result'     => 'irrelevant',
			'track_times'             => 0,
		];
		yield 'Capabilities check failed' => [
			'wpseo_tracked_action'    => 'task_first_actioned_on',
			'wpseo_tracking_nonce'    => 'irrelevant',
			'capability_check_times'  => 1,
			'capability_check_result' => false,
			'verify_nonce_times'      => 0,
			'verify_nonce_result'     => 'irrelevant',
			'track_times'             => 0,
		];
		yield 'Nonce check failed' => [
			'wpseo_tracked_action'    => 'task_first_actioned_on',
			'wpseo_tracking_nonce'    => 'abcd123',
			'capability_check_times'  => 1,
			'capability_check_result' => true,
			'verify_nonce_times'      => 1,
			'verify_nonce_result'     => false,
			'track_times'             => 0,
		];
		yield 'Invalid tracked action' => [
			'wpseo_tracked_action'    => 'not_existing_action',
			'wpseo_tracking_nonce'    => 'abcd123',
			'capability_check_times'  => 1,
			'capability_check_result' => true,
			'verify_nonce_times'      => 1,
			'verify_nonce_result'     => true,
			'track_times'             => 0,
		];
		yield 'Completed action tracking' => [
			'wpseo_tracked_action'    => 'task_list_first_opened_on',
			'wpseo_tracking_nonce'    => 'abcd123',
			'capability_check_times'  => 1,
			'capability_check_result' => true,
			'verify_nonce_times'      => 1,
			'verify_nonce_result'     => true,
			'track_times'             => 1,
		];
	}
}
