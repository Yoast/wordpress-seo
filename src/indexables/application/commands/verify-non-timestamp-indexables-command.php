<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Indexables\Application\Commands;

use Yoast\WP\SEO\Indexables\Domain\Abstract_Indexables_Command;
use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;

/**
 * The Verify_Non_Timestamp_Indexables_Command class.
 */
class Verify_Non_Timestamp_Indexables_Command extends Abstract_Indexables_Command {

	/**
	 * The current verification action in progress.
	 *
	 * @var Current_Verification_Action $current_action
	 */
	private $current_action;

	/**
	 * The constructor.
	 *
	 * @param int    $last_batch     The last batch count.
	 * @param int    $batch_size     The batch size.
	 * @param string $current_action The current verification action.
	 */
	public function __construct( int $last_batch, int $batch_size, string $current_action ) {
		$this->current_action = new Current_Verification_Action( $current_action );

		parent::__construct( $batch_size, $last_batch );
	}

	/**
	 * Gets the current action.
	 *
	 * @return Current_Verification_Action
	 */
	public function get_current_action(): Current_Verification_Action {
		return $this->current_action;
	}
}
