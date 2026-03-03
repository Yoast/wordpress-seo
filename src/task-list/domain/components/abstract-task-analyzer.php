<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Components;

/**
 * Abstract class for a task analyzer.
 */
abstract class Abstract_Task_Analyzer implements Task_Analyzer_Interface {

	/**
	 * The title of the analyzer (e.g. "SEO analysis").
	 *
	 * @var string
	 */
	protected $title;

	/**
	 * The result of the analyzer.
	 *
	 * @var string
	 */
	protected $result;

	/**
	 * The human-readable label for the result (e.g. "Needs improvement").
	 *
	 * @var string
	 */
	protected $result_label;

	/**
	 * The description text explaining the result.
	 *
	 * @var string
	 */
	protected $result_description;

	/**
	 * Returns an array representation of the analyzer data.
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
