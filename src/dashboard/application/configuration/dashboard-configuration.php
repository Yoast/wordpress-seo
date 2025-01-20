<?php


// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Dashboard\Application\Configuration;

use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Dashboard\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Dashboard\Application\Endpoints\Endpoints_Repository;
use Yoast\WP\SEO\Dashboard\Infrastructure\Nonces\Nonce_Repository;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis;
use Yoast\WP\SEO\Editors\Framework\Readability_Analysis;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Responsible for the dashboard configuration.
 */
class Dashboard_Configuration {

	/**
	 * The content types repository.
	 *
	 * @var Content_Types_Repository $content_types_repository
	 */
	private $content_types_repository;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper $indexable_helper
	 */
	private $indexable_helper;

	/**
	 * The user helper.
	 *
	 * @var User_Helper $user_helper
	 */
	private $user_helper;

	/**
	 * The repository.
	 *
	 * @var Enabled_Analysis_Features_Repository
	 */
	private $enabled_analysis_features_repository;

	/**
	 * The endpoints repository.
	 *
	 * @var Endpoints_Repository
	 */
	private $endpoints_repository;

	/**
	 * The nonce repository.
	 *
	 * @var Nonce_Repository
	 */
	private $nonce_repository;

	/**
	 * The Google Site Kit conditional.
	 *
	 * @var Google_Site_Kit_Feature_Conditional
	 */
	private $google_site_kit_conditional;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Content_Types_Repository             $content_types_repository             The content types repository.
	 * @param Indexable_Helper                     $indexable_helper                     The indexable helper
	 *                                                                                   repository.
	 * @param User_Helper                          $user_helper                          The user helper.
	 * @param Enabled_Analysis_Features_Repository $enabled_analysis_features_repository The analysis feature.
	 *                                                                                        repository.
	 * @param Endpoints_Repository                 $endpoints_repository                 The endpoints repository.
	 * @param Nonce_Repository                     $nonce_repository                     The nonce repository.
	 * @param Google_Site_Kit_Feature_Conditional  $google_site_kit_conditional          The Google Site Kit conditional.
	 * @param Options_Helper                       $options_helper                       The options helper.
	 */
	public function __construct(
		Content_Types_Repository $content_types_repository,
		Indexable_Helper $indexable_helper,
		User_Helper $user_helper,
		Enabled_Analysis_Features_Repository $enabled_analysis_features_repository,
		Endpoints_Repository $endpoints_repository,
		Nonce_Repository $nonce_repository,
		Google_Site_Kit_Feature_Conditional $google_site_kit_conditional,
		Options_Helper $options_helper
	) {
		$this->content_types_repository             = $content_types_repository;
		$this->indexable_helper                     = $indexable_helper;
		$this->user_helper                          = $user_helper;
		$this->enabled_analysis_features_repository = $enabled_analysis_features_repository;
		$this->endpoints_repository                 = $endpoints_repository;
		$this->nonce_repository                     = $nonce_repository;
		$this->google_site_kit_conditional          = $google_site_kit_conditional;
		$this->options_helper                       = $options_helper;
	}

	/**
	 * Returns a configuration
	 *
	 * @return array<string,array<string>>
	 */
	public function get_configuration(): array {
		return [
			'contentTypes'            => $this->content_types_repository->get_content_types(),
			'indexablesEnabled'       => $this->indexable_helper->should_index_indexables(),
			'displayName'             => $this->user_helper->get_current_user_display_name(),
			'enabledAnalysisFeatures' => $this->enabled_analysis_features_repository->get_features_by_keys(
				[
					Readability_Analysis::NAME,
					Keyphrase_Analysis::NAME,
				]
			)->to_array(),
			'endpoints'               => $this->endpoints_repository->get_all_endpoints()->to_array(),
			'nonce'                   => $this->nonce_repository->get_rest_nonce(),
			'google_site_kit'         => $this->get_google_site_kit_configuration(),
		];
	}

	/**
	 * Get the Google Site Kit configuration.
	 *
	 * @return array<string|bool>
	 */
	public function get_google_site_kit_configuration(): array {
		$google_site_kit_file         = 'google-site-kit/google-site-kit.php';
		$google_site_kit_activate_url = \wp_nonce_url(
			\self_admin_url( 'plugins.php?action=activate&plugin=' . $google_site_kit_file ),
			'activate-plugin_' . $google_site_kit_file
		);

		$google_site_kit_install_url = \wp_nonce_url(
			\self_admin_url( 'update.php?action=install-plugin&plugin=google-site-kit' ),
			'install-plugin_google-site-kit'
		);

		$google_site_kit_setup_url = \self_admin_url( 'admin.php?page=googlesitekit-splash' );

		return [
			'installed'     => \file_exists( \WP_PLUGIN_DIR . '/' . $google_site_kit_file ),
			'active'        => \is_plugin_active( $google_site_kit_file ),
			'setup'         => \get_option( 'googlesitekit_has_connected_admins', false ) === '1',
			'connected'     => $this->options_helper->get( 'google_site_kit_connected', false ),
			'featureActive' => $this->google_site_kit_conditional->is_met(),
			'installUrl'    => $google_site_kit_install_url,
			'activateUrl'   => $google_site_kit_activate_url,
			'setupUrl'      => $google_site_kit_setup_url,
		];
	}
}
