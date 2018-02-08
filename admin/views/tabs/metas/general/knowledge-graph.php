<?php
/**
 * @package WPSEO\Admin\Views\General
 *
 * @var Yoast_Form $yform
 */
?>
<div class="tab-block">
	<h2><?php esc_html_e( 'Knowledge Graph', 'wordpress-seo' ); ?></h2>
	<p class="description">
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
</div>
