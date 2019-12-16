<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Structure
 */
class WPSEO_Configuration_Structure {

	/**
	 * Registered steps.
	 *
	 * @var array
	 */
	protected $steps = [];

	/**
	 * List of fields for each configuration step.
	 *
	 * This list does not include the fields for the 'postTypeVisibility'
	 * step as that list will be generated on the fly.
	 *
	 * @var array
	 */
	private $fields = [
		'environment_type' => [ 'environment_type' ],
		'siteType'         => [ 'siteType' ],
		'publishingEntity' => [
			'publishingEntity',
			'publishingEntityType',
			'publishingEntityCompanyInfo',
			'publishingEntityCompanyName',
			'publishingEntityCompanyLogo',
			'publishingEntityPersonId',
			'profileUrlFacebook',
			'profileUrlTwitter',
			'profileUrlInstagram',
			'profileUrlLinkedIn',
			'profileUrlMySpace',
			'profileUrlPinterest',
			'profileUrlYouTube',
			'profileUrlWikipedia',
		],
		'multipleAuthors'  => [ 'multipleAuthors' ],
		'titleTemplate'    => [
			'titleIntro',
			'siteName',
			'separator',
		],
		'newsletter'       => [
			'mailchimpSignup',
			'suggestions',
		],
		'success'          => [ 'successMessage' ],
	];

	/**
	 * WPSEO_Configuration_Structure constructor.
	 */
	public function initialize() {
		$this->add_step( 'environment-type', __( 'Environment', 'wordpress-seo' ), $this->fields['environment_type'] );
		$this->add_step( 'site-type', __( 'Site type', 'wordpress-seo' ), $this->fields['siteType'] );
		$this->add_step(
			'publishing-entity',
			__( 'Organization or person', 'wordpress-seo' ),
			$this->fields['publishingEntity']
		);

		$fields = [ 'postTypeVisibility' ];

		$post_type_factory = new WPSEO_Config_Factory_Post_Type();
		foreach ( $post_type_factory->get_fields() as $post_type_field ) {
			$fields[] = $post_type_field->get_identifier();
		}
		$this->add_step( 'post-type-visibility', __( 'Search engine visibility', 'wordpress-seo' ), $fields );

		$this->add_step(
			'multiple-authors',
			__( 'Multiple authors', 'wordpress-seo' ),
			$this->fields['multipleAuthors']
		);

		$this->add_step( 'title-template', __( 'Title settings', 'wordpress-seo' ), $this->fields['titleTemplate'] );
		$this->add_step( 'newsletter', __( 'Continue learning', 'wordpress-seo' ), $this->fields['newsletter'], true, true );
		$this->add_step( 'success', __( 'Success!', 'wordpress-seo' ), $this->fields['success'], true, true );
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
		$this->steps[ $identifier ] = [
			'title'          => $title,
			'fields'         => $fields,
			'hideNavigation' => ! (bool) $navigation,
			'fullWidth'      => $full_width,
		];
	}

	/**
	 * Retrieve the registered steps.
	 *
	 * @return array
	 */
	public function retrieve() {
		return $this->steps;
	}
}
