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
	 */
	public function __invoke( $args, $assoc_args ) {
		list( $origin ) = $args;
		$trace = (bool) WP_CLI\Utils\get_flag_value( $assoc_args, 'trace', false );
		$limit = (int) WP_CLI\Utils\get_flag_value( $assoc_args, 'limit', '0' );

		$redirect = $this->get_redirect( $origin );

		if ( false === $redirect ) {
			WP_CLI::error( "Redirect does not exist for '{$origin}'." );
		}

		$stack = $this->get_stack( $redirect, $limit );

		foreach ( $trace ? $stack : (array) array_pop( $stack ) as $target ) {
			WP_CLI::line( $target );
		}

		if ( $this->detected_loop ) {
			WP_CLI::error( "Detected redirect loop for redirect: '{$origin}'." );
		}
	}

	/**
	 * Get the stack of redirect targets for a given starting redirect.
	 *
	 * @param WPSEO_Redirect $redirect Redirect to get the stack for.
	 * @param int            $limit    Number of steps to limit the stack to.
	 *
	 * @return array Array of target URL steps.
	 */
	public function get_stack( WPSEO_Redirect $redirect, $limit ) {
		$steps = 0;
		$stack = array();

		while ( false !== $redirect ) {
			$steps++;
			if ( $limit > 0 && $steps >= $limit ) {
				break;
			}

			$target = $redirect->get_target();

			if ( array_key_exists( $target, $stack ) ) {
				$this->detected_loop = true;
				break;
			}

			$stack[ $target ] = true;

			$target_redirect = $this->get_redirect( $target );

			if ( false === $target_redirect ) {
				break;
			}

			$redirect = $target_redirect;
		}

		return array_keys( $stack );
	}
}
