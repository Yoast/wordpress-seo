<?php

namespace Yoast\WP\SEO\Analytics\User_Interface;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Handles registering and saving additional contactmethods for users.
 */
class Additional_Contactmethods_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * Registers action hook to maybe save an option.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		\add_filter( 'user_contactmethods', [ $this, 'update_contactmethods'] );
	}

	/**
	 * Updates the contactmethods with an additional set of social profiles.
	 *
	 * These are used with the Facebook author, rel="author", Twitter cards implementation, but also in the `sameAs` schema attributes.
	 *
	 * @param array<string, string> $contactmethods Currently set contactmethods.
	 *
	 * @return array<string, string> Contactmethods with added contactmethods.
	 */
	public function update_contactmethods( $contactmethods ) {
		$contactmethods['facebook']   = __( 'Facebook profile URL', 'wordpress-seo' );
		$contactmethods['instagram']  = __( 'Instagram profile URL', 'wordpress-seo' );
		$contactmethods['linkedin']   = __( 'LinkedIn profile URL', 'wordpress-seo' );
		$contactmethods['myspace']    = __( 'MySpace profile URL', 'wordpress-seo' );
		$contactmethods['pinterest']  = __( 'Pinterest profile URL', 'wordpress-seo' );
		$contactmethods['soundcloud'] = __( 'SoundCloud profile URL', 'wordpress-seo' );
		$contactmethods['tumblr']     = __( 'Tumblr profile URL', 'wordpress-seo' );
		$contactmethods['twitter']    = __( 'X username (without @)', 'wordpress-seo' );
		$contactmethods['youtube']    = __( 'YouTube profile URL', 'wordpress-seo' );
		$contactmethods['wikipedia']  = __( 'Wikipedia page about you', 'wordpress-seo' ) . '<br/><small>' . __( '(if one exists)', 'wordpress-seo' ) . '</small>';

		return $contactmethods;
	}
}
