<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Updates;

/**
 * This class describes a title and/or description update for a single post.
 */
class Post_Update {

	/**
	 * The ID of the post to update.
	 *
	 * @var int
	 */
	private $post_id;

	/**
	 * The new title, or null when the title should be left untouched.
	 *
	 * @var string|null
	 */
	private $title;

	/**
	 * The new description, or null when the description should be left untouched.
	 *
	 * @var string|null
	 */
	private $description;

	/**
	 * The constructor.
	 *
	 * @param int         $post_id     The ID of the post to update.
	 * @param string|null $title       The new title, or null to leave the title untouched.
	 * @param string|null $description The new description, or null to leave the description untouched.
	 */
	public function __construct( int $post_id, ?string $title, ?string $description ) {
		$this->post_id     = $post_id;
		$this->title       = $title;
		$this->description = $description;
	}

	/**
	 * Gets the ID of the post to update.
	 *
	 * @return int The ID of the post to update.
	 */
	public function get_post_id(): int {
		return $this->post_id;
	}

	/**
	 * Gets the new title.
	 *
	 * @return string|null The new title, or null when the title should be left untouched.
	 */
	public function get_title(): ?string {
		return $this->title;
	}

	/**
	 * Gets the new description.
	 *
	 * @return string|null The new description, or null when the description should be left untouched.
	 */
	public function get_description(): ?string {
		return $this->description;
	}

	/**
	 * Whether this update carries a title. An empty string is a value: it clears the title.
	 *
	 * @return bool Whether this update carries a title.
	 */
	public function has_title(): bool {
		return $this->title !== null;
	}

	/**
	 * Whether this update carries a description. An empty string is a value: it clears the description.
	 *
	 * @return bool Whether this update carries a description.
	 */
	public function has_description(): bool {
		return $this->description !== null;
	}
}
