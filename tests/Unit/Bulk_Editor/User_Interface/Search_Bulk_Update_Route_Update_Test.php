<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface;

use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update_Collection;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result_Collection;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Type;

/**
 * Test class for the update callback.
 *
 * @group Bulk_Editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Abstract_Bulk_Update_Route::update
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Bulk_Update_Route_Update_Test extends Abstract_Search_Bulk_Update_Route_Test {

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		// Defines the WP_REST_Response class, which is not available in the unit test context.
		Mockery::mock( 'overload:' . WP_REST_Response::class );
	}

	/**
	 * Tests the request items are mapped to post updates and the results are returned.
	 *
	 * Absent fields must map to null, while present empty strings must remain values.
	 *
	 * @return void
	 */
	public function test_update() {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )
			->with( 'items' )
			->andReturn(
				[
					[
						'id'               => 1,
						'seo_title'        => 'The title',
						'meta_description' => '',
						'focus_keyphrase'  => 'The keyphrase',
					],
					[
						'id'               => 2,
						'meta_description' => 'The description',
					],
					[
						'id'              => 3,
						'focus_keyphrase' => '',
					],
				],
			);

		$results = new Update_Result_Collection();
		$results->add( Update_Result::for_success( 1 ) );
		$results->add( Update_Result::for_success( 2 ) );
		$results->add( Update_Result::for_success( 3 ) );

		$this->bulk_updater->expects( 'update' )
			->with(
				Mockery::on(
					static function ( $type ) {
						return $type instanceof Update_Type && $type->is_search();
					},
				),
				Mockery::on(
					static function ( $updates ) {
						if ( ! $updates instanceof Post_Update_Collection || \count( $updates->get() ) !== 3 ) {
							return false;
						}
						list( $first, $second, $third ) = $updates->get();

						return $first->get_post_id() === 1 && $first->get_title() === 'The title' && $first->get_description() === ''
							&& $first->get_focus_keyphrase() === 'The keyphrase'
							&& $second->get_post_id() === 2 && $second->has_title() === false && $second->get_description() === 'The description'
							&& $second->has_focus_keyphrase() === false
							&& $third->get_post_id() === 3 && $third->has_title() === false && $third->has_description() === false
							&& $third->get_focus_keyphrase() === '';
					},
				),
			)
			->andReturn( $results );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->update( $request ) );
	}
}
