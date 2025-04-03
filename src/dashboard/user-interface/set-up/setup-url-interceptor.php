<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Set_Up;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

class Setup_Url_Interceptor implements Integration_Interface {

	public const PAGE = 'wpseo_page_site_kit_set_up';

	public const SITE_KIT_SETUP_TRANSIENT = 'wpseo_page_site_kit_set_up';

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	private $allowed_setup_links;

	/**
	 * The constructor.
	 */
	public function __construct( Current_Page_Helper $current_page_helper, Site_Kit $site_kit_configuration ) {
		$this->current_page_helper = $current_page_helper;

		$this->allowed_setup_links = [
			$site_kit_configuration->get_install_url(),
			$site_kit_configuration->get_activate_url(),
			$site_kit_configuration->get_setup_url(),
			$site_kit_configuration->get_update_url(),
		];
	}

	public function register_hooks() {
		// Are we on the in between page?
		if ( $this->current_page_helper->get_current_yoast_seo_page() === self::PAGE ) {

			// Check if parameter is there and is valid.
			if ( isset( $_GET['redirect_setup_url'] ) && \in_array( \sanitize_text_field( \wp_unslash( $_GET['redirect_setup_url'] ) ), $this->allowed_setup_links ) ) {
				// We overwrite the transient for each time this redirect is hit to keep refreshing the time.
				\set_transient( self::SITE_KIT_SETUP_TRANSIENT, 1, ( \MINUTE_IN_SECONDS * 15 ) );
				$redirect_url = $_GET['redirect_setup_url'];
				\wp_safe_redirect( $redirect_url, 302, 'Yoast SEO' );
				exit;

			}
			else {
				\wp_safe_redirect( \self_admin_url( 'admin.php?page=wpseo_dashboard' ), 302, 'Yoast SEO' );
				exit;
			}
		}
	}

	/**
	 * The conditions for this integration to load.
	 *
	 * @return string[] The conditionals.
	 */
	public static function get_conditionals() {
		return [ Google_Site_Kit_Feature_Conditional::class, Admin_Conditional::class ];
	}
}
