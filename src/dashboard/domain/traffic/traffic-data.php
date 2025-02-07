<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Traffic;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Interface;

/**
 * Domain object that represents a single Traffic record.
 */
class Traffic_Data implements Data_Interface {

	/**
	 * The sessions.
	 *
	 * @var int $sessions
	 */
	private $sessions;

	/**
	 * The users.
	 *
	 * @var int $users
	 */
	private $users;

	/**
	 * The constructor.
	 *
	 * @param int $sessions The sessions.
	 * @param int $users    The users.
	 */
	public function __construct( ?int $sessions = null, ?int $users = null ) {
		$this->sessions = $sessions;
		$this->users    = $users;
	}

	/**
	 * The array representation of this domain object.
	 *
	 * @return array<string|float|int|string[]>
	 */
	public function to_array(): array {
		$result = [];

		if ( $this->sessions !== null ) {
			$result['sessions'] = $this->sessions;
		}

		if ( $this->users !== null ) {
			$result['users'] = $this->users;
		}

		return $result;
	}

	/**
	 * Sets the sessions.
	 *
	 * @param int $sessions The sessions.
	 *
	 * @return void
	 */
	public function set_sessions( int $sessions ): void {
		$this->sessions = $sessions;
	}
}
