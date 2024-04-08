<?php

namespace Yoast\WP\SEO\User_Meta\Application;

use Yoast\WP\SEO\User_Meta\Domain\Custom_Meta_Interface;

/**
 * The repository to get custom user meta.
 *
 * @makePublic
 */
class Custom_Meta_Repository {

	/**
	 * All custom meta.
	 *
	 * @var array<Custom_Meta_Interface> $custom_meta
	 */
	private $custom_meta;

	/**
	 * The constructor.
	 *
	 * @param Custom_Meta_Interface ...$custom_meta All custom meta.
	 */
	public function __construct( Custom_Meta_Interface ...$custom_meta ) {
		$this->custom_meta = $custom_meta;
	}

	/**
	 * Returns all the custom meta.
	 *
	 * @return array<Custom_Meta_Interface> All the custom meta.
	 */
	public function get_custom_meta(): array {
		return $this->custom_meta;
	}
}
