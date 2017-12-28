<?php

namespace Yoast\YoastSEO\WordPress;

class Integration_Group implements Integration {
	/** @var Integration[] List of integrations. */
	protected $integrations = array();

	/**
	 * Integration_Group constructor.
	 *
	 * @param Integration[] $integrations List of integrations to load.
	 */
	public function __construct( array $integrations ) {
		$this->integrations = $this->ensure_integration( $integrations );
	}

	/**
	 * Initializes all registered integrations.
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
	 * @param $integrations
	 *
	 * @return array
	 */
	protected function ensure_integration( $integrations ) {
		return array_filter( $integrations, function( $integration ) {
			return $integration instanceof Integration;
		} );
	}
}
