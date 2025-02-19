<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Integrations;

use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Permanently_Dismissed_Site_Kit_Configuration_Repository_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository_Interface;
use Yoast\WP\SEO\Editors\Domain\Integrations\Integration_Data_Provider_Interface;

/**
 * Describes if the Site kit integration is enabled and configured.
 */
class Site_Kit implements Integration_Data_Provider_Interface {

	private const SITE_KIT_FILE = 'google-site-kit/google-site-kit.php';

	/**
	 * The Site Kit consent repository.
	 *
	 * @var Site_Kit_Consent_Repository_Interface
	 */
	private $site_kit_consent_repository;

	/**
	 * The Site Kit consent repository.
	 *
	 * @var Permanently_Dismissed_Site_Kit_Configuration_Repository_Interface
	 */
	private $permanently_dismissed_site_kit_configuration_repository;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Consent_Repository_Interface                             $site_kit_consent_repository                             The
	 *                                                                                                                                   Site
	 *                                                                                                                                   Kit
	 *                                                                                                                                   consent
	 *                                                                                                                                   repository.
	 * @param Permanently_Dismissed_Site_Kit_Configuration_Repository_Interface $permanently_dismissed_site_kit_configuration_repository The
	 *                                                                                                                                   Site
	 *                                                                                                                                   Kit
	 *                                                                                                                                   permanently
	 *                                                                                                                                   dismissed
	 *                                                                                                                                   configuration
	 *                                                                                                                                   repository.
	 */
	public function __construct(
		Site_Kit_Consent_Repository_Interface $site_kit_consent_repository,
		Permanently_Dismissed_Site_Kit_Configuration_Repository_Interface $permanently_dismissed_site_kit_configuration_repository
	) {
		$this->site_kit_consent_repository                             = $site_kit_consent_repository;
		$this->permanently_dismissed_site_kit_configuration_repository = $permanently_dismissed_site_kit_configuration_repository;
	}

	/**
	 * If the integration is activated.
	 *
	 * @return bool If the integration is activated.
	 */
	public function is_enabled(): bool {
		return \is_plugin_active( self::SITE_KIT_FILE );
	}

	/**
	 * If the Google site kit setup has been completed.
	 *
	 * @return bool If the Google site kit setup has been completed.
	 */
	private function is_setup_completed() {
		return \get_option( 'googlesitekit_has_connected_admins', false ) === '1';
	}

	/**
	 * If consent has been granted.
	 *
	 * @return bool If consent has been granted.
	 */
	private function is_connected() {
		return $this->site_kit_consent_repository->is_consent_granted();
	}
	/**
	 * If Google analytics is connected.
	 *
	 * @return bool If Google analytics is connected.
	 */
	public function is_ga_connected() {
		return \in_array('analytics-4',\get_option( 'googlesitekit_active_modules', false ),true);
	}

	/**
	 * If the entire onboarding has been completed.
	 *
	 * @return bool If the entire onboarding has been completed.
	 */
	public function is_onboarded() {
		return ( $this->is_connected() && $this->is_setup_completed() && $this->is_connected() );
	}

	/**
	 * Return this object represented by a key value array.
	 *
	 * @return array<string,bool> Returns the name and if the feature is enabled.
	 */
	public function to_array(): array {
		$site_kit_activate_url = \html_entity_decode(
			\wp_nonce_url(
				\self_admin_url( 'plugins.php?action=activate&plugin=' . self::SITE_KIT_FILE ),
				'activate-plugin_' . self::SITE_KIT_FILE
			)
		);

		$site_kit_install_url = \html_entity_decode(
			\wp_nonce_url(
				\self_admin_url( 'update.php?action=install-plugin&plugin=google-site-kit' ),
				'install-plugin_google-site-kit'
			)
		);

		$site_kit_setup_url = \self_admin_url( 'admin.php?page=googlesitekit-splash' );

		return [
			'isInstalled'              => \file_exists( \WP_PLUGIN_DIR . '/' . self::SITE_KIT_FILE ),
			'isActive'                 => $this->is_enabled(),
			'isSetupCompleted'         => $this->is_setup_completed(),
			'isConnected'              => $this->is_connected(),
			'isGAConnected' => $this->is_ga_connected(),
			'isFeatureEnabled'         => ( new Google_Site_Kit_Feature_Conditional() )->is_met(),
			'installUrl'               => $site_kit_install_url,
			'activateUrl'              => $site_kit_activate_url,
			'setupUrl'                 => $site_kit_setup_url,
			'isConfigurationDismissed' => $this->permanently_dismissed_site_kit_configuration_repository->is_site_kit_configuration_dismissed(),
		];
	}

	/**
	 * Return this object represented by a key value array.
	 *
	 * @return array<string,bool> Returns the name and if the feature is enabled.
	 */
	public function to_legacy_array(): array {
		return $this->to_array();
	}
}
