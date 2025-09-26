<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\User_Interface\Consent_Integration;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_List;
/**
 * Tests the AI_Consent_Integration's enqueue_assets method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Integration::enqueue_assets
 */
final class Enqueue_Assets_Test extends Abstract_Consent_Integration_Test {

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
				'endpoints'  => [ 'consent' => 'yoast/v1/ai_generator/consent' ],
			]
		);

		$this->short_link_helper->expects( 'get_query_params' )->andReturn( [] );

		$endpoint_list = Mockery::mock( Endpoint_List::class );
		$this->consent_endpoint_repository->expects( 'get_all_endpoints' )
			->once()
			->andReturn( $endpoint_list );
		$endpoint_list->expects( 'to_array' )
			->once()
			->andReturn( [ 'consent' => 'yoast/v1/ai_generator/consent' ] );
		$this->instance->enqueue_assets();
	}
}
