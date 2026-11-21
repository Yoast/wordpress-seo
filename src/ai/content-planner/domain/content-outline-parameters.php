<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\Domain;

use WP_User;

/**
 * Parameters for a content outline request.
 */
class Content_Outline_Parameters {

	/**
	 * The user the request is on behalf of.
	 *
	 * @var WP_User
	 */
	private $user;

	/**
	 * The language code.
	 *
	 * @var string
	 */
	private $language;

	/**
	 * The content payload: new_post_metadata, existing_posts, and optional about_page.
	 *
	 * @var array<string>
	 */
	private $content;

	/**
	 * The editor identifier sent as the X-Yst-Cohort header.
	 *
	 * @var string
	 */
	private $editor;

	/**
	 * The constructor.
	 *
	 * @param WP_User       $user     The user.
	 * @param string        $language The language code.
	 * @param array<string> $content  The content payload.
	 * @param string        $editor   The editor identifier.
	 */
	public function __construct( WP_User $user, string $language, array $content, string $editor ) {
		$this->user     = $user;
		$this->language = $language;
		$this->content  = $content;
		$this->editor   = $editor;
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
	 * Returns the language code.
	 *
	 * @return string The language code.
	 */
	public function get_language(): string {
		return $this->language;
	}

	/**
	 * Returns the content payload.
	 *
	 * @return array<string> The content payload.
	 */
	public function get_content(): array {
		return $this->content;
	}

	/**
	 * Returns the editor identifier.
	 *
	 * @return string The editor identifier.
	 */
	public function get_editor(): string {
		return $this->editor;
	}
}
