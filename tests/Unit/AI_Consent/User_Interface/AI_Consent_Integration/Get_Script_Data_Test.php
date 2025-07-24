<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\User_Interface\AI_Consent_Integration;

use Brain\Monkey;

/**
 * Tests the AI_Consent_Integration's get_script_data method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI_Consent\User_Interface\Ai_Consent_Integration::get_script_data
 */
final class Get_Script_Data_Test extends Abstract_AI_Consent_Integration_Test {

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

		$this->instance->get_script_data();
	}
}
