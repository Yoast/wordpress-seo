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
	 * The numeric score (0-100).
	 *
	 * @var int
	 */
	private $score;

	/**
	 * The rank slug (na, bad, ok, good, noindex).
	 *
	 * @var string
	 */
	private $rating;

	/**
	 * The translated human-readable label.
	 *
	 * @var string
	 */
	private $label;

	/**
	 * The focus keyphrase (only for SEO score, null otherwise).
	 *
	 * @var string|null
	 */
	private $focus_keyphrase;

	/**
	 * Constructor.
	 *
	 * @param string      $title           The post title.
	 * @param int         $score           The numeric score (0-100).
	 * @param string      $rating          The rank slug.
	 * @param string      $label           The translated human-readable label.
	 * @param string|null $focus_keyphrase The focus keyphrase, or null.
	 */
	public function __construct( string $title, int $score, string $rating, string $label, ?string $focus_keyphrase = null ) {
		$this->title           = $title;
		$this->score           = $score;
		$this->rating          = $rating;
		$this->label           = $label;
		$this->focus_keyphrase = $focus_keyphrase;
	}

	/**
	 * Returns the focus keyphrase.
	 *
	 * @return string|null The focus keyphrase, or null.
	 */
	public function get_focus_keyphrase(): ?string {
		return $this->focus_keyphrase;
	}

	/**
	 * Serializes the score result to an array for ability output.
	 *
	 * @return array<string, int|string> The serialized score result.
	 */
	public function to_array(): array {
		return [
			'title'  => $this->title,
			'score'  => $this->score,
			'rating' => $this->rating,
			'label'  => $this->label,
		];
	}
}
