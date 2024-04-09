<?php

namespace Yoast\WP\SEO\User_Meta\User_Interface;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\User_Can_Edit_Users_Conditional;
use Yoast\WP\SEO\Conditionals\User_Edit_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\User_Meta\Application\Custom_Meta_Repository;

/**
 * Handles custom meta for users.
 */
class Custom_Meta_Integration implements Integration_Interface {

	/**
	 * The custom meta repository.
	 *
	 * @var Custom_Meta_Repository $custom_meta_repository The custom meta repository.
	 */
	private $custom_meta_repository;

	/**
	 * The constructor.
	 *
	 * @param Custom_Meta_Repository $custom_meta_repository The custom meta repository.
	 */
	public function __construct( Custom_Meta_Repository $custom_meta_repository ) {
		$this->custom_meta_repository = $custom_meta_repository;
	}

	/**
	 * Retrieves the conditionals for the integration.
	 *
	 * @return array<Yoast\WP\SEO\Conditionals> The conditionals.
	 */
	public static function get_conditionals() {
		return [
			Admin_Conditional::class,
			User_Can_Edit_Users_Conditional::class,
			User_Edit_Conditional::class,
		];
	}

	/**
	 * Registers action hook.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		\add_action( 'personal_options_update', [ $this, 'process_user_option_update' ] );
		\add_action( 'edit_user_profile_update', [ $this, 'process_user_option_update' ] );
	}

	/**
	 * Updates the user metas that (might) have been set on the user profile page.
	 *
	 * @param int $user_id User ID of the updated user.
	 *
	 * @return void
	 */
	public function process_user_option_update( $user_id ) {
		\update_user_meta( $user_id, '_yoast_wpseo_profile_updated', \time() );

		if ( ! \check_admin_referer( 'wpseo_user_profile_update', 'wpseo_nonce' ) ) {
			return;
		}

		foreach ( $this->custom_meta_repository->get_custom_meta() as $meta ) {
			$meta_field_id = $meta->get_field_id();

			$user_input_to_store = isset( $_POST[ $meta_field_id ] ) ? \sanitize_text_field( \wp_unslash( $_POST[ $meta_field_id ] ) ) : '';
			if ( $meta->is_empty_allowed() || $user_input_to_store !== '' ) {
				\update_user_meta( $user_id, $meta->get_key(), $user_input_to_store );
				continue;
			}

			\delete_user_meta( $user_id, $meta->get_key() );
		}
	}
}
