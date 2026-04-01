<?php

namespace Yoast\WP\SEO\AI\Content_Planner\Domain;

/**
 * Value object for a content suggestion.
 */
class Content_Suggestion {

	/**
	 * @var string The title.
	 */
	private string $title;

	/**
	 * @var string The intent.
	 */
	private string $intent;

	/**
	 * @var string The explanation.
	 */
	private string $explanation;

	/**
	 * @var string The keyphrase.
	 */
	private string $keyphrase;

	/**
	 * @var string The meta description.
	 */
	private string $meta_description;

	/**
	 * @var Category The category.
	 */
	private Category $category;

	/**
	 * The constructor.
	 *
	 * @param string   $title            The title.
	 * @param string   $intent           The intent.
	 * @param string   $explanation      The explanation.
	 * @param string   $keyphrase        The keyphrase.
	 * @param string   $meta_description The meta description.
	 * @param Category $category         The category.
	 */
	public function __construct(
		string $title,
		string $intent,
		string $explanation,
		string $keyphrase,
		string $meta_description,
		Category $category
	) {
		$this->title            = $title;
		$this->intent           = $intent;
		$this->explanation      = $explanation;
		$this->keyphrase        = $keyphrase;
		$this->meta_description = $meta_description;
		$this->category         = $category;
	}

	/**
	 * Returns this object in array format.
	 *
	 * @return array<string, string|array<string, int>> The content suggestion as an array.
	 */
	public function to_array(): array {
		return [
			'title'            => $this->title,
			'intent'           => $this->intent,
			'explanation'      => $this->explanation,
			'keyphrase'        => $this->keyphrase,
			'meta_description' => $this->meta_description,
			'category'         => $this->category->to_array(),
		];
	}
}
