<?php

namespace Yoast\YoastSEO\WordPress;

class Integration_Group implements Integration {
	/** @var Integration[] List of integrations. */
	protected $integrations = array();

	/**
	 * Integration_Group constructor.
	 *
	 * @param Integration[] $integrations List of integrations to load.
	 *
	 * @return void
	 */
	public function __construct( array $integrations ) {
		$this->integrations = $this->ensure_integration( $integrations );
	}

	/**
	 * Initializes all registered integrations.
	 *
	 * @return void
	 */
	public function register_hooks() {
		array_map(
			function( Integration $integration ) {
				$integration->register_hooks();
			},
			$this->integrations
		);
	}

	/**
	 * Ensures the list of Integrations are loaded.
	 *
	 * @param array $integrations List of Integrations to load.
	 *
	 * @return array List of Integrations.
	 */
	protected function ensure_integration( array $integrations ) {
		return array_filter( $integrations, function( $integration ) {
			return $integration instanceof Integration;
		} );
	}
}
