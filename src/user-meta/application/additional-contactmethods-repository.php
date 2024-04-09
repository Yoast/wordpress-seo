<?php

namespace Yoast\WP\SEO\User_Meta\Application;

use Yoast\WP\SEO\User_Meta\Domain\Additional_Contactmethod_Interface;

/**
 * The repository to get additional contactmethods.
 *
 * @makePublic
 */
class Additional_Contactmethods_Repository {

	/**
	 * All additional contactmethods.
	 *
	 * @var array<Additional_Contactmethod_Interface> $additional_contactmethods
	 */
	private $additional_contactmethods;

	/**
	 * The constructor.
	 *
	 * @param Additional_Contactmethod_Interface ...$additional_contactmethods All additional contactmethods.
	 */
	public function __construct( Additional_Contactmethod_Interface ...$additional_contactmethods ) {
		$this->additional_contactmethods = $additional_contactmethods;
	}

	/**
	 * Returns the additional contactmethods key/value pairs.
	 *
	 * @return array<string, string> The additional contactmethods key/value pairs.
	 */
	public function get_additional_contactmethods(): array {
		$additional_contactmethods = [];
		foreach ( $this->additional_contactmethods as $additional_contactmethod ) {
			$additional_contactmethods[ $additional_contactmethod->get_key() ] = $additional_contactmethod->get_label();
		}

		return $additional_contactmethods;
	}

	/**
	 * Returns the additional contactmethods keys.
	 *
	 * @return array<string> The additional contactmethods.
	 */
	public function get_additional_contactmethods_keys(): array {
		$additional_contactmethods_keys = [];
		foreach ( $this->additional_contactmethods as $additional_contactmethod ) {
			$additional_contactmethods_keys[] = $additional_contactmethod->get_key();
		}

		return $additional_contactmethods_keys;
	}
}
