<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\Application;

use WP_User;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;

/**
 * Command for requesting a content outline.
 */
class Content_Outline_Command {

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
	 * The title.
	 *
	 * @var string
	 */
	private $title;

	/**
	 * The intent.
	 *
	 * @var string
	 */
	private $intent;

	/**
	 * The explanation.
	 *
	 * @var string
	 */
	private $explanation;

	/**
	 * The keyphrase.
	 *
	 * @var string
	 */
	private $keyphrase;

	/**
	 * The meta description.
	 *
	 * @var string
	 */
	private $meta_description;

	/**
	 * The category.
	 *
	 * @var Category
	 */
	private $category;

	/**
	 * The constructor.
	 *
	 * @param WP_User $user             The user.
	 * @param string  $post_type        The post type.
	 * @param string  $language         The language.
	 * @param string  $editor           The editor.
	 * @param string  $title            The title.
	 * @param string  $intent           The intent.
	 * @param string  $explanation      The explanation.
	 * @param string  $keyphrase        The keyphrase.
	 * @param string  $meta_description The meta description.
	 * @param string  $category_name    The category name.
	 * @param int     $category_id      The category ID.
	 */
	public function __construct(
		WP_User $user,
		string $post_type,
		string $language,
		string $editor,
		string $title,
		string $intent,
		string $explanation,
		string $keyphrase,
		string $meta_description,
		string $category_name,
		int $category_id
	) {
		$this->user             = $user;
		$this->post_type        = $post_type;
		$this->language         = $language;
		$this->editor           = $editor;
		$this->title            = $title;
		$this->intent           = $intent;
		$this->explanation      = $explanation;
		$this->keyphrase        = $keyphrase;
		$this->meta_description = $meta_description;
		$this->category         = new Category( $category_name, $category_id );
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

	/**
	 * Returns the title.
	 *
	 * @return string The title.
	 */
	public function get_title(): string {
		return $this->title;
	}

	/**
	 * Returns the intent.
	 *
	 * @return string The intent.
	 */
	public function get_intent(): string {
		return $this->intent;
	}

	/**
	 * Returns the explanation.
	 *
	 * @return string The explanation.
	 */
	public function get_explanation(): string {
		return $this->explanation;
	}

	/**
	 * Returns the keyphrase.
	 *
	 * @return string The keyphrase.
	 */
	public function get_keyphrase(): string {
		return $this->keyphrase;
	}

	/**
	 * Returns the meta description.
	 *
	 * @return string The meta description.
	 */
	public function get_meta_description(): string {
		return $this->meta_description;
	}

	/**
	 * Returns the category.
	 *
	 * @return Category The category.
	 */
	public function get_category(): Category {
		return $this->category;
	}
}
