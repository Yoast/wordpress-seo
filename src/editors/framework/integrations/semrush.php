<?php

namespace Yoast\WP\SEO\Editors\Framework\Integrations;

use Yoast\WP\SEO\Config\SEMrush_Client;
use Yoast\WP\SEO\Editors\Domain\Integrations\Integration_Data_Provider_Interface;
use Yoast\WP\SEO\Exceptions\OAuth\Authentication_Failed_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Property_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Token_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;

class Semrush implements Integration_Data_Provider_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * @inheritDoc
	 */
	public function is_enabled(): bool {
		return (bool) $this->options_helper->get( 'semrush_integration_active', true );
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
			'semrushIntegrationActive' => $this->is_enabled(),
			'countryCode'              => $this->options_helper->get( 'semrush_country_code', false ),
			'SEMrushLoginStatus'       => $this->options_helper->get( 'semrush_integration_active', true ) && $this->get_semrush_login_status(),
		];
	}

	/**
	 * Checks if the user is logged in to SEMrush.
	 *
	 * @return mixed|bool The SEMrush login status.
	 */
	private function get_semrush_login_status() {
		try {
			// Do this just in time to handle constructor exception.
			$semrush_client = \YoastSEO()->classes->get( SEMrush_Client::class );
		} catch ( Empty_Property_Exception $e ) {
			// Return false if token is malformed (empty property).
			return false;
		}
		// Get token (and refresh it if it's expired).
		try {
			$semrush_client->get_tokens();
		} catch ( Authentication_Failed_Exception | Empty_Token_Exception $e ) {
			return false;
		}

		return $semrush_client->has_valid_tokens();
	}
}
