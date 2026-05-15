<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Content_Planner_Integration;

use Mockery;
use Yoast\WP\SEO\AI\Content_Planner\User_Interface\Banner_Permanent_Dismissal_Route;
use Yoast\WP\SEO\AI\Content_Planner\User_Interface\Content_Planner_Integration;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_List;

/**
 * Tests the Content_Planner_Integration get_script_data method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Content_Planner_Integration::get_script_data
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Content_Planner_Integration::is_minimum_posts_met
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Content_Planner_Integration::is_banner_permanently_dismissed
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Script_Data_Test extends Abstract_Content_Planner_Integration_Test {

	/**
	 * Tests that get_script_data returns all expected keys when the threshold is met and the banner is dismissed.
	 *
	 * @return void
	 */
	public function test_get_script_data_returns_expected_shape_when_threshold_met_and_banner_dismissed() {
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

		$expected = [
			'endpoints'                    => $endpoints,
			'minPostsMet'                  => true,
			'isBannerPermanentlyDismissed' => true,
		];

		$this->assertSame( $expected, $this->instance->get_script_data() );
	}

	/**
	 * Tests that minPostsMet is false when the number of recently modified posts is below the threshold.
	 *
	 * @return void
	 */
	public function test_get_script_data_returns_min_posts_met_false_when_below_threshold() {
		$endpoint_list = Mockery::mock( Endpoint_List::class );
		$endpoint_list->expects( 'to_paths_array' )->once()->andReturn( [] );
		$this->endpoints_repository->expects( 'get_all_endpoints' )->once()->andReturn( $endpoint_list );

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', Content_Planner_Integration::MIN_PUBLISHED_POSTS, false )
			->andReturn( \array_fill( 0, ( Content_Planner_Integration::MIN_PUBLISHED_POSTS - 1 ), 'post' ) );

		$this->user_helper->expects( 'get_current_user_id' )->once()->andReturn( 1 );
		$this->user_helper
			->expects( 'get_meta' )
			->once()
			->with( 1, Banner_Permanent_Dismissal_Route::USER_META_KEY, true )
			->andReturn( '' );

		$result = $this->instance->get_script_data();

		$this->assertFalse( $result['minPostsMet'] );
		$this->assertFalse( $result['isBannerPermanentlyDismissed'] );
		$this->assertSame( [], $result['endpoints'] );
	}

	/**
	 * Tests that isBannerPermanentlyDismissed is false when user meta is the string "0".
	 *
	 * @return void
	 */
	public function test_get_script_data_returns_banner_dismissed_false_when_meta_is_string_zero() {
		$endpoint_list = Mockery::mock( Endpoint_List::class );
		$endpoint_list->expects( 'to_paths_array' )->once()->andReturn( [] );
		$this->endpoints_repository->expects( 'get_all_endpoints' )->once()->andReturn( $endpoint_list );

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', Content_Planner_Integration::MIN_PUBLISHED_POSTS, false )
			->andReturn( \array_fill( 0, Content_Planner_Integration::MIN_PUBLISHED_POSTS, 'post' ) );

		$this->user_helper->expects( 'get_current_user_id' )->once()->andReturn( 7 );
		$this->user_helper
			->expects( 'get_meta' )
			->once()
			->with( 7, Banner_Permanent_Dismissal_Route::USER_META_KEY, true )
			->andReturn( '0' );

		$result = $this->instance->get_script_data();

		$this->assertFalse( $result['isBannerPermanentlyDismissed'] );
	}

	/**
	 * Tests that isBannerPermanentlyDismissed is false when no user meta exists.
	 *
	 * @return void
	 */
	public function test_get_script_data_returns_banner_dismissed_false_when_no_meta() {
		$endpoint_list = Mockery::mock( Endpoint_List::class );
		$endpoint_list->expects( 'to_paths_array' )->once()->andReturn( [] );
		$this->endpoints_repository->expects( 'get_all_endpoints' )->once()->andReturn( $endpoint_list );

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', Content_Planner_Integration::MIN_PUBLISHED_POSTS, false )
			->andReturn( \array_fill( 0, Content_Planner_Integration::MIN_PUBLISHED_POSTS, 'post' ) );

		$this->user_helper->expects( 'get_current_user_id' )->once()->andReturn( 42 );
		$this->user_helper
			->expects( 'get_meta' )
			->once()
			->with( 42, Banner_Permanent_Dismissal_Route::USER_META_KEY, true )
			->andReturn( '' );

		$result = $this->instance->get_script_data();

		$this->assertFalse( $result['isBannerPermanentlyDismissed'] );
		$this->assertTrue( $result['minPostsMet'] );
	}
}
