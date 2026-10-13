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
	 * The raw stored SEO title (empty string when never explicitly saved).
	 *
	 * @var string
	 */
	private $seo_title;

	/**
	 * The raw stored meta description (empty string when never explicitly saved).
	 *
	 * @var string
	 */
	private $meta_description;

	/**
	 * The raw stored social title (empty string when never explicitly saved).
	 *
	 * @var string
	 */
	private $social_title;

	/**
	 * The raw stored social description (empty string when never explicitly saved).
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
	 * Whether each field needs improvement, keyed by field param (e.g. `seo_title`). Empty for a post whose
	 * fields are not editable.
	 *
	 * @var array<string, bool>
	 */
	private $needs_improvement;

	/**
	 * The post type's SEO title template, shown when the stored value is empty. Empty string when the stored value is set.
	 *
	 * @var string
	 */
	private $seo_title_fallback;

	/**
	 * The post type's meta description template, shown when the stored value is empty. Empty string when the stored value is set.
	 *
	 * @var string
	 */
	private $meta_description_fallback;

	/**
	 * The post type's social title template, shown when the stored value is empty. Empty string when the stored value is set.
	 *
	 * @var string
	 */
	private $social_title_fallback;

	/**
	 * The post type's social description template, shown when the stored value is empty. Empty string when the stored value is set.
	 *
	 * @var string
	 */
	private $social_description_fallback;

	/**
	 * The constructor.
	 *
	 * @param int                 $id                          The post ID.
	 * @param string              $title                       The post title.
	 * @param string              $status                      The post status.
	 * @param string              $edit_link                   The URL to edit the post.
	 * @param string              $focus_keyphrase             The focus keyphrase.
	 * @param string              $seo_title                   The raw stored SEO title.
	 * @param string              $meta_description            The raw stored meta description.
	 * @param string              $social_title                The raw stored social title.
	 * @param string              $social_description          The raw stored social description.
	 * @param bool                $editable                    Whether the current user may edit this post.
	 * @param array<string, bool> $needs_improvement           Whether each field needs improvement, keyed by field param.
	 * @param string              $seo_title_fallback          The post type's SEO title template (empty when stored value is set).
	 * @param string              $meta_description_fallback   The post type's meta description template (empty when stored value is set).
	 * @param string              $social_title_fallback       The post type's social title template (empty when stored value is set).
	 * @param string              $social_description_fallback The post type's social description template (empty when stored value is set).
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
		bool $editable,
		array $needs_improvement = [],
		string $seo_title_fallback = '',
		string $meta_description_fallback = '',
		string $social_title_fallback = '',
		string $social_description_fallback = ''
	) {
		$this->id                          = $id;
		$this->title                       = $title;
		$this->status                      = $status;
		$this->edit_link                   = $edit_link;
		$this->focus_keyphrase             = $focus_keyphrase;
		$this->seo_title                   = $seo_title;
		$this->meta_description            = $meta_description;
		$this->social_title                = $social_title;
		$this->social_description          = $social_description;
		$this->editable                    = $editable;
		$this->needs_improvement           = $needs_improvement;
		$this->seo_title_fallback          = $seo_title_fallback;
		$this->meta_description_fallback   = $meta_description_fallback;
		$this->social_title_fallback       = $social_title_fallback;
		$this->social_description_fallback = $social_description_fallback;
	}

	/**
	 * Parses the post to the expected key value representation.
	 *
	 * @return array<string, int|string|bool|array<string, bool>> The post presented as the expected key value representation.
	 */
	public function to_array(): array {
		return [
			'id'                          => $this->id,
			'title'                       => $this->title,
			'status'                      => $this->status,
			'edit_link'                   => $this->edit_link,
			'focus_keyphrase'             => $this->focus_keyphrase,
			'seo_title'                   => $this->seo_title,
			'meta_description'            => $this->meta_description,
			'social_title'                => $this->social_title,
			'social_description'          => $this->social_description,
			'seo_title_fallback'          => $this->seo_title_fallback,
			'meta_description_fallback'   => $this->meta_description_fallback,
			'social_title_fallback'       => $this->social_title_fallback,
			'social_description_fallback' => $this->social_description_fallback,
			'editable'                    => $this->editable,
			'needs_improvement'           => \array_merge(
				[
					'seo_title'          => false,
					'meta_description'   => false,
					'social_title'       => false,
					'social_description' => false,
				],
				$this->needs_improvement,
			),
		];
	}
}
