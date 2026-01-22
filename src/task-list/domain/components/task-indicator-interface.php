<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Components;

/**
 * Interface for task indicators.
 * Indicators are visual elements that provide additional context about a task,
 * such as a color-coded status or a numeric value.
 */
interface Task_Indicator_Interface {

	/**
	 * Returns the type of the indicator.
	 * This allows the frontend to render the appropriate component.
	 *
	 * @return string The indicator type (e.g., 'color', 'numeric').
	 */
	public function get_type(): string;

	/**
	 * Returns the value of the indicator.
	 *
	 * @return mixed The indicator value.
	 */
	public function get_value();

	/**
	 * Returns the indicator as an array for JSON serialization.
	 *
	 * @return array<string, mixed> The indicator data.
	 */
	public function to_array(): array;
}
