<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Introductions;

use Yoast\WP\SEO\Introductions\Domain\Introduction_Interface;

/**
 * Introduction for easy testing of different values.
 */
final class Introduction_Mock implements Introduction_Interface {

	/**
	 * Holds the ID.
	 *
	 * @var string
	 */
	private $id;

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
	public function __construct( $id, $priority, $should_show ) {
		$this->id          = $id;
		$this->priority    = $priority;
		$this->should_show = $should_show;
	}

	/**
	 * Returns the ID.
	 *
	 * @return string
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * Returns the unique name.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_name() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 21.6', 'Please use get_id() instead' );

		return $this->id;
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
