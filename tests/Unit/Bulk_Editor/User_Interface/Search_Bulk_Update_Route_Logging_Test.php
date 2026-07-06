<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface;

use Mockery;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result_Collection;

/**
 * Test class for the logging behaviour of the bulk update route.
 *
 * @group Bulk_Editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Abstract_Bulk_Update_Route
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Bulk_Update_Route_Logging_Test extends Abstract_Search_Bulk_Update_Route_Test {

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		// Defines the WP classes, which are not available in the unit test context.
		Mockery::mock( WP_Error::class );
		Mockery::mock( 'overload:' . WP_REST_Response::class );
	}

	/**
	 * Tests the incoming batch is logged with its update type and item count.
	 *
	 * @return void
	 */
	public function test_update_logs_debug_summary() {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )
			->with( 'items' )
			->andReturn(
				[
					[
						'id'        => 1,
						'seo_title' => 'The title',
					],
				],
			);

		$this->bulk_updater->expects( 'update' )->andReturn( new Update_Result_Collection() );

		$this->logger->expects( 'debug' )->once()->with(
			'Received bulk {type} update for {count} item(s).',
			[
				'type'  => 'search',
				'count' => 1,
			],
		);

		$this->instance->update( $request );
	}

	/**
	 * Tests a rejected request is logged with its error code.
	 *
	 * @return void
	 */
	public function test_validate_items_logs_rejection() {
		$this->logger->expects( 'debug' )->once()->with(
			'Bulk update request rejected: {code}.',
			[ 'code' => 'rest_no_items' ],
		);

		$this->instance->validate_items( [] );
	}
}
