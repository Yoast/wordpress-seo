<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Components;

/**
 * Color-based task indicator.
 * Used for displaying a colored bullet/badge (e.g., red/yellow/green for SEO scores).
 */
class Color_Task_Indicator implements Task_Indicator_Interface {

	public const COLOR_RED    = 'red';
	public const COLOR_YELLOW = 'yellow';
	public const COLOR_GREEN  = 'green';

	/**
	 * The color value.
	 *
	 * @var string
	 */
	private $color;

	/**
	 * Optional label for accessibility.
	 *
	 * @var string|null
	 */
	private $label;

	/**
	 * Constructs the color indicator.
	 *
	 * @param string      $color The color (use class constants).
	 * @param string|null $label Optional accessibility label.
	 */
	public function __construct( string $color, ?string $label = null ) {
		$this->color = $color;
		$this->label = $label;
	}

	/**
	 * Returns the type of the indicator.
	 *
	 * @return string
	 */
	public function get_type(): string {
		return 'color';
	}

	/**
	 * Returns the color value.
	 *
	 * @return string
	 */
	public function get_value(): string {
		return $this->color;
	}

	/**
	 * Returns the accessibility label.
	 *
	 * @return string|null
	 */
	public function get_label(): ?string {
		return $this->label;
	}

	/**
	 * Returns the indicator as an array for JSON serialization.
	 *
	 * @return array<string, string|null>
	 */
	public function to_array(): array {
		return [
			'type'  => $this->get_type(),
			'value' => $this->color,
			'label' => $this->label,
		];
	}
}
