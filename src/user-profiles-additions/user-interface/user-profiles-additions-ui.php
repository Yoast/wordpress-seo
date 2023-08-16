<?php

namespace Yoast\WP\SEO\User_Profiles_Additions\User_Interface;

use Yoast\WP\SEO\Conditionals\User_Profile_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Adds a new hook in the user profiles edit screen to add content.
 */
class User_Profiles_Additions_Ui implements Integration_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ User_Profile_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'show_user_profile', [ $this, 'add_hook_to_user_profile' ] );
		\add_action( 'edit_user_profile', [ $this, 'add_hook_to_user_profile' ] );
	}

	/**
	 * Add the inputs needed for SEO values to the User Profile page.
	 *
	 * @param WP_User $user User instance to output for.
	 */
	public function add_hook_to_user_profile( $user ) {

		echo '<div class="yoast yoast-settings">';

		/**
		 * Fires in the user profile.
		 *
		 * @internal
		 *
		 * @param \WP_User $user The current WP_User object.
		 */
		\do_action( 'wpseo_user_profile_additions', $user );
		echo '</div>';
	}
}

