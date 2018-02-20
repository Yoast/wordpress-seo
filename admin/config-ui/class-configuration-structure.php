<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Structure
 */
class WPSEO_Configuration_Structure {

	/** @var array Registered steps */
	protected $steps = array();

	/**
	 * WPSEO_Configuration_Structure constructor.
	 */
	public function initialize() {
		$this->add_step( 'intro', __( 'Welcome!', 'wordpress-seo' ), array(
			'configurationChoices',
		), false, true );

		$this->add_step( 'environment_type', __( 'Environment', 'wordpress-seo' ), array( 'environment_type' ) );
		$this->add_step( 'siteType', __( 'Site type', 'wordpress-seo' ), array( 'siteType' ) );
		$this->add_step( 'publishingEntity', __( 'Company or person', 'wordpress-seo' ), array(
			'publishingEntity',
			'publishingEntityType',
			'publishingEntityCompanyName',
			'publishingEntityCompanyLogo',
			'publishingEntityPersonName',
		) );
		$this->add_step( 'profileUrls', __( 'Social profiles', 'wordpress-seo' ), array(
			'socialProfilesIntro',
			'profileUrlFacebook',
			'profileUrlTwitter',
			'profileUrlInstagram',
			'profileUrlLinkedIn',
			'profileUrlMySpace',
			'profileUrlPinterest',
			'profileUrlYouTube',
			'profileUrlGooglePlus',
		) );

		$fields = array( 'postTypeVisibility' );

		$post_type_factory = new WPSEO_Config_Factory_Post_Type();
		foreach ( $post_type_factory->get_fields() as $post_type_field ) {
			$fields[] = $post_type_field->get_identifier();
		}
		$this->add_step( 'postTypeVisibility', __( 'Search engine visibility', 'wordpress-seo' ), $fields );

		$this->add_step( 'multipleAuthors', __( 'Multiple authors', 'wordpress-seo' ), array( 'multipleAuthors' ) );
		$this->add_step( 'connectGoogleSearchConsole', __( 'Google Search Console', 'wordpress-seo' ), array(
			'googleSearchConsoleIntro',
			'connectGoogleSearchConsole',
		) );
		$this->add_step( 'titleTemplate', __( 'Title settings', 'wordpress-seo' ), array(
			'titleIntro',
			'siteName',
			'separator',
		) );

		$this->add_step( 'newsletter', __( 'Newsletter', 'wordpress-seo' ), array(
			'mailchimpSignup',
		), true, true );
		$this->add_step( 'suggestions', __( 'You might like', 'wordpress-seo' ), array(
			'suggestions',
		), true, true );
		$this->add_step( 'success', __( 'Success!', 'wordpress-seo' ), array(
			'successMessage',
		), true, true );
	}

	/**
	 * Add a step to the structure
	 *
	 * @param string $identifier Identifier for this step.
	 * @param string $title      Title to display for this step.
	 * @param array  $fields     Fields to use on the step.
	 * @param bool   $navigation Show navigation buttons.
	 * @param bool   $full_width Wheter the step content is full width or not.
	 */
	protected function add_step( $identifier, $title, $fields, $navigation = true, $full_width = false ) {
		$this->steps[ $identifier ] = array(
			'title'          => $title,
			'fields'         => $fields,
			'hideNavigation' => ! (bool) $navigation,
			'fullWidth'      => $full_width,
		);
	}

	/**
	 * Retrieve the registered steps
	 *
	 * @return array
	 */
	public function retrieve() {
		return $this->steps;
	}
}
