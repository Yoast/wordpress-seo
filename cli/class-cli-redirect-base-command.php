<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\CLI
 */

/**
 * Base class for the redirect commands.
 */
class WPSEO_CLI_Redirect_Base_Command extends WP_CLI_Command {

	/**
	 * Redirect Manager instance to use.
	 *
	 * @var WPSEO_Redirect_Manager
	 */
	protected $redirect_manager;

	/**
	 * Instantiates a WPSEO_CLI_Redirect_Create_Command object.
	 */
	public function __construct() {
		// This could potentially have the Redirect Manager injected.
		$this->redirect_manager = new WPSEO_Redirect_Manager();
	}

	/**
	 * Creates a new redirect.
	 *
	 * @param string $origin Origin of the redirect.
	 * @param string $target Target of the redirect.
	 * @param string $type   Type of the redirect.
	 * @param string $format Format of the redirect.
	 *
	 * @return bool Whether creation was successful.
	 */
	protected function create_redirect( $origin, $target, $type, $format ) {
		$redirect = new WPSEO_Redirect( $origin, $target, $type, $format );

		return $this->redirect_manager->create_redirect( $redirect );
	}

	/**
	 * Updates an existing redirect.
	 *
	 * @param string $old_origin Origin of the redirect.
	 * @param string $new_origin Origin of the redirect.
	 * @param string $target     Target of the redirect.
	 * @param string $type       Type of the redirect.
	 * @param string $format     Format of the redirect.
	 *
	 * @return bool Whether updating was successful.
	 */
	protected function update_redirect( $old_origin, $new_origin, $target, $type, $format ) {
		$old_redirect = new WPSEO_Redirect( $old_origin );
		$new_redirect = new WPSEO_Redirect( $new_origin, $target, $type, $format );

		return $this->redirect_manager->update_redirect( $old_redirect, $new_redirect );
	}

	/**
	 * Deletes an existing redirect.
	 *
	 * @param string $origin Origin of the redirect.
	 *
	 * @return bool Whether deletion was successful.
	 */
	protected function delete_redirect( $origin ) {
		$redirect = new WPSEO_Redirect( $origin );

		return $this->redirect_manager->delete_redirects( array( $redirect ) );
	}

	/**
	 * Gets the redirect for a given origin.
	 *
	 * @param string $origin Origin to check for.
	 *
	 * @return WPSEO_Redirect|false Redirect value object, or false if not found.
	 */
	protected function get_redirect( $origin ) {
		return $this->redirect_manager->get_redirect( $origin );
	}

	/**
	 * Checks whether a redirect for a given origin already exists.
	 *
	 * @param string $origin Origin to check for.
	 *
	 * @return bool Whether a redirect for the given origin was found.
	 */
	protected function has_redirect( $origin ) {
		return $this->get_redirect( $origin ) !== false;
	}

	/**
	 * Checks whether a given redirect is valid.
	 *
	 * @param string      $new_origin New origin of the redirect.
	 * @param string      $target     Target of the redirect.
	 * @param int         $type       Type of the redirect.
	 * @param string      $format     Format of the redirect.
	 * @param string|null $old_origin Optional. Old origin of the redirect to update.
	 *
	 * @return void
	 */
	protected function validate( $new_origin, $target, $type, $format, $old_origin = null ) {
		$new_redirect = new WPSEO_Redirect( $new_origin, $target, $type, $format );

		$old_redirect = null;

		if ( $old_origin !== null ) {
			$old_redirect = $this->get_redirect( $old_origin );
		}

		$validator = new WPSEO_Redirect_Validator();

		if ( $validator->validate( $new_redirect, $old_redirect ) === true ) {
			return;
		}

		$error = $validator->get_error();

		$message = sprintf(
			'Failed to validate redirect \'%s\' => \'%s\': %s',
			$new_redirect->get_origin(),
			$new_redirect->get_target(),
			$this->reformat_error( $error->get_message() )
		);

		if ( $error->get_type() === 'warning' ) {
			WP_CLI::warning( $message );
		}

		if ( $error->get_type() === 'error' ) {
			WP_CLI::error( $message );
		}
	}

	/**
	 * Reformats error messages by removing excessive whitespace.
	 *
	 * @param string $message Error message to reformat.
	 *
	 * @return string Reformatted error message.
	 */
	protected function reformat_error( $message ) {
		$message = preg_replace( '/\s+/', ' ', $message );
		return trim( $message );
	}
}
