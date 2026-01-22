<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Components;

/**
 * Numeric task indicator.
 * Used for displaying a numeric value (e.g., link count, word count).
 * Possibly to be used in a task that eg. counts incoming links.
 */
class Numeric_Task_Indicator implements Task_Indicator_Interface {

	/**
	 * The numeric value.
	 *
	 * @var int
	 */
	private $value;

	/**
	 * The label describing what the number represents.
	 *
	 * @var string
	 */
	private $label;

	/**
	 * Optional suffix for the value (e.g., 'links', 'words').
	 *
	 * @var string|null
	 */
	private $suffix;

	/**
	 * Constructs the numeric indicator.
	 *
	 * @param int         $value  The numeric value.
	 * @param string      $label  The label describing the value.
	 * @param string|null $suffix Optional suffix for display.
	 */
	public function __construct( int $value, string $label, ?string $suffix = null ) {
		$this->value  = $value;
		$this->label  = $label;
		$this->suffix = $suffix;
	}

	/**
	 * Returns the type of the indicator.
	 *
	 * @return string
	 */
	public function get_type(): string {
		return 'numeric';
	}

	/**
	 * Returns the numeric value.
	 *
	 * @return int
	 */
	public function get_value(): int {
		return $this->value;
	}

	/**
	 * Returns the label.
	 *
	 * @return string
	 */
	public function get_label(): string {
		return $this->label;
	}

	/**
	 * Returns the suffix.
	 *
	 * @return string|null
	 */
	public function get_suffix(): ?string {
		return $this->suffix;
	}

	/**
	 * Returns the indicator as an array for JSON serialization.
	 *
	 * @return array<string, int|string|null>
	 */
	public function to_array(): array {
		return [
			'type'   => $this->get_type(),
			'value'  => $this->value,
			'label'  => $this->label,
			'suffix' => $this->suffix,
		];
	}
}
