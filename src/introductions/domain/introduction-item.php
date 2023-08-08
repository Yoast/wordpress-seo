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
	 * Constructs the instance.
	 *
	 * @param string $name     The unique name.
	 * @param int    $priority The priority.
	 */
	public function __construct( $name, $priority ) {
		$this->name     = $name;
		$this->priority = $priority;
	}

	/**
	 * Returns an array representation of the data.
	 *
	 * @return array Returns in an array format.
	 */
	public function to_array() {
		return [
			'name'     => $this->get_name(),
			'priority' => $this->get_priority(),
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
}
