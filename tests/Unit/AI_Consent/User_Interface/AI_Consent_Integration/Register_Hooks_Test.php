<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\User_Interface\AI_Consent_Integration;

use Brain\Monkey;

/**
 * Tests the AI_Consent_Integration's register_hooks method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI_Consent\User_Interface\Ai_Consent_Integration::register_hooks
 */
final class Register_Hooks_Test extends Abstract_AI_Consent_Integration_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @dataProvider data_provider_register_hooks
	 *
	 * @param bool $edit_posts Whether the user can edit posts.
	 *
	 * @return void
	 */
	public function test_register_hooks( $edit_posts ) {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_posts' )
			->andReturn( $edit_posts );

		Monkey\Actions\expectAdded( 'wpseo_user_profile_additions' )
			->times( (int) $edit_posts )
			->with( [ $this->instance, 'render_user_profile' ], 12 );

		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' )
			->once()
			->with( [ $this->instance, 'enqueue_assets' ], 11 );

		$this->instance->register_hooks();
	}

	/**
	 * Data provider for the register_hooks test.
	 *
	 * @return array<string, array<string, bool>>
	 */
	public static function data_provider_register_hooks() {
		return [
			'When user can edit posts' => [
				'edit_posts' => true,
			],
			'When user can not edit posts' => [
				'edit_posts' => false,
			],
		];
	}
}
