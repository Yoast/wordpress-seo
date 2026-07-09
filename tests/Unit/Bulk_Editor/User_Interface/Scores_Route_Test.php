<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface;

use Brain\Monkey\Functions;
use Mockery;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Score_Updater;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Score_Update;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result_Collection;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Scores_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Scores_Route.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Scores_Route
 */
final class Scores_Route_Test extends TestCase {

	/**
	 * The score updater.
	 *
	 * @var Mockery\MockInterface|Score_Updater
	 */
	private $score_updater;

	/**
	 * Holds the instance.
	 *
	 * @var Scores_Route
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->score_updater = Mockery::mock( Score_Updater::class );
		$this->instance      = new Scores_Route( $this->score_updater );

		// Defines the WP_Error class, which is not available in the unit test context.
		Mockery::mock( WP_Error::class );
	}

	/**
	 * Tests the route is registered.
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'/bulk_editor/update_scores',
				Mockery::on(
					static function ( $args ) {
						return $args['methods'] === 'POST'
							&& \is_callable( $args['callback'] )
							&& \is_callable( $args['permission_callback'] )
							&& \array_key_exists( 'items', $args['args'] );
					},
				),
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests the permission check requires the manage options capability.
	 *
	 * @return void
	 */
	public function test_check_permissions() {
		Functions\expect( 'current_user_can' )->once()->with( 'wpseo_manage_options' )->andReturnTrue();

		$this->assertTrue( $this->instance->check_permissions() );
	}

	/**
	 * Tests valid items pass validation.
	 *
	 * @return void
	 */
	public function test_validate_items_valid() {
		$items = [
			[
				'id'        => 7,
				'seo_title_score' => 63,
			],
			[
				'id'                     => 8,
				'meta_description_score' => 0,
				'seo_title_score'        => 100,
			],
		];

		$this->assertTrue( $this->instance->validate_items( $items ) );
	}

	/**
	 * Tests validation rejects invalid item collections. Each case exercises a distinct branch;
	 * the unit-test WP_Error stub carries no code, so only the rejection is asserted.
	 *
	 * @dataProvider provider_invalid_items
	 *
	 * @param mixed $items The items to validate.
	 *
	 * @return void
	 */
	public function test_validate_items_invalid( $items ) {
		$this->assertInstanceOf( WP_Error::class, $this->instance->validate_items( $items ) );
	}

	/**
	 * Provides invalid item collections, each triggering a distinct validation branch.
	 *
	 * @return array<string, array{0: mixed}> The invalid items.
	 */
	public static function provider_invalid_items() {
		return [
			'not an array'            => [ 'nope' ],
			'empty'                   => [ [] ],
			'too many items'          => [ \array_fill( 0, 21, [ 'id' => 1, 'seo_title_score' => 63 ] ) ],
			'item not an object'      => [ [ 'nope' ] ],
			'missing id'              => [ [ [ 'seo_title_score' => 63 ] ] ],
			'non-integer id'          => [ [ [ 'id' => '7', 'seo_title_score' => 63 ] ] ],
			'no scores'               => [ [ [ 'id' => 7 ] ] ],
			'non-integer score'       => [ [ [ 'id' => 7, 'seo_title_score' => '63' ] ] ],
			'score above the maximum' => [ [ [ 'id' => 7, 'seo_title_score' => 101 ] ] ],
			'score below the minimum' => [ [ [ 'id' => 7, 'meta_description_score' => -1 ] ] ],
		];
	}

	/**
	 * Tests update builds the score updates from the request and returns the results.
	 *
	 * @return void
	 */
	public function test_update() {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )->with( 'items' )->andReturn(
			[
				[
					'id'                     => 7,
					'seo_title_score'        => 63,
					'meta_description_score' => 85,
				],
			],
		);

		$collection = Mockery::mock( Update_Result_Collection::class );
		$collection->expects( 'to_array' )->andReturn( [ 'results' => [ [ 'id' => 7, 'success' => true ] ] ] );

		$this->score_updater
			->expects( 'update' )
			->once()
			->with(
				Mockery::on(
					static function ( $updates ) {
						return \count( $updates ) === 1
							&& $updates[0] instanceof Post_Score_Update
							&& $updates[0]->get_post_id() === 7
							&& $updates[0]->get_seo_title_score() === 63
							&& $updates[0]->get_meta_description_score() === 85;
					},
				),
			)
			->andReturn( $collection );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->update( $request ) );
	}
}
