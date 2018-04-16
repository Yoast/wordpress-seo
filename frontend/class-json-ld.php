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
	 * @var array Holds the social profiles for the entity
	 */
	private $profiles = array();
	/**
	 * @var array Holds the data to put out
	 */
	private $data = array();

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_action( 'wpseo_head', array( $this, 'json_ld' ), 90 );
		add_action( 'wpseo_json_ld', array( $this, 'website' ), 10 );
		add_action( 'wpseo_json_ld', array( $this, 'organization_or_person' ), 20 );
	}

	/**
	 * JSON LD output function that the functions for specific code can hook into.
	 *
	 * @since 1.8
	 */
	public function json_ld() {
		do_action( 'wpseo_json_ld' );
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

		$this->output( $company_or_person );
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
		$this->data = array(
			'@context' => 'https://schema.org',
			'@type'    => 'WebSite',
			'@id'      => '#website',
			'url'      => $this->get_home_url(),
			'name'     => $this->get_website_name(),
		);

		$this->add_alternate_name();
		$this->internal_search_section();

		$this->output( 'website' );
	}

	/**
	 * Outputs the JSON LD code in a valid JSON+LD wrapper.
	 *
	 * @since 1.8
	 *
	 * @param string $context The context of the output, useful for filtering.
	 */
	private function output( $context ) {
		/**
		 * Filter: 'wpseo_json_ld_output' - Allows filtering of the JSON+LD output.
		 *
		 * @api array $output The output array, before its JSON encoded.
		 *
		 * @param string $context The context of the output, useful to determine whether to filter or not.
		 */
		$this->data = apply_filters( 'wpseo_json_ld_output', $this->data, $context );

		if ( is_array( $this->data ) && ! empty( $this->data ) ) {
			echo "<script type='application/ld+json'>", wp_json_encode( $this->data ), '</script>', "\n";
		}

		// Empty the $data array so we don't output it twice.
		$this->data = array();
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
			'@context' => 'https://schema.org',
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
