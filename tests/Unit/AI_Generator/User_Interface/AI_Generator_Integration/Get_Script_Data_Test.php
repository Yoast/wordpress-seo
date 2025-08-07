<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\AI_Generator_Integration;

use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Introductions\Application\AI_Fix_Assessments_Upsell;

/**
 * Tests the AI_Generator_Integration's get_script_data method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\AI_Generator_Integration::get_script_data
 */
final class Get_Script_Data_Test extends Abstract_AI_Generator_Integration_Test {

	/**
	 * Tests getting the script data.
	 *
	 * @return void
	 */
	public function test_get_script_data() {
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

		$expected = [
			'hasConsent'           => true,
			'productSubscriptions' => [
				'premiumSubscription'     => true,
				'wooCommerceSubscription' => true,
			],
			'hasSeenIntroduction'  => true,
			'requestTimeout'       => 0,
			'isFreeSparks'         => true,
		];

		$this->assertSame( $expected, $this->instance->get_script_data() );
	}
}
