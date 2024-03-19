<?php

namespace Yoast\WP\SEO\Editors\Framework\Integrations;

use Yoast\WP\SEO\Editors\Domain\Integrations\Integration_Data_Provider_Interface;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wincher_Helper;

class Wincher implements Integration_Data_Provider_Interface {

	/**
	 * @var Wincher_Helper
	 */
	private $wincher_helper;

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	public function __construct( Wincher_Helper $wincher_helper, Options_Helper $options_helper ) {
		$this->wincher_helper = $wincher_helper;
		$this->options_helper = $options_helper;
	}

	/**
	 * @inheritDoc
	 */
	public function is_enabled(): bool {
		return $this->wincher_helper->is_active();
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
			'wincherIntegrationActive' => $this->is_enabled(),
			'wincherLoginStatus'       => $this->is_enabled() && $this->wincher_helper->login_status(),
			'wincherWebsiteId'         => $this->options_helper->get( 'wincher_website_id', '' ),
			'wincherAutoAddKeyphrases' => $this->options_helper->get( 'wincher_automatically_add_keyphrases', false ),
		];
	}
}
