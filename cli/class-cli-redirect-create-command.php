<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\CLI
 */

/**
 * Implementation of the 'redirect create' WP-CLI command.
 */
final class WPSEO_CLI_Redirect_Create_Command extends WPSEO_CLI_Redirect_Base_Command {

	/**
	 * Creates a new Yoast SEO redirect.
	 *
	 * ## OPTIONS
	 *
	 * <origin>
	 * : Origin of the redirect.
	 *
	 * <target>
	 * : Target of the redirect.
	 *
	 * [--type=<type>]
	 * : Type of the redirect.
	 * ---
	 * default: 301
	 * options:
	 *  - 301
	 *  - 302
	 *  - 307
	 *  - 410
	 *  - 451
	 * ---
	 *
	 * [--format=<format>]
	 * : Format of the redirect.
	 * ---
	 * default: plain
	 * options:
	 *  - plain
	 *  - regex
	 * ---
	 *
	 * [--force]
	 * : Force creation of the redirect, so an existing redirect will be overwritten.
	 * ---
	 * default: false
	 * ---
	 */
	public function __invoke( $args, $assoc_args ) {
		list( $origin, $target ) = $args;

		$type   = (int) WP_CLI\Utils\get_flag_value( $assoc_args, 'type', '301' );
		$format = WP_CLI\Utils\get_flag_value( $assoc_args, 'format', 'plain' );
		$force  = WP_CLI\Utils\get_flag_value( $assoc_args, 'force', false );

		if ( $this->has_redirect( $origin ) ) {
			if ( ! $force ) {
				WP_CLI::error( "Redirect already exists for '{$origin}'." );
			}
			$success = $this->update_redirect( $origin, $target, $type, $format );
		} else {
			$success = $this->create_redirect( $origin, $target, $type, $format );
		}

		if ( ! $success ) {
			WP_CLI::error( "Could not create redirect: '{$origin}' => '{$target}'." );
		}

		WP_CLI::success( "Redirect created: '{$origin}' => '{$target}'." );
	}
}
