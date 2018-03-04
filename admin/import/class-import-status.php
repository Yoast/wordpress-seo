<?php
/**
 * @package WPSEO\Admin\Import
 */

/**
 * Class WPSEO_ImportStatus
 *
 * Holds the status of and message about imports.
 */
class WPSEO_Import_Status {
	/**
	 * The import status.
	 *
	 * @var bool
	 */
	public $status = false;

	/**
	 * The import message.
	 *
	 * @var string
	 */
	private $msg = '';

	/**
	 * The type of action performed.
	 *
	 * @var string
	 */
	private $action;

	/**
	 * WPSEO_Import_Status constructor.
	 *
	 * @param string $action The type of import action.
	 * @param bool   $status The status of the import.
	 * @param string $msg    Extra messages about the status.
	 */
	public function __construct( $action, $status, $msg = '' ) {
		$this->action = $action;
		$this->status = $status;
		$this->msg    = $msg;
	}

	/**
	 * Get the import message.
	 *
	 * @return string
	 */
	public function get_msg() {
		if ( $this->msg === '' ) {
			switch ( $this->action ) {
				case 'import':
					return $this->default_import_message();
					break;
				case 'cleanup':
					return $this->default_cleanup_message();
					break;
				case 'detect':
					return $this->default_detect_message();
			}
		}

		return $this->msg;
	}

	/**
	 * Get the import action.
	 *
	 * @return string
	 */
	public function get_action() {
		return $this->action;
	}

	/**
	 * Set the import action, set status to false.
	 *
	 * @param string $action The type of action to set as import action.
	 */
	public function set_action( $action ) {
		$this->action = $action;
		$this->status = false;
	}

	/**
	 * Sets the importer status message.
	 *
	 * @param string $msg The message to set.
	 */
	public function set_msg( $msg ) {
		$this->msg = $msg;
	}

	/**
	 * Set the importer status.
	 *
	 * @param bool $status The status to set.
	 *
	 * @return WPSEO_Import_Status The current object.
	 */
	public function set_status( $status ) {
		$this->status = (bool) $status;

		return $this;
	}

	/**
	 * Returns the default import message for the current status.
	 *
	 * @return string
	 */
	private function default_import_message() {
		if ( $this->status ) {
			return __( '%s data successfully imported.', 'wordpress-seo' );
		}

		return __( '%s data not found.', 'wordpress-seo' );
	}

	/**
	 * Returns the default cleanup message for the current status.
	 *
	 * @return string
	 */
	private function default_cleanup_message() {
		if ( $this->status ) {
			return __( '%s data successfully removed.', 'wordpress-seo' );
		}

		return __( '%s data not found.', 'wordpress-seo' );
	}

	/**
	 * Returns the default detect message for the current status.
	 *
	 * @return string
	 */
	private function default_detect_message() {
		if ( $this->status ) {
			return __( '%s data found.', 'wordpress-seo' );
		}

		return __( '%s data not found.', 'wordpress-seo' );
	}
}
