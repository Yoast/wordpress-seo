<?php

namespace Yoast\WP\SEO\Conditionals\Admin;

use Yoast\WP\SEO\Conditionals\Conditional;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Base class can't be written shorter without abbreviating.
/**
 * Checks if the post is saved by inline-save. This is the case when doing quick edit.
 */
class Doing_Post_Quick_Edit_Save_Conditional implements Conditional {

	/**
	 * Checks if the current request is ajax and the action is inline-save.
	 *
	 * @return bool True when the quick edit action is executed.
	 */
	public function is_met() {
		if ( ! \ wp_doing_ajax() ) {
			return false;
		}

		if ( ! \wp_verify_nonce( 'inlineeditnonce', '_inline_edit' ) ) {
			return false;
		}

		if ( ! isset( $_POST['action'] ) ) {
			return false;
		}

		$sanitized_action = \sanitize_text_field( \wp_unslash( $_POST['action'] ) );

		return ( $sanitized_action === 'inline-save' );
	}
}
// phpcs:enable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Base class can't be written shorter without abbreviating.
