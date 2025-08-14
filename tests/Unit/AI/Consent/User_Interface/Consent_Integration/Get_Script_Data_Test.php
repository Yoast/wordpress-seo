<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\User_Interface\Consent_Integration;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_List;

/**
 * Tests the AI_Consent_Integration's get_script_data method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Integration::get_script_data
 */
final class Get_Script_Data_Test extends Abstract_Consent_Integration_Test {

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
		// Plugin URL.
		Monkey\Functions\expect( 'plugins_url' )
			->once()
			->andReturn( 'https://example.com/wp-content/plugins/wordpress-seo' );

		$this->short_link_helper->expects( 'get_query_params' )->andReturn( [] );

		$endpoint_list = Mockery::mock( Endpoint_List::class );
		$this->consent_endpoint_repository->expects( 'get_all_endpoints' )
			->once()
			->andReturn(  $endpoint_list );
		$endpoint_list->expects( 'to_array' )
			->once()
			->andReturn( [ 'consent' => 'yoast/v1/ai_generator/consent' ] );

		$this->instance->get_script_data();
	}
}
