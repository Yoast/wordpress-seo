<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Route;

use Mockery;
use WP_Error;
use WP_REST_Request;

/**
 * Tests for the Site_Schema_Aggregator_Route's aggregate_site_schema method.
 *
 * @group schema-aggregator
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Route::aggregate_site_schema
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Aggregate_Site_Schema_Test extends Abstract_Site_Schema_Aggregator_Route_Test {

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );
	}

	/**
	 * Tests that aggregate_site_schema returns a WP_Error when the post type is not indexable.
	 *
	 * @return void
	 */
	public function test_aggregate_site_schema_returns_error_for_noindex_post_type() {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )
			->with( 'post_type' )
			->andReturn( 'custom_post' );

		$this->post_type_helper
			->expects( 'is_indexable' )
			->with( 'custom_post' )
			->andReturn( false );

		$result = $this->instance->aggregate_site_schema( $request );

		$this->assertInstanceOf( WP_Error::class, $result );
	}
}
