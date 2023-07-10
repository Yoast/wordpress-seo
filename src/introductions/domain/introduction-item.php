<?php

namespace Yoast\WP\SEO\Introductions\Domain;

/**
 * Domain object that holds introduction information.
 */
class Introduction_Item {

	/**
	 * The unique name.
	 *
	 * @var string
	 */
	private $name;

	/**
	 * The priority.
	 *
	 * @var int
	 */
	private $priority;

	/**
	 * The can override.
	 *
	 * @var bool
	 */
	private $can_override;

	/**
	 * Constructs the instance.
	 *
	 * @param string $name         The unique name.
	 * @param int    $priority     The priority.
	 * @param bool   $can_override The can override.
	 */
	public function __construct( $name, $priority, $can_override ) {
		$this->name         = $name;
		$this->priority     = $priority;
		$this->can_override = $can_override;
	}

	/**
	 * Returns an array representation of the data.
	 *
	 * @return array Returns in an array format.
	 */
	public function to_array() {
		return [
			'name'         => $this->get_name(),
			'priority'     => $this->get_priority(),
			'can_override' => $this->get_can_override(),
		];
	}

	/**
	 * Returns the unique name.
	 *
	 * @return string
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * Returns the requested pagination priority. Higher means earlier.
	 *
	 * @return int
	 */
	public function get_priority() {
		return $this->priority;
	}

	/**
	 * Returns can override (in another plugin).
	 *
	 * @return bool
	 */
	public function get_can_override() {
		return $this->can_override;
	}
}
