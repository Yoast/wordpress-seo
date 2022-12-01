<?php

namespace Yoast\WP\SEO\Helpers\Schema;

use Yoast\WP\SEO\Generators\Schema\Person;

/**
 * Class Person_Helper.
 */
class Person_Helper {

	/**
	 * The Person schema generator.
	 *
	 * @var Person
	 */
	private $person;

	/**
	 * Image_Helper constructor.
	 *
	 * @codeCoverageIgnore It handles dependencies.
	 *
	 * @param Person $person The Person Schema generator.
	 */
	public function __construct( Person $person ) {
		$this->person = $person;
	}

	/**
	 * Build a Person Schema object.
	 *
	 * @param int    $user_id  The user ID to use.
	 * @param string $type     The Schema type, defaults to 'Person'.
	 *
	 * @return array A person Schema object.
	 */
	public function generate( $user_id, $type = 'Person' ) {
		return $this->person->build_object( $user_id, $type );
	}
}
