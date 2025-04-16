<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Setup;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Setup flow interceptor class.
 */
class Setup_Flow_Interceptor implements Integration_Interface {

	/**
	 * The page name of the Site Kit Setup finished page.
	 */
	private const GOOGLE_SITE_KIT_SETUP_FINISHED_PAGE = 'googlesitekit-splash';

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Holds the redirect helper.
	 *
	 * @var Redirect_Helper $redirect_helper
	 */
	private $redirect_helper;

	/**
	 * The constructor.
	 *
	 * @param Current_Page_Helper $current_page_helper The current page helper.
	 * @param Redirect_Helper     $redirect_helper     The redirect helper to abstract away the actual redirecting.
	 */
	public function __construct( Current_Page_Helper $current_page_helper, Redirect_Helper $redirect_helper ) {
		$this->current_page_helper = $current_page_helper;
		$this->redirect_helper     = $redirect_helper;
	}

	/**
	 * Registers our redirect back to our dashboard all the way at the end of the admin init to make sure everything from the Site Kit callback can be finished.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'intercept_site_kit_setup_flow' ], 999 );
	}

	/**
	 * The conditions for this integration to load.
	 *
	 * @return string[] The conditionals.
	 */
	public static function get_conditionals() {
		return [ Google_Site_Kit_Feature_Conditional::class, Admin_Conditional::class ];
	}

	/**
	 * Checks if we should intercept the final page from the Site Kit flow.
	 *
	 * @return void
	 */
	public function intercept_site_kit_setup_flow() {
		if ( \get_transient( Setup_Url_Interceptor::SITE_KIT_SETUP_TRANSIENT ) === '1' && $this->is_site_kit_setup_completed_page() ) {
			\delete_transient( Setup_Url_Interceptor::SITE_KIT_SETUP_TRANSIENT );
			$this->redirect_helper->do_safe_redirect( \self_admin_url( 'admin.php?page=wpseo_dashboard&redirected_from_site_kit' ), 302, 'Yoast SEO' );

		}
	}

	/**
	 * Checks if we are on the site kit setup completed page.
	 *
	 * @return bool
	 */
	private function is_site_kit_setup_completed_page(): bool {
		$on_setup_page = $this->current_page_helper->get_current_yoast_seo_page() === self::GOOGLE_SITE_KIT_SETUP_FINISHED_PAGE;
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
		$authentication_success_notification = isset( $_GET['notification'] ) && \sanitize_text_field( \wp_unslash( $_GET['notification'] ) ) === 'authentication_success';

		return $on_setup_page && $authentication_success_notification;
	}
}
