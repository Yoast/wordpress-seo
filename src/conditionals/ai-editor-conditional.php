<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;

/**
 * Conditional that is met when the AI editor integration should be active.
 */
class AI_Editor_Conditional implements Conditional {

	/**
	 * Holds the Post_Conditional.
	 *
	 * @var Post_Conditional
	 */
	private $post_conditional;

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Constructs Ai_Editor_Conditional.
	 *
	 * @param Post_Conditional    $post_conditional    The Post_Conditional.
	 * @param Current_Page_Helper $current_page_helper The Current_Page_Helper.
	 */
	public function __construct( Post_Conditional $post_conditional, Current_Page_Helper $current_page_helper ) {
		$this->post_conditional    = $post_conditional;
		$this->current_page_helper = $current_page_helper;
	}

	/**
	 * Returns `true` when the AI editor integration should be active.
	 *
	 * @return bool `true` when the AI editor integration should be active.
	 */
	public function is_met() {
		return $this->post_conditional->is_met() || $this->is_term() || $this->is_elementor_editor();
	}

	/**
	 * Returns `true` when the page is a term page.
	 *
	 * @return bool `true` when the page is a term page.
	 */
	private function is_term() {
		return $this->current_page_helper->get_current_admin_page() === 'term.php';
	}

	/**
	 * Returns `true` when the page is the Elementor editor.
	 *
	 * @return bool `true` when the page is the Elementor editor.
	 */
	private function is_elementor_editor() {
		if ( $this->current_page_helper->get_current_admin_page() !== 'post.php' ) {
			return false;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
		if ( isset( $_GET['action'] ) && \is_string( $_GET['action'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Reason: We are not processing form information, We are only strictly comparing.
			if ( \wp_unslash( $_GET['action'] ) === 'elementor' ) {
				return true;
			}
		}

		return false;
	}
}
