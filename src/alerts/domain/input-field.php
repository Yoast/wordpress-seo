<?php

namespace Yoast\WP\SEO\Alerts\Domain;

/**
 * Class Input_Field
 *
 * Represents an input field for alerts.
 */
class Input_Field {

	/**
	 * The input field label.
	 *
	 * @var string
	 */
	private $label;

	/**
	 * The input field value.
	 *
	 * @var string
	 */
	private $value;

	/**
	 * The placeholder text.
	 *
	 * @var string
	 */
	private $placeholder;

	/**
	 * The button text.
	 *
	 * @var string
	 */
	private $button_text;

	/**
	 * The button icon
	 *
	 * @var string
	 */
	private $button_icon;

	/**
	 * The footer text.
	 *
	 * @var string
	 */
	private $footer_text;

	/**
	 * The constructor.
	 *
	 * @param string $label       The input field label.
	 * @param string $value       The input field value.
	 * @param string $placeholder The input field placeholder.
	 * @param string $button_text The input field button text.
	 * @param string $button_icon The input field button icon.
	 * @param string $footer_text The input field footer text.
	 */
	public function __construct( string $label, string $value, string $placeholder, string $button_text, string $button_icon, string $footer_text ) {
		$this->label       = $label;
		$this->value       = $value;
		$this->placeholder = $placeholder;
		$this->button_text = $button_text;
		$this->button_icon = $button_icon;
		$this->footer_text = $footer_text;
	}

	/**
	 * Returns the input field label.
	 *
	 * @return string
	 */
	public function get_label(): string {
		return $this->label;
	}

	/**
	 * Returns the input field value.
	 *
	 * @return string
	 */
	public function get_value(): string {
		return $this->value;
	}

	/**
	 * Returns the input field placeholder.
	 *
	 * @return string
	 */
	public function get_placeholder(): string {
		return $this->placeholder;
	}

	/**
	 * Returns the input field button text.
	 *
	 * @return string
	 */
	public function get_button_text(): string {
		return $this->button_text;
	}

	/**
	 * Returns the input field button icon.
	 *
	 * @return string
	 */
	public function get_button_icon(): string {
		return $this->button_icon;
	}

	/**
	 * Returns the input field footer text.
	 *
	 * @return string
	 */
	public function get_footer_text(): string {
		return $this->footer_text;
	}

	/**
	 * Parse the input field into an array.
	 *
	 * @return array<string, string>
	 */
	public function to_array(): array {
		return [
			'label'       => $this->label,
			'value'       => $this->value,
			'placeholder' => $this->placeholder,
			'button_text' => $this->button_text,
			'button_icon' => $this->button_icon,
			'footer_text' => $this->footer_text,
		];
	}
}
