<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>' . esc_html__( 'Website name', 'wordpress-seo' ) . '</h2>';
?>
<p>
	<?php
	esc_html_e( 'Google shows your website\'s name in the search results, we will default to your site name but you can adapt it here. You can also provide an alternate website name you want Google to consider.', 'wordpress-seo' );
	?>
</p>
<?php
$yform->textinput( 'website_name', __( 'Website name', 'wordpress-seo' ), array( 'placeholder' => get_bloginfo( 'name' ) ) );
$yform->textinput( 'alternate_website_name', __( 'Alternate name', 'wordpress-seo' ) );

echo '<h2>' . esc_html__( 'Company or person', 'wordpress-seo' ) . '</h2>';
?>
<p>
	<?php
	printf(
		/* translators: %1$s opens the link to the Yoast.com article about Google's Knowledge Graph, %2$s closes the link */
		esc_html__( 'This data is shown as metadata in your site. It is intended to appear in %1$sGoogle\'s Knowledge Graph%2$s. You can be either a company, or a person, choose either:', 'wordpress-seo' ),
		'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/1-p' ) ) . '" target="_blank" rel="noopener noreferer">',
		'</a>'
	);
	?>
</p>
<?php
$yform->select( 'company_or_person', __( 'Company or person', 'wordpress-seo' ), array(
	''        => __( 'Choose whether you\'re a company or person', 'wordpress-seo' ),
	'company' => __( 'Company', 'wordpress-seo' ),
	'person'  => __( 'Person', 'wordpress-seo' ),
) );
?>

<div id="knowledge-graph-company">
	<h3><?php esc_html_e( 'Company', 'wordpress-seo' ); ?></h3>
	<?php
	$yform->textinput( 'company_name', __( 'Company name', 'wordpress-seo' ) );
	$yform->media_input( 'company_logo', __( 'Company logo', 'wordpress-seo' ) );
	?>
</div>

<div id="knowledge-graph-person">
	<h3><?php esc_html_e( 'Person', 'wordpress-seo' ); ?></h3>
	<?php $yform->textinput( 'person_name', __( 'Your name', 'wordpress-seo' ) ); ?>
</div>
