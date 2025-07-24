<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\User_Interface\AI_Consent_Integration;

use Brain\Monkey;

/**
 * Tests the AI_Consent_Integration's enqueue_assets method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI_Consent\User_Interface\Ai_Consent_Integration::enqueue_assets
 */
final class Enqueue_Assets_Test extends Abstract_AI_Consent_Integration_Test {

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
		// Plugin URL.
		Monkey\Functions\expect( 'plugins_url' )
			->once()
			->andReturn( 'https://example.com/wp-content/plugins/wordpress-seo' );

		// Enqueueing.
		$this->asset_manager->expects( 'enqueue_style' )->once()->with( 'ai-generator' );
		$this->asset_manager->expects( 'enqueue_script' )->once()->with( 'ai-consent' );
		$this->asset_manager->expects( 'localize_script' )->once()->with(
			'ai-consent',
			'wpseoAiConsent',
			[
				'hasConsent' => true,
				'pluginUrl'  => 'https://example.com/wp-content/plugins/wordpress-seo',
				'linkParams' => [],
			]
		);

		$this->short_link_helper->expects( 'get_query_params' )->andReturn( [] );

		$this->instance->enqueue_assets();
	}
}
