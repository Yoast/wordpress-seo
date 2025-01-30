<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Integrations;

use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Editors\Domain\Integrations\Integration_Data_Provider_Interface;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Describes if the Site kit integration is enabled and configured.
 */
class Site_Kit implements Integration_Data_Provider_Interface {

	private const SITE_KIT_FILE = 'google-site-kit/google-site-kit.php';

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
	 * If the integration is activated.
	 *
	 * @return bool If the integration is activated.
	 */
	public function is_enabled(): bool {
		return \is_plugin_active( self::SITE_KIT_FILE );
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
			'isInstalled'     => \file_exists( \WP_PLUGIN_DIR . '/' . self::SITE_KIT_FILE ),
			'isActive'        => \is_plugin_active( self::SITE_KIT_FILE ),
			'setup_completed' => \get_option( 'googlesitekit_has_connected_admins', false ) === '1',
			'isConnected'     => $this->options_helper->get( 'google_site_kit_connected', false ),
			'feature_enabled' => ( new Google_Site_Kit_Feature_Conditional() )->is_met(),
			'install_url'     => $site_kit_install_url,
			'activate_url'    => $site_kit_activate_url,
			'setup_url'       => $site_kit_setup_url,
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
