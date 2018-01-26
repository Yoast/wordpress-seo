<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class WPSEO_Import_External
 *
 * Class with functionality to import Yoast SEO settings from other plugins
 */
class WPSEO_Import_External {
	/**
	 * @var WPSEO_External_Importer
	 */
	protected $importer;

	/**
	 * Import class constructor.
	 *
	 * @param WPSEO_External_Importer $importer The importer that needs to perform this action.
	 * @param string $action The action to perform.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function __construct( WPSEO_External_Importer $importer, $action ) {
		$this->importer = $importer;

		switch( $action ) {
			case 'cleanup':
				$status = $this->importer->cleanup();
				break;
			case 'import':
			default:
				$status = $this->importer->import();
				break;
		}

		$status->set_msg( $this->complete_msg( $status->get_msg() ) );

		return $status;
	}

	/**
	 * Convenience function to replace %s with plugin name in import message.
	 *
	 * @param string $msg Message string.
	 *
	 * @return string
	 */
	protected function complete_msg( $msg ) {
		return sprintf( $msg, $this->importer->plugin_name() );
	}

}
