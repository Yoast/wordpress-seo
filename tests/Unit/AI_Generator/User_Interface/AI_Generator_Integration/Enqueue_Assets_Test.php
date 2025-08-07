<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\AI_Generator_Integration;

use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Introductions\Application\Ai_Fix_Assessments_Upsell;

/**
 * Tests the AI_Generator_Integration's enqueue_assets method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\AI_Generator_Integration::enqueue_assets
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
			]
		);
		$this->asset_manager->expects( 'enqueue_style' )->once()->with( 'ai-generator' );

		$this->instance->enqueue_assets();
	}
}
