<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Components;

use InvalidArgumentException;

/**
 * Represents a score-based analyzer component for a task.
 */
class Score_Task_Analyzer implements Task_Analyzer_Interface {

	/**
	 * Allowed results.
	 *
	 * @var string[]
	 */
	private const ALLOWED_RESULTS = [
		'good',
		'ok',
		'bad',
	];

	/**
	 * The title of the analyzer (e.g. "SEO analysis").
	 *
	 * @var string
	 */
	private $title;

	/**
	 * The result of the analyzer.
	 *
	 * @var string
	 */
	private $result;

	/**
	 * The human-readable label for the result (e.g. "Needs improvement").
	 *
	 * @var string
	 */
	private $result_label;

	/**
	 * The description text explaining the result.
	 *
	 * @var string
	 */
	private $result_description;

	/**
	 * The constructor.
	 *
	 * @param string $title              The title of the analyzer.
	 * @param string $result             The result.
	 * @param string $result_label       The human-readable label for the result.
	 * @param string $result_description The description text explaining the result.
	 *
	 * @throws InvalidArgumentException If the result is invalid.
	 */
	public function __construct(
		string $title,
		string $result,
		string $result_label,
		string $result_description
	) {
		if ( ! \in_array( $result, self::ALLOWED_RESULTS, true ) ) {
			throw new InvalidArgumentException( 'Invalid result for score task analyzer' );
		}

		$this->title              = $title;
		$this->result             = $result;
		$this->result_label       = $result_label;
		$this->result_description = $result_description;
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
	 * @TODO: Add an abstract task analyzer class and move this logic there.
	 *
	 * @return array<string, string> Returns in an array format.
	 */
	public function to_array(): array {
		return [
			'type'              => $this->get_type(),
			'title'             => $this->title,
			'result'            => $this->result,
			'resultLabel'       => $this->result_label,
			'resultDescription' => $this->result_description,
		];
	}
}
