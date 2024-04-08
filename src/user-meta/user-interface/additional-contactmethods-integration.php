<?php

namespace Yoast\WP\SEO\User_Meta\User_Interface;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\User_Meta\Application\Additional_Contactmethods_Repository;

/**
 * Handles registering and saving additional contactmethods for users.
 */
class Additional_Contactmethods_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The additional contactmethods repository.
	 *
	 * @var Additional_Contactmethods_Repository $additional_contactmethods_repository The additional contactmethods repository.
	 */
	private $additional_contactmethods_repository;

	/**
	 * The constructor.
	 *
	 * @param Additional_Contactmethods_Repository $additional_contactmethods_repository The additional contactmethods repository.
	 */
	public function __construct( Additional_Contactmethods_Repository $additional_contactmethods_repository ) {
		$this->additional_contactmethods_repository = $additional_contactmethods_repository;
	}

	/**
	 * Registers action hook.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		\add_filter( 'user_contactmethods', [ $this, 'update_contactmethods' ] );
	}

	/**
	 * Updates the contactmethods with an additional set of social profiles.
	 *
	 * These are used with the Facebook author, rel="author", Twitter cards implementation, but also in the `sameAs` schema attributes.
	 *
	 * @param array<string, string> $contactmethods Currently set contactmethods.
	 *
	 * @return array<string, string> Contactmethods with added contactmethods.
	 */
	public function update_contactmethods( $contactmethods ) {
		$additional_contactmethods = $this->additional_contactmethods_repository->get_additional_contactmethods();

		return \array_merge( $contactmethods, $additional_contactmethods );
	}
}
