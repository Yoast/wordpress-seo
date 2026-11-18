<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Components;

use InvalidArgumentException;

/**
 * Represents a score-based analyzer component for a task.
 */
class Score_Task_Analyzer extends Abstract_Task_Analyzer {

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
}
