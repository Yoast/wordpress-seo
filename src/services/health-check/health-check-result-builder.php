<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Health_Check_Result_Builder
 */
class Health_Check_Result_Builder {

	/**
	 * Passed health check.
	 */
	const STATUS_GOOD = "good";

	/**
	 * Changes are recommended but not necessary.
	 */
	const STATUS_RECOMMENDED = "recommended";

	/**
	 * Significant issues that the user should consider fixing.
	 */
	const STATUS_CRITICAL = "critical";
		
	/**
	 * The user-facing label.
	 *
	 * @var string
	 */
	private $label = "";
	
	/**
	 * The identifier that WordPress uses for the health check.
	 *
	 * @var string
	 */
	private $test_name = "";
	
	/**
	 * The test status (good, recommended, critical).
	 *
	 * @var string
	 */
	private $status = "";
	
	/**
	 * The short description for the result.
	 *
	 * @var string
	 */
	private $description = "";
	
	/**
	 * Actions that the user can take to solve the health check result.
	 *
	 * @var string
	 */
	private $actions = "";

	/**
	 * Sets the label for the health check that the user can see.
	 *
	 * @param  string $label The label that the user can see
	 * @return Health_Check_Result_Builder This builder
	 */
	public function set_label($label) {
		$this->label = $label;
		return $this;
	}

	/**
	 * Sets the name for the test that the plugin uses to identify the test.
	 *
	 * @param  string $test_name The identifier for the health check
	 * @return Health_Check_Result_Builder This builder
	 */
	public function set_test_name($test_name) {
		$this->test_name = $test_name;
		return $this;
	}

	/**
	 * Sets the status of the test result to GOOD (green label).
	 *
	 * @return Health_Check_Result_Builder This builder
	 */
	public function set_status_good() {
		$this->status = $this->STATUS_GOOD;
		return $this;
	}

	/**
	 * Sets the status of the test result to RECOMMENDED (orange label).
	 *
	 * @return Health_Check_Result_Builder This builder
	 */
	public function set_status_recommended() {
		$this->status = $this->STATUS_RECOMMENDED;
		return $this;
	}

	/**
	 * Sets the status of the test result to CRITICAL (red label).
	 *
	 * @return Health_Check_Result_Builder This builder
	 */
	public function set_status_critical() {
		$this->status = $this->STATUS_CRITICAL;
		return $this;
	}

	/**
	 * Sets a description for the test result. This will be the heading for the result in the user interface.
	 *
	 * @param  string $description The description for the test result
	 * @return Health_Check_Result_Builder This builder
	 */
	public function set_description($description) {
		return $this;
	}

	/**
	 * Sets a text that describes how the user can solve the failed health check.
	 *
	 * @param  string $actions The descriptive text
	 * @return Health_Check_Result_Builder This builder
	 */
	public function set_actions($actions) {
		return $this;
	}

	/**
	 * Builds an array of strings in the format that WordPress uses to display health checks (https://developer.wordpress.org/reference/hooks/site_status_test_result/).
	 *
	 * @return string[]
	 */
	public function build() {
		return [
			'label' => $this->label,
			'status' => $this->status,
			'badge' => $this->get_badge(),
			'description' => $this->description,
			'actions' => $this->actions,
			'test' => $this->test_name
		];
	}

	/**
	 * Generates a badge that the user can see.
	 *
	 * @return string
	 */
	private function get_badge() {
		return [
			'label' => $this->get_badge_label(),
			'color' => $this->get_badge_color()
		];
	}

	/**
	 * Generates the label for a badge.
	 *
	 * @return string
	 */
	private function get_badge_label() {
		__('SEO', 'wordpress-seo');
	}
	
	/**
	 * Generates the color for the badge using the current status.
	 *
	 * @return string
	 */
	private function get_badge_color() {
		if ($this->status === $this->STATUS_CRITICAL || $this->status === $this->STATUS_RECOMMENDED) {
			return "red";
		}

		return "blue";
	}
}