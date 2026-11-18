<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Generator\Domain;

use WP_User;

/**
 * Parameters for a suggestions request.
 */
class Suggestions_Parameters {

	/**
	 * The user the request is on behalf of.
	 *
	 * @var WP_User
	 */
	private $user;

	/**
	 * The suggestion type that is interpolated into the action path.
	 *
	 * @var string
	 */
	private $suggestion_type;

	/**
	 * The prompt content excerpt taken from the post.
	 *
	 * @var string
	 */
	private $prompt_content;

	/**
	 * The focus keyphrase associated with the post.
	 *
	 * @var string
	 */
	private $focus_keyphrase;

	/**
	 * The language of the post.
	 *
	 * @var string
	 */
	private $language;

	/**
	 * The platform the post is intended for.
	 *
	 * @var string
	 */
	private $platform;

	/**
	 * The editor identifier sent as the X-Yst-Cohort header.
	 *
	 * @var string
	 */
	private $editor;

	/**
	 * The constructor.
	 *
	 * @param WP_User $user            The user.
	 * @param string  $suggestion_type The suggestion type.
	 * @param string  $prompt_content  The prompt content excerpt.
	 * @param string  $focus_keyphrase The focus keyphrase.
	 * @param string  $language        The language of the post.
	 * @param string  $platform        The platform.
	 * @param string  $editor          The editor identifier.
	 */
	public function __construct(
		WP_User $user,
		string $suggestion_type,
		string $prompt_content,
		string $focus_keyphrase,
		string $language,
		string $platform,
		string $editor
	) {
		$this->user            = $user;
		$this->suggestion_type = $suggestion_type;
		$this->prompt_content  = $prompt_content;
		$this->focus_keyphrase = $focus_keyphrase;
		$this->language        = $language;
		$this->platform        = $platform;
		$this->editor          = $editor;
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
	 * Returns the suggestion type.
	 *
	 * @return string The suggestion type.
	 */
	public function get_suggestion_type(): string {
		return $this->suggestion_type;
	}

	/**
	 * Returns the prompt content excerpt.
	 *
	 * @return string The prompt content.
	 */
	public function get_prompt_content(): string {
		return $this->prompt_content;
	}

	/**
	 * Returns the focus keyphrase.
	 *
	 * @return string The focus keyphrase.
	 */
	public function get_focus_keyphrase(): string {
		return $this->focus_keyphrase;
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
	 * Returns the platform.
	 *
	 * @return string The platform.
	 */
	public function get_platform(): string {
		return $this->platform;
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
