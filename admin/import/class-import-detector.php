<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class WPSEO_Import_External_Detector
 *
 * Class with functionality to detect whether we should import from another SEO plugin
 */
class WPSEO_Import_External_Detector {
	/**
	 * @var array Plugins we need to import from.
	 */
	public $needs_import = array();

	/**
	 * Detects whether we need to import anything.
	 */
	public function detect() {
		foreach ( WPSEO_Import_External_Importers::$importers as $importer_class ) {
			$importer = new $importer_class;
			$detect   = new WPSEO_Import_External( $importer, 'detect' );
			if ( $detect->status->status ) {
				$this->needs_import[ $importer_class ] = $importer->plugin_name();
			}
		}
	}
}
