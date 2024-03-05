<?php

namespace Yoast\WP\SEO\Editors\Framework\Integrations;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Editors\Domain\Integrations\Integration_Data_Provider_Interface;
use function get_post_type;

class Woo implements Integration_Data_Provider_Interface {

	/**
	 * @var \Yoast\WP\SEO\Conditionals\WooCommerce_Conditional
	 */
	protected $woo_conditional;

	public function __construct( WooCommerce_Conditional $woo_conditional ) {
		$this->woo_conditional = $woo_conditional;
	}

	/**
	 * @inheritDoc
	 */
	public function is_enabled(): bool {
		return $this->woo_conditional->is_met();
	}

	/**
	 * @inheritDoc
	 */
	public function to_array(): array {
		// TODO: Implement to_array() method.
	}

	/**
	 * @inheritDoc
	 */
	public function to_legacy_array(): array {
		return [
			'isWooCommerceActive' => $this->is_enabled(),
		];

	}
}
