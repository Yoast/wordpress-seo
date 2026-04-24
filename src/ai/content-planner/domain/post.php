<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\Content_Planner\Domain;

/**
 * Value object for a Post.
 */
class Post {

	/**
	 * The title.
	 *
	 * @var string
	 */
	private $title;

	/**
	 * The description.
	 *
	 * @var string
	 */
	private $description;

	/**
	 * The category.
	 *
	 * @var Category|null
	 */
	private $category;

	/**
	 * The primary focus keyword.
	 *
	 * @var string
	 */
	private $primary_focus_keyword;

	/**
	 * Whether the post is cornerstone content.
	 *
	 * @var bool
	 */
	private $is_cornerstone;

	/**
	 * The last modified date.
	 *
	 * @var string
	 */
	private $last_modified;

	/**
	 * The schema article type.
	 *
	 * @var string
	 */
	private $schema_article_type;

	/**
	 * The constructor.
	 *
	 * @param string    $title                 The title.
	 * @param string    $description           The description.
	 * @param ?Category $category              The category, or null if the post has no category.
	 * @param string    $primary_focus_keyword The primary focus keyword.
	 * @param int       $is_cornerstone        Whether the post is cornerstone content.
	 * @param string    $last_modified         The last modified date.
	 * @param ?string   $schema_article_type   The schema article type.
	 */
	public function __construct(
		string $title,
		string $description,
		?Category $category,
		string $primary_focus_keyword,
		int $is_cornerstone,
		string $last_modified,
		?string $schema_article_type
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
		$data = [
			'title'                 => $this->title,
			'description'           => $this->description,
			'category'              => isset( $this->category ) ? $this->category->to_array() : null,
			'primary_focus_keyword' => $this->primary_focus_keyword,
			'is_cornerstone'        => $this->is_cornerstone,
			'last_modified'         => $this->last_modified,
		];
		if ( isset( $this->schema_article_type ) ) {
			$data['schema_article_type'] = $this->schema_article_type;
		}

		return $data;
	}
}
