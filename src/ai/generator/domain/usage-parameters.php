<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Generator\Domain;

use WP_User;

/**
 * Parameters for a usage request.
 */
class Usage_Parameters {

	/**
	 * The user the request is on behalf of.
	 *
	 * @var WP_User
	 */
	private $user;

	/**
	 * Whether usage should be read from the time-unbound free-usage bucket rather than a period.
	 *
	 * @var bool
	 */
	private $is_free;

	/**
	 * The usage period (e.g. `2026-06`) the request applies to when it is not a free-usage request.
	 *
	 * @var string
	 */
	private $period;

	/**
	 * The constructor.
	 *
	 * @param WP_User $user    The user.
	 * @param bool    $is_free Whether to read the free-usage bucket instead of a period.
	 * @param string  $period  The usage period (e.g. `2026-06`); ignored for free-usage requests.
	 */
	public function __construct( WP_User $user, bool $is_free, string $period ) {
		$this->user    = $user;
		$this->is_free = $is_free;
		$this->period  = $period;
	}

	/**
	 * Returns the user.
	 *
	 * @return WP_User The user.
	 */
	public function get_user(): WP_User {
		return $this->user;
	}

	/**
	 * Returns whether usage should be read from the free-usage bucket.
	 *
	 * @return bool True when the request targets the free-usage bucket.
	 */
	public function is_free(): bool {
		return $this->is_free;
	}

	/**
	 * Returns the usage period the request applies to.
	 *
	 * @return string The usage period (e.g. `2026-06`).
	 */
	public function get_period(): string {
		return $this->period;
	}
}
