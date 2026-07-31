<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Content_Planner_Integration;

use Mockery;
use Yoast\WP\SEO\AI\Content_Planner\User_Interface\Banner_Permanent_Dismissal_Route;
use Yoast\WP\SEO\AI\Content_Planner\User_Interface\Content_Planner_Integration;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_List;

/**
 * Tests the Content_Planner_Integration enqueue_assets method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Content_Planner_Integration::enqueue_assets
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Enqueue_Assets_Test extends Abstract_Content_Planner_Integration_Test {

	/**
	 * Tests that enqueue_assets enqueues the script and localizes it with the script data.
	 *
	 * @return void
	 */
	public function test_enqueue_assets() {
		$endpoints = [
			'get_outline' => '/yoast/v1/ai_content_planner/outline',
		];

		$endpoint_list = Mockery::mock( Endpoint_List::class );
		$endpoint_list->expects( 'to_paths_array' )->once()->andReturn( $endpoints );
		$this->endpoints_repository->expects( 'get_all_endpoints' )->once()->andReturn( $endpoint_list );

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', Content_Planner_Integration::MIN_PUBLISHED_POSTS, false )
			->andReturn( \array_fill( 0, Content_Planner_Integration::MIN_PUBLISHED_POSTS, 'post' ) );

		$this->user_helper->expects( 'get_current_user_id' )->once()->andReturn( 1 );
		$this->user_helper
			->expects( 'get_meta' )
			->once()
			->with( 1, Banner_Permanent_Dismissal_Route::USER_META_KEY, true )
			->andReturn( '1' );

		$this->asset_manager->expects( 'enqueue_script' )->once()->with( 'ai-content-planner' );
		$this->asset_manager
			->expects( 'localize_script' )
			->once()
			->with(
				'ai-content-planner',
				'wpseoContentPlanner',
				[
					'endpoints'                    => $endpoints,
					'minPostsMet'                  => true,
					'isBannerPermanentlyDismissed' => true,
				],
			);

		$this->instance->enqueue_assets();
	}
}
