<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents installer for the link module.
 */
class WPSEO_Link_Installer {

	/** @var WPSEO_Installable[]  */
	protected $installables = array();

	/**
	 * Sets the installables.
	 */
	public function __construct() {
		$this->installables = array(
			new WPSEO_Link_Storage(),
			new WPSEO_Meta_Storage(),
		);
	}

	/**
	 * Runs the installation of the link module.
	 */
	public function install() {
		foreach ( $this->get_installables() as $installable ) {
			$installable->install();
		}
	}

	/**
	 * Adds a installable object to the installer.
	 *
	 * @param WPSEO_Installable $installable The installable object.
	 */
	public function add_installable( WPSEO_Installable $installable ) {
		$this->installables[] = $installable;
	}

	/**
	 * Returns the installable objects.
	 *
	 * @return WPSEO_Installable[] The installables to use.
	 */
	protected function get_installables() {
		return $this->installables;
	}
}
