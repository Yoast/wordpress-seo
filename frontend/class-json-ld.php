<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_JSON_LD
 *
 * Outputs schema code specific for Google's JSON LD stuff.
 *
 * @since 1.8
 */
class WPSEO_JSON_LD implements WPSEO_WordPress_Integration {

	/**
	 * Holds the social profiles for the entity.
	 *
	 * @var array
	 */
	private $profiles = array();

	/**
	 * Holds the data to put out.
	 *
	 * @var array
	 */
	private $data = array();

	/**
	 * Holds the graph to output onto the page.
	 *
	 * @var array
	 */
	private $graph = array();

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_action( 'wpseo_head', array( $this, 'json_ld' ), 90 );
		add_action( 'wpseo_json_ld', array( $this, 'website' ), 10 );
		add_action( 'wpseo_json_ld', array( $this, 'organization_or_person' ), 20 );
		add_action( 'wpseo_json_ld', array( $this, 'breadcrumb' ), 20 );
		add_action( 'wpseo_json_ld', array( $this, 'output' ), 30 );
	}

	/**
	 * JSON LD output function that the functions for specific code can hook into.
	 *
	 * @since 1.8
	 */
	public function json_ld() {
		if ( ! is_404() ) {
			do_action( 'wpseo_json_ld' );
		}
	}

	/**
	 * Outputs code to allow Google to recognize social profiles for use in the Knowledge graph.
	 *
	 * @since 1.8
	 */
	public function organization_or_person() {
		$company_or_person = WPSEO_Options::get( 'company_or_person', '' );
		if ( '' === $company_or_person ) {
			return;
		}

		$this->prepare_organization_person_markup();

		switch ( $company_or_person ) {
			case 'company':
				$this->organization();
				break;
			case 'person':
				$this->person();
				break;
		}

		$this->add_to_graph( $company_or_person );
	}

	/**
	 * Outputs code to allow recognition of the internal search engine.
	 *
	 * @since 1.5.7
	 *
	 * @link  https://developers.google.com/structured-data/site-name
	 */
	public function website() {
		if ( ! is_front_page() ) {
			return;
		}

		$home_url = $this->get_home_url();

		$this->data = array(
			'@type'    => 'WebSite',
			'@id'      => $home_url . '#website',
			'url'      => $home_url,
			'name'     => $this->get_website_name(),
		);

		$this->add_alternate_name();
		$this->internal_search_section();

		$this->add_to_graph( 'website' );
	}

	public function add_to_graph( $context ) {
		/**
		 * Filter: 'wpseo_json_ld_output' - Allows filtering of the JSON+LD output.
		 *
		 * @api array $output The output array, before its JSON encoded.
		 *
		 * @param string $context The context of the output, useful to determine whether to filter or not.
		 */
		$data = apply_filters( 'wpseo_json_ld_output', $this->data, $context );

		if ( ! empty( $data ) ) {
			$this->graph[] = $data;
		}
	}

	/**
	 * Outputs code to allow recognition of page's position in the site hierarchy
	 *
	 * @Link https://developers.google.com/search/docs/data-types/breadcrumb
	 *
	 * @return void
	 */
	public function breadcrumb() {
		if ( is_front_page() || ! WPSEO_Options::get( 'breadcrumbs-enable', false ) ) {
			return;
		}

		$this->data = array(
			'@type'           => 'BreadcrumbList',
			'itemListElement' => array(),
		);

		$breadcrumbs_instance = WPSEO_Breadcrumbs::get_instance();
		$breadcrumbs          = $breadcrumbs_instance->get_links();
		$broken               = false;

		foreach ( $breadcrumbs as $index => $breadcrumb ) {
			if ( ! empty( $breadcrumb['hide_in_schema'] ) ) {
				continue;
			}

			if ( ! array_key_exists( 'url', $breadcrumb ) || ! array_key_exists( 'text', $breadcrumb ) ) {
				$broken = true;
				break;
			}

			$this->data['itemListElement'][] = array(
				'@type'    => 'ListItem',
				'position' => ( $index + 1 ),
				'item'     => array(
					'@id'  => $breadcrumb['url'],
					'name' => $breadcrumb['text'],
				),
			);
		}

		// Only output if JSON is correctly formatted.
		if ( ! $broken ) {
			$this->add_to_graph( 'breadcrumb' );
		}
	}

	private function add_block_json_to_graph() {
		$page = new WPSEO_Structured_Data_Page();

		$json_builder = new WPSEO_Structured_Data_JSON_Builder( $this->graph, $page );
		$this->graph = $json_builder->build_json();
	}

	/**
	 * Outputs the JSON LD code in a valid JSON+LD wrapper.
	 *
	 * @since 1.8
	 */
	public function output() {
		$this->add_block_json_to_graph();

		if ( is_array( $this->graph ) && ! empty( $this->graph ) ) {
			$output = array(
				"@context" => "https://schema.org",
				"@graph" => $this->graph,
			);

			echo "<script type='application/ld+json'>", $this->format_data( $output ), '</script>', "\n";
		}

		// Empty the $data array so we don't output it twice.
		$this->data = array();
		$this->graph = array();
	}

	/**
	 * Prepares the data for outputting.
	 *
	 * @param array $data The data to format.
	 *
	 * @return false|string The prepared string.
	 */
	public function format_data( $data ) {
		$flags = 0;

		if ( version_compare( PHP_VERSION, '5.4', '>=' ) ) {
			$flags = $flags | JSON_UNESCAPED_SLASHES;
		}

		if ( defined( 'WPSEO_DEBUG' ) && WPSEO_DEBUG ) {
			$flags = $flags | JSON_PRETTY_PRINT;
		}

		return wp_json_encode( $data, $flags );
	}

	/**
	 * Schema for Organization.
	 */
	private function organization() {
		if ( '' !== WPSEO_Options::get( 'company_name', '' ) ) {
			$this->data['@type'] = 'Organization';
			$this->data['@id']   = $this->get_home_url() . '#organization';
			$this->data['name']  = WPSEO_Options::get( 'company_name' );
			$this->data['logo']  = WPSEO_Options::get( 'company_logo', '' );

			return;
		}
		$this->data = false;
	}

	/**
	 * Schema for Person.
	 */
	private function person() {
		if ( '' !== WPSEO_Options::get( 'person_name', '' ) ) {
			$this->data['@type'] = 'Person';
			$this->data['@id']   = '#person';
			$this->data['name']  = WPSEO_Options::get( 'person_name' );

			return;
		}
		$this->data = false;
	}

	/**
	 * Prepares the organization or person markup.
	 */
	private function prepare_organization_person_markup() {
		$this->fetch_social_profiles();

		$this->data = array(
			'@type'    => '',
			'url'      => $this->get_home_url(),
			'sameAs'   => $this->profiles,
		);
	}

	/**
	 * Retrieve the social profiles to display in the organization output.
	 *
	 * @since 1.8
	 *
	 * @link  https://developers.google.com/webmasters/structured-data/customize/social-profiles
	 */
	private function fetch_social_profiles() {
		$social_profiles = array(
			'facebook_site',
			'instagram_url',
			'linkedin_url',
			'plus-publisher',
			'myspace_url',
			'youtube_url',
			'pinterest_url',
		);
		foreach ( $social_profiles as $profile ) {
			if ( WPSEO_Options::get( $profile, '' ) !== '' ) {
				$this->profiles[] = WPSEO_Options::get( $profile );
			}
		}

		if ( WPSEO_Options::get( 'twitter_site', '' ) !== '' ) {
			$this->profiles[] = 'https://twitter.com/' . WPSEO_Options::get( 'twitter_site' );
		}
	}

	/**
	 * Retrieves the home URL.
	 *
	 * @return string
	 */
	private function get_home_url() {
		/**
		 * Filter: 'wpseo_json_home_url' - Allows filtering of the home URL for Yoast SEO's JSON+LD output.
		 *
		 * @api unsigned string
		 */
		return apply_filters( 'wpseo_json_home_url', WPSEO_Utils::home_url() );
	}

	/**
	 * Returns an alternate name if one was specified in the Yoast SEO settings.
	 */
	private function add_alternate_name() {
		if ( '' !== WPSEO_Options::get( 'alternate_website_name', '' ) ) {
			$this->data['alternateName'] = WPSEO_Options::get( 'alternate_website_name' );
		}
	}

	/**
	 * Adds the internal search JSON LD code to the homepage if it's not disabled.
	 *
	 * @link https://developers.google.com/structured-data/slsb-overview
	 *
	 * @return void
	 */
	private function internal_search_section() {
		/**
		 * Filter: 'disable_wpseo_json_ld_search' - Allow disabling of the json+ld output.
		 *
		 * @api bool $display_search Whether or not to display json+ld search on the frontend.
		 */
		if ( ! apply_filters( 'disable_wpseo_json_ld_search', false ) ) {
			/**
			 * Filter: 'wpseo_json_ld_search_url' - Allows filtering of the search URL for Yoast SEO.
			 *
			 * @api string $search_url The search URL for this site with a `{search_term_string}` variable.
			 */
			$search_url = apply_filters( 'wpseo_json_ld_search_url', $this->get_home_url() . '?s={search_term_string}' );

			$this->data['potentialAction'] = array(
				'@type'       => 'SearchAction',
				'target'      => $search_url,
				'query-input' => 'required name=search_term_string',
			);
		}
	}

	/**
	 * Returns the website name either from Yoast SEO's options or from the site settings.
	 *
	 * @since 2.1
	 *
	 * @return string
	 */
	private function get_website_name() {
		if ( '' !== WPSEO_Options::get( 'website_name', '' ) ) {
			return WPSEO_Options::get( 'website_name' );
		}

		return get_bloginfo( 'name' );
	}
}
