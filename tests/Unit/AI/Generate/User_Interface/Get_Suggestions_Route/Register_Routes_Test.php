<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\User_Interface\Get_Suggestions_Route;

use Brain\Monkey\Functions;

/**
 * Tests the Get_Suggestions_Route's register_routes method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generate\User_Interface\Get_Suggestions_Route::register_routes
 */
final class Register_Routes_Test extends Abstract_Get_Suggestions_Route_Test {

	/**
	 * Tests that register_routes registers the expected route.
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'/ai_generator/get_suggestions',
				[
					'methods'             => 'POST',
					'args'                => [
						'type'            => [
							'required'    => true,
							'type'        => 'string',
							'enum'        => [
								'seo-title',
								'meta-description',
								'product-seo-title',
								'product-meta-description',
								'product-taxonomy-seo-title',
								'product-taxonomy-meta-description',
								'taxonomy-seo-title',
								'taxonomy-meta-description',
							],
							'description' => 'The type of suggestion requested.',
						],
						'prompt_content'  => [
							'required'    => true,
							'type'        => 'string',
							'description' => 'The content needed by the prompt to ask for suggestions.',
						],
						'focus_keyphrase' => [
							'required'    => true,
							'type'        => 'string',
							'description' => 'The focus keyphrase associated to the post.',
						],
						'language'        => [
							'required'    => true,
							'type'        => 'string',
							'description' => 'The language the post is written in.',
						],
						'platform'        => [
							'required'    => true,
							'type'        => 'string',
							'enum'        => [
								'Google',
								'Facebook',
								'Twitter',
							],
							'description' => 'The platform the post is intended for.',
						],
						'editor' => [
							'required'    => true,
							'type'        => 'string',
							'enum'        => [
								'classic',
								'elementor',
								'gutenberg',
							],
							'description' => 'The current editor.',
						],
					],
					'callback'            => [ $this->instance, 'get_suggestions' ],
					'permission_callback' => [ $this->instance, 'check_permissions' ],
				]
			);

		$this->instance->register_routes();
	}
}
