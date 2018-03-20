<?php
/**
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class WPSEO_Import_Plugins_Detector
 *
 * Class with functionality to detect whether we should import from another SEO plugin.
 */
class WPSEO_Import_Plugins_Detector {
	/**
	 * @var array Plugins we need to import from.
	 */
	public $needs_import = array();

	/**
	 * Detects whether we need to import anything.
	 */
	public function detect() {
		foreach ( WPSEO_Plugin_Importers::get() as $importer_class ) {
			$importer = new $importer_class;
			$detect   = new WPSEO_Import_Plugin( $importer, 'detect' );
			if ( $detect->status->status ) {
				$this->needs_import[ $importer_class ] = $importer->plugin_name();
			}
		}
	}
}
