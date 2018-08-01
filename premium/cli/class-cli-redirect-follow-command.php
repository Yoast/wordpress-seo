<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\CLI
 */

/**
 * Implementation of the 'redirect follow' WP-CLI command.
 */
final class WPSEO_CLI_Redirect_Follow_Command extends WPSEO_CLI_Redirect_Base_Command {

	/**
	 * Whether a redirect loop was detected.
	 *
	 * @var bool
	 */
	private $detected_loop = false;

	/**
	 * Stack of traversed targets.
	 *
	 * @var array<string>
	 */
	private $stack = array();

	/**
	 * Follows a Yoast SEO redirect chain to get the final target it resolves to.
	 *
	 * ## OPTIONS
	 *
	 * <origin>
	 * : Origin of the redirect.
	 *
	 * [--trace]
	 * : Show a trace of all intermediary steps.
	 *
	 * [--limit=<limit>]
	 * : Limit the number of jumps to follow the redirect chain. '0' means unlimited.
	 * ---
	 * default: 0
	 * ---
	 *
	 * @param array $args Array of positional arguments.
	 * @param array $assoc_args Associative array of associative arguments.
	 *
	 * @return void
	 */
	public function __invoke( $args, $assoc_args ) {
		list( $origin ) = $args;
		$trace          = (bool) WP_CLI\Utils\get_flag_value( $assoc_args, 'trace', false );
		$limit          = (int) WP_CLI\Utils\get_flag_value( $assoc_args, 'limit', '0' );

		$redirect = $this->get_redirect( $origin );

		if ( $redirect === false ) {
			WP_CLI::error( "Redirect does not exist for '{$origin}'." );
		}

		$stack = $this->get_stack( $redirect, $limit );

		if ( ! $trace ) {
			$stack = (array) array_pop( $stack );
		}

		array_map( 'WP_CLI::line', $stack );

		if ( $this->detected_loop ) {
			WP_CLI::error( "Detected redirect loop for redirect: '{$origin}'." );
		}
	}

	/**
	 * Gets the stack of redirect targets for a given starting redirect.
	 *
	 * @param WPSEO_Redirect $redirect Redirect to get the stack for.
	 * @param int            $limit    Number of steps to limit the stack to.
	 *
	 * @return array Array of target URL steps.
	 */
	private function get_stack( WPSEO_Redirect $redirect, $limit ) {
		$steps = 0;

		while ( ! $this->detected_loop && $redirect !== false ) {
			$steps++;
			if ( $limit > 0 && $steps >= $limit ) {
				break;
			}

			$target = $redirect->get_target();

			$this->add_to_stack( $target );

			$redirect = $this->get_redirect( $target );
		}

		return array_keys( $this->stack );
	}

	/**
	 * Adds a new target to the stack.
	 *
	 * @param string $target Target to add to the stack.
	 *
	 * @return void
	 */
	private function add_to_stack( $target ) {
		if ( array_key_exists( $target, $this->stack ) ) {
			$this->detected_loop = true;

			return;
		}

		$this->stack[ $target ] = true;
	}
}
