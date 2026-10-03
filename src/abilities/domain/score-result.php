<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Domain;

/**
 * Immutable value object representing a score result.
 */
class Score_Result {

	/**
	 * The post title.
	 *
	 * @var string
	 */
	private $title;

	/**
	 * The score slug (na, bad, ok, good).
	 *
	 * @var string
	 */
	private $score;

	/**
	 * The translated human-readable label.
	 *
	 * @var string
	 */
	private $label;

	/**
	 * Constructor.
	 *
	 * @param string $title The post title.
	 * @param string $score The score slug.
	 * @param string $label The translated human-readable label.
	 */
	public function __construct( string $title, string $score, string $label ) {
		$this->title = $title;
		$this->score = $score;
		$this->label = $label;
	}

	/**
	 * Serializes the score result to an array for ability output.
	 *
	 * @return array<string, string> The serialized score result.
	 */
	public function to_array(): array {
		return [
			'title' => $this->title,
			'score' => $this->score,
			'label' => $this->label,
		];
	}
}
