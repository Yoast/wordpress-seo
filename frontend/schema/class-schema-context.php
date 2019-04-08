<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Context variables for Schema generation.
 *
 * @property string $canonical           The current page's canonical.
 * @property string $company_name        Holds the company name, if the site represents a company.
 * @property int    $id                  The post ID, if there is one.
 * @property string $site_name           The site's name.
 * @property string $site_represents     Whether this site represents a `company` or a `person`.
 * @property string $site_url            The site's URL.
 * @property int    $site_user_id        The site's User ID if a site represents a `person`.
 * @property string $title               Page title.
 * @property string $description         Page description.
 * @property bool   $breadcrumbs_enabled Whether or not this site has breadcrumbs enabled.
 *
 * @since 10.2
 */
class WPSEO_Schema_Context {
	/**
	 * The current page's canonical.
	 *
	 * @var string
	 */
	public $canonical;
	/**
	 * Holds the company name, if the site represents a company.
	 *
	 * @var string
	 */
	public $company_name;
	/**
	 * The queried object ID, if there is one.
	 *
	 * @var int
	 */
	public $id;
	/**
	 * Whether this site represents a `company` or a `person`.
	 *
	 * @var string
	 */
	public $site_represents;
	/**
	 * The site's Name.
	 *
	 * @var string
	 */
	public $site_name;
	/**
	 * The site's URL.
	 *
	 * @var string
	 */
	public $site_url;
	/**
	 * Page title.
	 *
	 * @var string
	 */
	public $title;
	/**
	 * User ID when the site represents a Person.
	 *
	 * @var int
	 */
	public $site_user_id;
	/**
	 * Page description.
	 *
	 * @var string
	 */
	public $description;
	/**
	 * Whether or not this site has breadcrumbs enabled.
	 *
	 * @var bool
	 */
	public $breadcrumbs_enabled;

	/**
	 * Hash used for the Author `@id`.
	 */
	const AUTHOR_HASH = '#author';

	/**
	 * Hash used for the Author Logo's `@id`.
	 */
	const AUTHOR_LOGO_HASH = '#authorlogo';

	/**
	 * Hash used for the Breadcrumb's `@id`.
	 */
	const BREADCRUMB_HASH = '#breadcrumb';

	/**
	 * Hash used for the Person `@id`.
	 */
	const PERSON_HASH = '#person';

	/**
	 * Hash used for the Article `@id`.
	 */
	const ARTICLE_HASH = '#article';

	/**
	 * Hash used for the Organization `@id`.
	 */
	const ORGANIZATION_HASH = '#organization';

	/**
	 * Hash used for the Organization `@id`.
	 */
	const ORGANIZATION_LOGO_HASH = '#logo';

	/**
	 * Hash used for the logo `@id`.
	 */
	const PERSON_LOGO_HASH = '#personlogo';

	/**
	 * Hash used for an Article's primary image `@id`.
	 */
	const PRIMARY_IMAGE_HASH = '#primaryimage';

	/**
	 * Hash used for the WebPage's `@id`.
	 */
	const WEBPAGE_HASH = '#webpage';

	/**
	 * Hash used for the Website's `@id`.
	 */
	const WEBSITE_HASH = '#website';

	/**
	 * WPSEO_Schema_Context constructor.
	 */
	public function __construct() {
		$this->build_data();
	}

	/**
	 * Builds all the required data for the context object.
	 */
	private function build_data() {
		$this->breadcrumbs_enabled = current_theme_supports( 'yoast-seo-breadcrumbs' );
		if ( ! $this->breadcrumbs_enabled ) {
			$this->breadcrumbs_enabled = WPSEO_Options::get( 'breadcrumbs-enable', false );
		}

		$front             = WPSEO_Frontend::get_instance();
		$this->canonical   = $front->canonical( false );
		$this->title       = $front->title( '' );
		$this->description = $front->metadesc( false );

		$this->site_name       = $this->set_site_name();
		$this->site_represents = WPSEO_Options::get( 'company_or_person', '' );
		$this->site_url        = trailingslashit( WPSEO_Utils::home_url() );

		if ( $this->site_represents == 'company' ) {
			$this->company_name = WPSEO_Options::get( 'company_name' );
		}

		if ( $this->site_represents == 'person' ) {
			$this->site_user_id = WPSEO_Options::get( 'company_or_person_user_id', false );
		}

		$this->id = get_queried_object_id();
	}

	/**
	 * Retrieves the site's name from settings.
	 *
	 * @return string
	 */
	private function set_site_name() {
		if ( '' !== WPSEO_Options::get( 'website_name', '' ) ) {
			return WPSEO_Options::get( 'website_name' );
		}

		return get_bloginfo( 'name' );
	}
}
