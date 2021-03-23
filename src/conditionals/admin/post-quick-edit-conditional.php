<?php

namespace Yoast\WP\SEO\Conditionals\Admin;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Class Post_Quick_Edit_Conditional
 */
class Post_Quick_Edit_Conditional implements Conditional {

	/**
	 * Checks if the current request is ajax and the action is inline-save.
	 *
	 * @return bool True when the quick edit action is executed.
	 */
	public function is_met() {
		if ( ! \ wp_doing_ajax() ) {
			return false;
		}

		if ( ! wp_verify_nonce( 'inlineeditnonce', '_inline_edit' ) ) {
			return false;
		}

		if ( ! isset( $_POST['action'] ) ) {
			return false;
		}

		$sanitized_action = \sanitize_text_field( \wp_unslash( $_POST['action'] ) );

		return ( $sanitized_action === 'inline-save' );
	}
}
