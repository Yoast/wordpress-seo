<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is only met when on an Elementor edit page or when the current
 * request is an ajax request for saving our post meta data.
 */
class Elementor_Edit_Conditional implements Conditional {

	/**
	 * Returns whether this conditional is met.
	 *
	 * @return bool Whether the conditional is met.
	 */
	public function is_met() {
		global $pagenow;

		// Editing a post/page in Elementor.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
		if ( $pagenow === 'post.php' && isset( $_GET['action'] ) && \is_string( $_GET['action'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Reason: We are not processing form information, we are only strictly comparing.
			if ( \wp_unslash( $_GET['action'] ) === 'elementor' ) {
				return true;
			}
		}

		if ( ! \wp_doing_ajax() ) {
			return false;
		}

		$action = $this->get_post_action();
		switch ( $action ) {
			// Elementor editor AJAX request.
			case 'elementor_ajax':
				return $this->get_requested_document_id() > 0;
			// Request for us saving a post/page in Elementor (submits our form via AJAX).
			case 'wpseo_elementor_save':
				return true;
		}

		return false;
	}

	/**
	 * Retrieves the action from the POST request.
	 *
	 * @return string The action or an empty string if not found.
	 */
	private function get_post_action(): string {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- Reason: We are not processing form information.
		if ( isset( $_POST['action'] ) && \is_string( $_POST['action'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Reason: We are not processing form information, we are only strictly comparing.
			return (string) \wp_unslash( $_POST['action'] );
		}

		return '';
	}

	/**
	 * Retrieves the requested document ID from the POST request.
	 *
	 * @return int The requested document ID or 0 if not found.
	 */
	private function get_requested_document_id(): int {
		$invalid_id = 0;

		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- Reason: We are not processing form information.
		if ( ! ( isset( $_POST['actions'] ) && \is_string( $_POST['actions'] ) ) ) {
			return $invalid_id;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Reason: We are not processing form information, we are only strictly comparing.
		$actions = \json_decode( \wp_unslash( $_POST['actions'] ), true );
		if ( ! \is_array( $actions ) ) {
			return $invalid_id;
		}

		$key = \key( $actions );

		// There are multiple action types here. We need to be active when requesting a document config.
		if ( ! ( isset( $actions[ $key ]['action'] ) && $actions[ $key ]['action'] === 'get_document_config' ) ) {
			return $invalid_id;
		}

		if ( isset( $actions[ $key ]['data']['id'] ) && \is_numeric( $actions[ $key ]['data']['id'] ) ) {
			return (int) $actions[ $key ]['data']['id'];
		}

		return $invalid_id;
	}
}
