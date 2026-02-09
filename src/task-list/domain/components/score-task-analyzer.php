<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Components;

use InvalidArgumentException;

/**
 * Represents a score-based analyzer component for a task.
 */
class Score_Task_Analyzer implements Task_Analyzer_Interface {

	/**
	 * Allowed scores.
	 *
	 * @var string[]
	 */
	private const ALLOWED_SCORES = [
		'good',
		'ok',
		'bad',
	];

	/**
	 * The label of the analyzer (e.g. "SEO analysis").
	 *
	 * @var string
	 */
	private $label;

	/**
	 * The score of the analyzer.
	 *
	 * @var string
	 */
	private $score;

	/**
	 * The human-readable label for the score (e.g. "Needs improvement").
	 *
	 * @var string
	 */
	private $score_label;

	/**
	 * The details text explaining the score.
	 *
	 * @var string
	 */
	private $details;

	/**
	 * The constructor.
	 *
	 * @param string $label       The label of the analyzer.
	 * @param string $score       The score.
	 * @param string $score_label The human-readable label for the score.
	 * @param string $details     The details text explaining the score.
	 *
	 * @throws InvalidArgumentException If the score is invalid.
	 */
	public function __construct(
		string $label,
		string $score,
		string $score_label,
		string $details
	) {
		if ( ! \in_array( $score, self::ALLOWED_SCORES, true ) ) {
			throw new InvalidArgumentException( 'Invalid score for score task analyzer' );
		}

		$this->label       = $label;
		$this->score       = $score;
		$this->score_label = $score_label;
		$this->details     = $details;
	}

	/**
	 * Returns the type of the analyzer.
	 *
	 * @return string
	 */
	public function get_type(): string {
		return 'score';
	}

	/**
	 * Returns an array representation of the analyzer data.
	 *
	 * @return array<string, string> Returns in an array format.
	 */
	public function to_array(): array {
		return [
			'type'       => $this->get_type(),
			'label'      => $this->label,
			'score'      => $this->score,
			'scoreLabel' => $this->score_label,
			'details'    => $this->details,
		];
	}
}
