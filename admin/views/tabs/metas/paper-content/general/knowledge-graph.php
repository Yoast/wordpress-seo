<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\General
 *
 * @uses    Yoast_Form $yform Form object.
 */

echo '<h3>', esc_html__( 'Website', 'wordpress-seo' ), '</h3>';
echo '<p>', esc_html__( 'This name is shown for your site in the search results.', 'wordpress-seo' ), '</p>';
$yform->textinput(
	'website_name',
	__( 'Website name', 'wordpress-seo' ),
	[
		'placeholder'  => \get_bloginfo( 'name' ),
	]
);

$yform->textinput(
	'alternate_website_name',
	__( 'Alternate website name', 'wordpress-seo' )
);
echo '<p style="margin-bottom: 2em;">', esc_html__( 'Use the alternate website name for acronyms, or a shorter version of your website\'s name.', 'wordpress-seo' ), '</p>';

echo '<h3>', esc_html__( 'Organization or Person', 'wordpress-seo' ), '</h3>';
echo '<p>', sprintf(
	/* translators: %1$s opens the link to the Yoast.com article about Google's Knowledge Graph, %2$s closes the link, */
	esc_html__( 'This data is shown as metadata in your site. It is intended to appear in %1$sGoogle\'s Knowledge Graph%2$s. You can be either an organization, or a person.', 'wordpress-seo' ),
	'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/1-p' ) ) . '" target="_blank" rel="noopener noreferrer">',
	'</a>'
), '</p>';

/**
 * Retrieve the site logo ID from WordPress settings.
 *
 * @return false|int
 */
function fallback_to_site_logo() {
	$logo_id = \get_option( 'site_logo' );
	if ( ! $logo_id ) {
		$logo_id = \get_theme_mod( 'custom_logo' );
	}

	return $logo_id;
}

/**
 * Filter: 'wpseo_knowledge_graph_setting_msg' - Allows adding a message above these settings.
 *
 * @api string unsigned Message.
 */
$message = apply_filters( 'wpseo_knowledge_graph_setting_msg', '' );
if ( ! empty( $message ) ) {
	echo '<p><strong>', esc_html( $message ), '</strong></p>';
}
?>
<p>
	<?php esc_html_e( 'Choose whether the site represents an organization or a person.', 'wordpress-seo' ); ?>
</p>
<?php
$yoast_free_kg_select_options = [
	'company' => __( 'Organization', 'wordpress-seo' ),
	'person'  => __( 'Person', 'wordpress-seo' ),
];
$yform->select( 'company_or_person', __( 'Organization or person', 'wordpress-seo' ), $yoast_free_kg_select_options, 'styled', false );
?>
<div id="knowledge-graph-company">
	<h3><?php esc_html_e( 'Organization', 'wordpress-seo' ); ?></h3>
	<?php
	/*
	 * Render the `knowledge-graph-company-warning` div when the company name or logo are not set.
	 * This div is used as React render root in `js/src/search-appearance.js`.
	 */
	$yoast_seo_company_name = WPSEO_Options::get( 'company_name', '' );
	$yoast_seo_company_logo = WPSEO_Options::get( 'company_logo', '' );
	$yoast_seo_person_logo  = WPSEO_Options::get( 'person_logo', '' );

	$yoast_seo_site_name = ( WPSEO_Options::get( 'company_name', '' ) === '' ) ? get_bloginfo( 'name' ) : '';

	$fallback_logo = fallback_to_site_logo();

	if ( empty( $yoast_seo_company_logo ) && $fallback_logo ) {
		$yform->hidden( 'company_logo_fallback_id', 'company_logo_fallback_id', $fallback_logo );
	}

	if ( empty( $yoast_seo_company_name ) || empty( $yoast_seo_company_logo ) ) :
		?>
		<div id="knowledge-graph-company-warning"></div>
		<?php
	endif;

	$yform->textinput(
		'company_name',
		__( 'Organization name', 'wordpress-seo' ),
		[
			'autocomplete' => 'organization',
			'placeholder'  => $yoast_seo_site_name,
		]
	);
	$yform->textinput(
		'company_alternate_name',
		__( 'Alternate organization name', 'wordpress-seo' )
	);
	echo '<p>', esc_html__( 'Use the alternate organization name for acronyms, or a shorter version of your organization\'s name.', 'wordpress-seo' ), '</p>';
	$yform->hidden( 'company_logo', 'company_logo' );
	$yform->hidden( 'company_logo_id', 'company_logo_id' );
	?>
	<div id="yoast-organization-image-select"></div>
	<div id="wpseo-local-seo-upsell"></div>
</div>
<div id="knowledge-graph-person">
	<h3><?php esc_html_e( 'Personal info', 'wordpress-seo' ); ?></h3>

	<div id="wpseo-person-selector"></div>
	<?php

	if ( empty( $yoast_seo_person_logo ) ) :
		?>
	<div id="knowledge-graph-person-image-info"></div>
		<?php
	endif;
	?>

	<div id="yoast-person-image-select"></div>

	<?php

	$yform->hidden( 'person_logo', 'person_logo' );
	if ( empty( $yoast_seo_person_logo ) && $fallback_logo ) {
		$yform->hidden( 'person_logo_fallback_id', 'person_logo_fallback_id', $fallback_logo );
	}
	$yform->hidden( 'person_logo_id', 'person_logo_id' );
	$yform->hidden( 'company_or_person_user_id', 'person_id' );
	?>
</div>
