<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Shortlinker;
use WPSEO_Utils;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Admin\Social_Profiles_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Routes\Indexing_Route;

/**
 * ConfigurationWorkoutsIntegration class
 */
class Configuration_Workout_Integration implements Integration_Interface {

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The addon manager.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	private $addon_manager;

	/**
	 * The shortlinker.
	 *
	 * @var WPSEO_Shortlinker
	 */
	private $shortlinker;

	/**
	 * The options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * The social profiles helper.
	 *
	 * @var Social_Profiles_Helper
	 */
	private $social_profiles_helper;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Configuration_Workout_Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager    The admin asset manager.
	 * @param WPSEO_Addon_Manager       $addon_manager          The addon manager.
	 * @param WPSEO_Shortlinker         $shortlinker            The shortlinker.
	 * @param Options_Helper            $options_helper         The options helper.
	 * @param Product_Helper            $product_helper         The product helper.
	 * @param Social_Profiles_Helper    $social_profiles_helper The social profiles helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $admin_asset_manager,
		WPSEO_Addon_Manager $addon_manager,
		WPSEO_Shortlinker $shortlinker,
		Options_Helper $options_helper,
		Product_Helper $product_helper,
		Social_Profiles_Helper $social_profiles_helper
	) {
		$this->admin_asset_manager    = $admin_asset_manager;
		$this->addon_manager          = $addon_manager;
		$this->shortlinker            = $shortlinker;
		$this->options_helper         = $options_helper;
		$this->product_helper         = $product_helper;
		$this->social_profiles_helper = $social_profiles_helper;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Adds the data for the configuration workout to the wpseoWorkoutsData object.
	 */
	public function enqueue_assets() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Date is not processed or saved.
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'wpseo_workouts' ) {
			return;
		}

		$this->admin_asset_manager->enqueue_script( 'indexation' );
		$this->admin_asset_manager->enqueue_style( 'admin-css' );
		$this->admin_asset_manager->enqueue_style( 'monorepo' );

		$data = [
			'disabled'     => ! \YoastSEO()->helpers->indexable->should_index_indexables(),
			'amount'       => \YoastSEO()->helpers->indexing->get_filtered_unindexed_count(),
			'firstTime'    => ( \YoastSEO()->helpers->indexing->is_initial_indexing() === true ),
			'errorMessage' => '',
			'restApi'      => [
				'root'               => \esc_url_raw( \rest_url() ),
				'indexing_endpoints' => $this->get_endpoints(),
				'nonce'              => \wp_create_nonce( 'wp_rest' ),
			],
		];

		/**
		 * Filter: 'wpseo_indexing_data' Filter to adapt the data used in the indexing process.
		 *
		 * @param array $data The indexing data to adapt.
		 */
		$data = \apply_filters( 'wpseo_indexing_data', $data );

		$this->admin_asset_manager->localize_script( 'indexation', 'yoastIndexingData', $data );

		$social_profiles        = $this->get_social_profiles();
		$person_social_profiles = $this->social_profiles_helper->get_person_social_profiles( $this->get_person_id() );

		// This filter is documented in admin/views/tabs/metas/paper-content/general/knowledge-graph.php.
		$knowledge_graph_message = \apply_filters( 'wpseo_knowledge_graph_setting_msg', '' );

		$options               = $this->get_company_or_person_options();
		$selected_option_label = '';
		$filtered_options      = \array_filter(
			$options,
			function ( $item ) {
				return $item['value'] === $this->is_company_or_person();
			}
		);
		$selected_option       = \reset( $filtered_options );
		if ( \is_array( $selected_option ) ) {
			$selected_option_label = $selected_option['label'];
		}
		$this->admin_asset_manager->add_inline_script(
			'workouts',
			\sprintf(
				'window.wpseoWorkoutsData["configuration"] = {
					"companyOrPerson": "%s",
					"companyOrPersonLabel": "%s",
					"companyName": "%s",
					"companyLogo": "%s",
					"companyLogoId": %d,
					"personId": %d,
					"canEditUser": %d,
					"personName": "%s",
					"personLogo": "%s",
					"personLogoId": %d,
					"siteTagline": "%s",
					"socialProfiles": {
						"facebookUrl": "%s",
						"twitterUsername": "%s",
						"otherSocialUrls": %s,
					},
					"personSocialProfiles" : {
						"facebook" : "%s",
						"instagram" : "%s",
						"linkedin" : "%s",
						"myspace" : "%s",
						"pinterest" : "%s",
						"soundcloud" : "%s",
						"tumblr" : "%s",
						"twitter" : "%s",
						"youtube" : "%s",
						"wikipedia" : "%s",
					},
					"tracking": %d,
					"companyOrPersonOptions": %s,
					"shouldForceCompany": %d,
					"knowledgeGraphMessage": "%s",
					"shortlinks": {
						"workoutGuide": "%s",
						"indexData": "%s",
						"gdpr": "%s",
					},
				};',
				$this->is_company_or_person(),
				$selected_option_label,
				$this->get_company_name(),
				$this->get_company_logo(),
				$this->get_company_logo_id(),
				$this->get_person_id(),
				$this->get_can_edit_user(),
				$this->get_person_name(),
				$this->get_person_logo(),
				$this->get_person_logo_id(),
				$this->get_site_tagline(),
				$social_profiles['facebook_url'],
				$social_profiles['twitter_username'],
				WPSEO_Utils::format_json_encode( $social_profiles['other_social_urls'] ),
				$person_social_profiles['facebook'],
				$person_social_profiles['instagram'],
				$person_social_profiles['linkedin'],
				$person_social_profiles['myspace'],
				$person_social_profiles['pinterest'],
				$person_social_profiles['soundcloud'],
				$person_social_profiles['tumblr'],
				$person_social_profiles['twitter'],
				$person_social_profiles['youtube'],
				$person_social_profiles['wikipedia'],
				$this->has_tracking_enabled(),
				WPSEO_Utils::format_json_encode( $options ),
				$this->should_force_company(),
				$knowledge_graph_message,
				$this->shortlinker->build_shortlink( 'https://yoa.st/config-workout-guide' ),
				$this->shortlinker->build_shortlink( 'https://yoa.st/config-workout-index-data' ),
				$this->shortlinker->build_shortlink( 'https://yoa.st/gdpr-config-workout' )
			),
			'before'
		);
	}

	/**
	 * Retrieves a list of the endpoints to use.
	 *
	 * @return array The endpoints.
	 */
	protected function get_endpoints() {
		$endpoints = [
			'prepare'            => Indexing_Route::FULL_PREPARE_ROUTE,
			'terms'              => Indexing_Route::FULL_TERMS_ROUTE,
			'posts'              => Indexing_Route::FULL_POSTS_ROUTE,
			'archives'           => Indexing_Route::FULL_POST_TYPE_ARCHIVES_ROUTE,
			'general'            => Indexing_Route::FULL_GENERAL_ROUTE,
			'indexablesComplete' => Indexing_Route::FULL_INDEXABLES_COMPLETE_ROUTE,
			'post_link'          => Indexing_Route::FULL_POST_LINKS_INDEXING_ROUTE,
			'term_link'          => Indexing_Route::FULL_TERM_LINKS_INDEXING_ROUTE,
		];

		$endpoints = \apply_filters( 'wpseo_indexing_endpoints', $endpoints );

		$endpoints['complete'] = Indexing_Route::FULL_COMPLETE_ROUTE;

		return $endpoints;
	}

	// ** Private functions ** //

	/**
	 * Returns the entity represented by the site.
	 *
	 * @return string The entity represented by the site.
	 */
	private function is_company_or_person() {
		return $this->options_helper->get( 'company_or_person', '' );
	}

	/**
	 * Gets the company name from the option in the database.
	 *
	 * @return string The company name.
	 */
	private function get_company_name() {
		return $this->options_helper->get( 'company_name', '' );
	}

	/**
	 * Gets the company logo from the option in the database.
	 *
	 * @return string The company logo.
	 */
	private function get_company_logo() {
		return $this->options_helper->get( 'company_logo', '' );
	}

	/**
	 * Gets the company logo id from the option in the database.
	 *
	 * @return string The company logo id.
	 */
	private function get_company_logo_id() {
		return $this->options_helper->get( 'company_logo_id', '' );
	}

	/**
	 * Gets the person id from the option in the database.
	 *
	 * @return int|null The person id, null if empty.
	 */
	private function get_person_id() {
		return $this->options_helper->get( 'company_or_person_user_id' );
	}

	/**
	 * Gets wether or not current user can edit the selected person.
	 *
	 * @return bool Wether or not current user can edit the selected person.
	 */
	private function get_can_edit_user() {
		return \current_user_can( 'edit_user', $this->get_person_id() );
	}

	/**
	 * Gets the person id from the option in the database.
	 *
	 * @return int|null The person id, null if empty.
	 */
	private function get_person_name() {
		$user = \get_userdata( $this->get_person_id() );
		if ( $user instanceof \WP_User ) {
			return $user->get( 'display_name' );
		}
		return '';
	}

	/**
	 * Gets the person avatar from the option in the database.
	 *
	 * @return string The person logo.
	 */
	private function get_person_logo() {
		return $this->options_helper->get( 'person_logo', '' );
	}

	/**
	 * Gets the person logo id from the option in the database.
	 *
	 * @return string The person logo id.
	 */
	private function get_person_logo_id() {
		return $this->options_helper->get( 'person_logo_id', '' );
	}

	/**
	 * Gets the site tagline.
	 *
	 * @return string The site tagline.
	 */
	private function get_site_tagline() {
		return \get_bloginfo( 'description' );
	}

	/**
	 * Gets the social profiles stored in the database.
	 *
	 * @return string[] The social profiles.
	 */
	private function get_social_profiles() {
		return [
			'facebook_url'      => $this->options_helper->get( 'facebook_site', '' ),
			'twitter_username'  => $this->options_helper->get( 'twitter_site', '' ),
			'other_social_urls' => $this->options_helper->get( 'other_social_urls', [] ),
		];
	}

	/**
	 * Checks whether tracking is enabled.
	 *
	 * @return bool True if tracking is enabled, false otherwise, null if in Free and conf. workout step not finished.
	 */
	private function has_tracking_enabled() {
		$default = false;

		if ( $this->product_helper->is_premium() ) {
			$default = true;
		}

		return $this->options_helper->get( 'tracking', $default );
	}

	/**
	 * Gets the options for the Company or Person select.
	 * Returns only the company option if it is forced (by Local SEO), otherwise returns company and person option.
	 *
	 * @return array The options for the company-or-person select.
	 */
	private function get_company_or_person_options() {
		$options = [
			[
				'label' => \__( 'Organization', 'wordpress-seo' ),
				'value' => 'company',
				'id'    => 'company',
			],
			[
				'label' => \__( 'Person', 'wordpress-seo' ),
				'value' => 'person',
				'id'    => 'person',
			],
		];
		if ( $this->should_force_company() ) {
			$options = [
				[
					'label' => \__( 'Organization', 'wordpress-seo' ),
					'value' => 'company',
					'id'    => 'company',
				],
			];
		}

		return $options;
	}

	/**
	 * Checks whether we should force "Organization".
	 *
	 * @return bool
	 */
	private function should_force_company() {
		return $this->addon_manager->is_installed( WPSEO_Addon_Manager::LOCAL_SLUG );
	}
}
