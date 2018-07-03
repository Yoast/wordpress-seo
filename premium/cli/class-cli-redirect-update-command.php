<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\CLI
 */

/**
 * Implementation of the 'redirect create' WP-CLI command.
 */
final class WPSEO_CLI_Redirect_Update_Command extends WPSEO_CLI_Redirect_Base_Command {

	/**
	 * Updates an existing Yoast SEO redirect.
	 *
	 * ## OPTIONS
	 *
	 * <origin>
	 * : Origin of the redirect to update.
	 *
	 * <new-origin>
	 * : New origin of the redirect.
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
	 * : Force updating of the redirect, bypassing any validation.
	 * ---
	 * default: false
	 * ---
	 *
	 * @param array $args Array of positional arguments.
	 * @param array $assoc_args Associative array of associative arguments.
	 *
	 * @return void
	 */
	public function __invoke( $args, $assoc_args ) {
		list( $origin, $new_origin, $target ) = $args;

		$type   = (int) WP_CLI\Utils\get_flag_value( $assoc_args, 'type', '301' );
		$format = WP_CLI\Utils\get_flag_value( $assoc_args, 'format', 'plain' );
		$force  = WP_CLI\Utils\get_flag_value( $assoc_args, 'force', false );

		$exists = $this->has_redirect( $origin );

		if ( ! $exists && ! $force ) {
			WP_CLI::error( "Redirect does not exist for '{$origin}'." );
		}

		if ( ! $force ) {
			$this->validate( $new_origin, $target, $type, $format, $origin );
		}

		$success = $this->update_redirect( $origin, $new_origin, $target, $type, $format );

		if ( ! $success ) {
			WP_CLI::error( "Could not update redirect: '{$new_origin}' => '{$target}'." );
		}

		WP_CLI::success( "Redirect updated: '{$new_origin}' => '{$target}'." );
	}
}
