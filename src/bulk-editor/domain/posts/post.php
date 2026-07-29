<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Posts;

/**
 * This class describes a single content item shown in the bulk editor table.
 */
class Post {

	/**
	 * The post ID.
	 *
	 * @var int
	 */
	private $id;

	/**
	 * The post title.
	 *
	 * @var string
	 */
	private $title;

	/**
	 * The post status.
	 *
	 * @var string
	 */
	private $status;

	/**
	 * The URL to edit the post.
	 *
	 * @var string
	 */
	private $edit_link;

	/**
	 * The focus keyphrase.
	 *
	 * @var string
	 */
	private $focus_keyphrase;

	/**
	 * The SEO title.
	 *
	 * @var string
	 */
	private $seo_title;

	/**
	 * The meta description.
	 *
	 * @var string
	 */
	private $meta_description;

	/**
	 * The social title.
	 *
	 * @var string
	 */
	private $social_title;

	/**
	 * The social description.
	 *
	 * @var string
	 */
	private $social_description;

	/**
	 * Whether the current user may edit this post.
	 *
	 * @var bool
	 */
	private $editable;

	/**
	 * The constructor.
	 *
	 * @param int    $id                 The post ID.
	 * @param string $title              The post title.
	 * @param string $status             The post status.
	 * @param string $edit_link          The URL to edit the post.
	 * @param string $focus_keyphrase    The focus keyphrase.
	 * @param string $seo_title          The SEO title.
	 * @param string $meta_description   The meta description.
	 * @param string $social_title       The social title.
	 * @param string $social_description The social description.
	 * @param bool   $editable           Whether the current user may edit this post.
	 */
	public function __construct(
		int $id,
		string $title,
		string $status,
		string $edit_link,
		string $focus_keyphrase,
		string $seo_title,
		string $meta_description,
		string $social_title,
		string $social_description,
		bool $editable
	) {
		$this->id                 = $id;
		$this->title              = $title;
		$this->status             = $status;
		$this->edit_link          = $edit_link;
		$this->focus_keyphrase    = $focus_keyphrase;
		$this->seo_title          = $seo_title;
		$this->meta_description   = $meta_description;
		$this->social_title       = $social_title;
		$this->social_description = $social_description;
		$this->editable           = $editable;
	}

	/**
	 * Parses the post to the expected key value representation.
	 *
	 * @return array<string, int|string|bool> The post presented as the expected key value representation.
	 */
	public function to_array(): array {
		return [
			'id'                 => $this->id,
			'title'              => $this->title,
			'status'             => $this->status,
			'edit_link'          => $this->edit_link,
			'focus_keyphrase'    => $this->focus_keyphrase,
			'seo_title'          => $this->seo_title,
			'meta_description'   => $this->meta_description,
			'social_title'       => $this->social_title,
			'social_description' => $this->social_description,
			'editable'           => $this->editable,
		];
	}
}
