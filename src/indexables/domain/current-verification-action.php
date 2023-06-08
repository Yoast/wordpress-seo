<?php

namespace Yoast\WP\SEO\Indexables\Domain;

class Current_Verification_Action {

	/**
	 * @var string $action
	 */
	private $action;

	/**
	 * @param string $action
	 */
	public function __construct( string $action ) {
		$this->action = $action;
	}

	/**
	 * @return string
	 */
	public function get_action(): string {
		return $this->action;
	}
}
