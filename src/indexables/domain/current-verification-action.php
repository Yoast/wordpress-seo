<?php

namespace Yoast\WP\SEO\Indexables\Domain;

/**
 * The Current_Verification_Action class.
 */
class Current_Verification_Action {

	/**
	 * The current action.
	 *
	 * @var string $action
	 */
	private $action;

	/**
	 * The constructor.
	 *
	 * @param string $action The current action.
	 */
	public function __construct( string $action ) {
		$this->action = $action;
	}

	/**
	 * Gets the current action.
	 *
	 * @return string
	 */
	public function get_action(): string {
		return $this->action;
	}
}
