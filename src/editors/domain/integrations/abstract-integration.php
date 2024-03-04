<?php

namespace Yoast\WP\SEO\Editors\Domain\Integrations;

use Yoast\WP\SEO\Editors\Domain\Integrations\Integration_Data_Provider_Interface;

class Abstract_Integration implements Integration_Data_Provider_Interface {

	/**
	 * @inheritDoc
	 */
	public function is_enabled(): bool {
		// TODO: Implement is_enabled() method.
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
		// TODO: Implement to_legacy_array() method.
	}
}
