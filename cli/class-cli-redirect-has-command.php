<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\CLI
 */

/**
 * Implementation of the 'redirect has' WP-CLI command.
 */
final class WPSEO_CLI_Redirect_Has_Command extends WPSEO_CLI_Redirect_Base_Command {

	/**
	 * Checks whether a given Yoast SEO redirect exists.
	 *
	 * ## OPTIONS
	 *
	 * <origin>
	 * : Origin of the redirect.
	 */
	public function __invoke( $args, $assoc_args ) {
		list( $origin ) = $args;

		exit( $this->has_redirect( $origin ) ? 0 : 1 );
	}
}
