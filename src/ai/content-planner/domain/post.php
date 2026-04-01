<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\Domain;

/**
 * Value object for a Post.
 */
class Post {

	/**
	 * @var string The title.
	 */
	private string $title;

	/**
	 * @var string The description.
	 */
	private string $description;

	/**
	 * @var Category The category.
	 */
	private Category $category;

	/**
	 * @var string The primary focus keyword.
	 */
	private string $primary_focus_keyword;

	/**
	 * @var bool Whether the post is cornerstone content.
	 */
	private bool $is_cornerstone;

	/**
	 * @var string The last modified date.
	 */
	private string $last_modified;

	/**
	 * @var string The schema article type.
	 */
	private string $schema_article_type;

	/**
	 * The constructor.
	 *
	 * @param string   $title                 The title.
	 * @param string   $description           The description.
	 * @param Category $category              The category.
	 * @param string   $primary_focus_keyword The primary focus keyword.
	 * @param bool     $is_cornerstone        Whether the post is cornerstone content.
	 * @param string   $last_modified         The last modified date.
	 * @param string   $schema_article_type   The schema article type.
	 */
	public function __construct(
		string $title,
		string $description,
		Category $category,
		string $primary_focus_keyword,
		bool $is_cornerstone,
		string $last_modified,
		string $schema_article_type
	) {
		$this->title                 = $title;
		$this->description           = $description;
		$this->category              = $category;
		$this->primary_focus_keyword = $primary_focus_keyword;
		$this->is_cornerstone        = $is_cornerstone;
		$this->last_modified         = $last_modified;
		$this->schema_article_type   = $schema_article_type;
	}

	/**
	 * Returns this object in array format.
	 *
	 * @return array<string, string|bool|array<string, int>> The post as an array.
	 */
	public function to_array(): array {
		return [
			'title'                 => $this->title,
			'description'           => $this->description,
			'category'              => $this->category->to_array(),
			'primary_focus_keyword' => $this->primary_focus_keyword,
			'is_cornerstone'        => $this->is_cornerstone,
			'last_modified'         => $this->last_modified,
			'schema_article_type'   => $this->schema_article_type,
		];
	}
}
