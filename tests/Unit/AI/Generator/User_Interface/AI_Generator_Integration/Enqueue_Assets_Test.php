<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\User_Interface\AI_Generator_Integration;

use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Introductions\Application\Ai_Fix_Assessments_Upsell;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_List;

/**
 * Tests the AI_Generator_Integration's enqueue_assets method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generator\User_Interface\AI_Generator_Integration::enqueue_assets
 */
final class Enqueue_Assets_Test extends Abstract_AI_Generator_Integration_Test {

	/**
	 * Tests enqueuing the assets.
	 *
	 * @return void
	 */
	public function test_enqueue_assets() {
		// Current user ID is used for the consent permission.
		$user_id = 1;
		$this->user_helper->expects( 'get_current_user_id' )->once()->withNoArgs()->andReturn( $user_id );
		// Has consent.
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent', true )
			->andReturn( true );

		$this->addon_manager
			->expects( 'has_valid_subscription' )
			->once()
			->with( WPSEO_Addon_Manager::PREMIUM_SLUG )
			->andReturn( true );

		$this->addon_manager
			->expects( 'has_valid_subscription' )
			->once()
			->with( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG )
			->andReturn( true );

		$this->introductions_seen_repository->expects( 'is_introduction_seen' )
			->once()
			->with( $user_id, AI_Fix_Assessments_Upsell::ID )
			->andReturn( true );

		$this->api_client->expects( 'get_request_timeout' )
			->once()
			->andReturn( 0 );

		$this->options_helper->expects( 'get' )
			->once()
			->with( 'ai_free_sparks_started_on', null )
			->andReturn( \time() );

		$generator_endpoint_list   = Mockery::mock( Endpoint_List::class );
		$consent_endpoint_list     = Mockery::mock( Endpoint_List::class );
		$free_sparks_endpoint_list = Mockery::mock( Endpoint_List::class );
		$this->generator_endpoints_repository->expects( 'get_all_endpoints' )->once()->andReturn( $generator_endpoint_list );
		$this->consent_endpoints_repository->expects( 'get_all_endpoints' )->once()->andReturn( $consent_endpoint_list );
		$this->free_sparks_endpoints_repository->expects( 'get_all_endpoints' )->once()->andReturn( $free_sparks_endpoint_list );
		$generator_endpoint_list->expects( 'merge_with' )->once()->with( $consent_endpoint_list )->andReturnSelf();
		$generator_endpoint_list->expects( 'merge_with' )->once()->with( $free_sparks_endpoint_list )->andReturnSelf();
		$generator_endpoint_list->expects( 'to_paths_array' )->once()->andReturn( [] );

		// Enqueueing.
		$this->asset_manager->expects( 'enqueue_script' )->once()->with( 'ai-generator' );
		$this->asset_manager->expects( 'localize_script' )->once()->with(
			'ai-generator',
			'wpseoAiGenerator',
			[
				'hasConsent'           => true,
				'productSubscriptions' => [
					'premiumSubscription'     => true,
					'wooCommerceSubscription' => true,
				],
				'hasSeenIntroduction'  => true,
				'requestTimeout'       => 0,
				'isFreeSparks'         => true,
				'endpoints'            => [],
			],
		);
		$this->asset_manager->expects( 'enqueue_style' )->once()->with( 'ai-generator' );

		$this->instance->enqueue_assets();
	}
}
