<?php
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\User_Interface;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Conditionals\Third_Party\Site_Kit_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;


/**
 * Enables the Site Kit integration feature flag on plugin activation, if Site Kit is active.
 */
class Enable_Site_Kit_Feature_Flag_On_Activation implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The Site Kit conditional.
	 *
	 * @var Site_Kit_Conditional $site_kit_conditional
	 */
	private $site_kit_conditional;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper $options_helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Conditional $site_kit_conditional The Site Kit conditional.
	 * @param Options_Helper       $options_helper       The options helper.
	 */
	public function __construct(
		Site_Kit_Conditional $site_kit_conditional,
		Options_Helper $options_helper
	) {
		$this->site_kit_conditional = $site_kit_conditional;
		$this->options_helper       = $options_helper;
	}

	/**
	 * Registers the enabling of the Site Kit feature flag.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wpseo_activate', [ $this, 'enable_site_kit_feature_flag' ] );
	}

	/**
	 * Enables the Site Kit integration feature flag on plugin activation, if Site Kit is active.
	 *
	 * @return void
	 */
	public function enable_site_kit_feature_flag() {
		if ( $this->site_kit_conditional->is_met() ) {
			$this->options_helper->set( 'google_site_kit_feature_enabled', true );
		}
	}
}
