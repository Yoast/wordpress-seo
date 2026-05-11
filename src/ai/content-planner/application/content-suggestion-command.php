<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\Application;

use WP_User;

/**
 * Command for requesting content suggestions.
 */
class Content_Suggestion_Command {

	/**
	 * The user.
	 *
	 * @var WP_User
	 */
	private $user;

	/**
	 * The post type.
	 *
	 * @var string
	 */
	private $post_type;

	/**
	 * The language.
	 *
	 * @var string
	 */
	private $language;

	/**
	 * The editor.
	 *
	 * @var string
	 */
	private $editor;

	/**
	 * The constructor.
	 *
	 * @param WP_User $user      The user.
	 * @param string  $post_type The post type.
	 * @param string  $language  The language.
	 * @param string  $editor    The editor.
	 */
	public function __construct( WP_User $user, string $post_type, string $language, string $editor ) {
		$this->user      = $user;
		$this->post_type = $post_type;
		$this->language  = $language;
		$this->editor    = $editor;
	}

	/**
	 * Returns the user.
	 *
	 * @return WP_User The user.
	 */
	public function get_user(): WP_User {
		return $this->user;
	}

	/**
	 * Returns the post type.
	 *
	 * @return string The post type.
	 */
	public function get_post_type(): string {
		return $this->post_type;
	}

	/**
	 * Returns the language.
	 *
	 * @return string The language.
	 */
	public function get_language(): string {
		return $this->language;
	}

	/**
	 * Returns the editor.
	 *
	 * @return string The editor.
	 */
	public function get_editor(): string {
		return $this->editor;
	}
}
