<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Introductions;

use Yoast\WP\SEO\Introductions\Domain\Introduction_Interface;

/**
 * Introduction for easy testing of different values.
 */
class Introduction_Mock implements Introduction_Interface {

	/**
	 * Holds the name.
	 *
	 * @var string
	 */
	private $name;

	/**
	 * Holds the priority.
	 *
	 * @var int
	 */
	private $priority;

	/**
	 * Holds whether to show.
	 *
	 * @var bool
	 */
	private $should_show;

	/**
	 * Constructs the introduction mock.
	 */
	public function __construct( $name, $priority, $should_show ) {
		$this->name        = $name;
		$this->priority    = $priority;
		$this->should_show = $should_show;
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
	 * Returns the requested pagination priority. Lower means earlier.
	 *
	 * @return int
	 */
	public function get_priority() {
		return $this->priority;
	}

	/**
	 * Returns whether this introduction should show.
	 *
	 * @return bool
	 */
	public function should_show() {
		return $this->should_show;
	}
}
