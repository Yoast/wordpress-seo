<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents installer for the link module.
 */
class WPSEO_Link_Installer {

	/**
	 * Runs the installation of the link module.
	 */
	public function install() {
		foreach( $this->get_installables() as $installable ) {
			$installable->install();
		}
	}

	/**
	 * Notifies the user that the content might needs to be indexed.
	 */
	public function notify() {
		$notifier = new WPSEO_Link_Notifier();
		$notifier->manage_notification();
	}

	/**
	 * Returns the installable objects.
	 *
	 * @return WPSEO_Installable[]
	 */
	protected function get_installables() {
		return array(
			new WPSEO_Link_Storage(),
			new WPSEO_Link_Count_Storage()
		);
	}
}
