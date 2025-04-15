<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Configuration;

use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository_Interface;

/**
 * Fake class for the Site Kit Consent Repository.
 *
 * @group Site_Kit_Consent_Repository
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_Consent_Repository_Fake implements Site_Kit_Consent_Repository_Interface {

	/**
	 * The value `is_consent_granted` will return.
	 *
	 * @var bool
	 */
	private $consent = true;

	/**
	 * Checks if the Site Kit consent has been granted..
	 *
	 * @return bool
	 */
	public function is_consent_granted(): bool {
		// Return a fake value for testing purposes.
		return $this->consent;
	}

	/**
	 * Sets the Site Kit consent value.
	 *
	 * @param bool $consent The value to set.
	 *
	 * @return bool
	 */
	public function set_site_kit_consent( bool $consent ): bool {
		// Return the passed value for testing purposes.
		$this->consent = $consent;
		return $consent;
	}
}
