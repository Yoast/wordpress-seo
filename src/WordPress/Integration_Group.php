<?php
namespace Yoast\WordPress;

abstract class Integration_Group implements Integration {

	/**
	 * Returns a list of integrations to use.
	 *
	 * @return Integration[] List of registered integrations.
	 */
	abstract protected function get_integrations();

	/**
	 * Registers all hooks to WordPress.
	 */
	public function initialize() {
		$integrations = $this->get_integrations();

		array_map(
			function( Integration $integration ) {
				$integration->initialize();
			},
			$integrations
		);
	}
}
