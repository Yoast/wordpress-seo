<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\General
 *
 * @uses Yoast_Form $yform Form object.
 */

$knowledge_graph_help = new WPSEO_Admin_Help_Panel(
	'search-appearance-knowledge-graph',
	__( 'Learn more about the knowledge graph setting', 'wordpress-seo' ),
	sprintf(
		/* translators: %1$s opens the link to the Yoast.com article about Google's Knowledge Graph, %2$s closes the link, */
		__( 'This data is shown as metadata in your site. It is intended to appear in %1$sGoogle\'s Knowledge Graph%2$s. You can be either a company, or a person.', 'wordpress-seo' ),
		'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/1-p' ) ) . '" target="_blank" rel="noopener noreferrer">',
		'</a>'
	),
	'has-wrapper'
);
?>
<div class="tab-block">
	<h2 class="help-button-inline"><?php echo esc_html__( 'Knowledge Graph', 'wordpress-seo' ) . $knowledge_graph_help->get_button_html(); ?></h2>
	<?php
	echo $knowledge_graph_help->get_panel_html();
	$yoast_free_kg_select_options = array(
		''        => __( 'Choose whether you\'re a company or person', 'wordpress-seo' ),
		'company' => __( 'Company', 'wordpress-seo' ),
		'person'  => __( 'Person', 'wordpress-seo' ),
	);
	$yform->select( 'company_or_person', __( 'Company or person', 'wordpress-seo' ), $yoast_free_kg_select_options, 'styled' );
	?>
	<div id="knowledge-graph-company">
		<h3><?php esc_html_e( 'Company', 'wordpress-seo' ); ?></h3>
		<?php
		$yform->textinput( 'company_name', __( 'Company name', 'wordpress-seo' ), array( 'autocomplete' => 'organization' ) );
		$yform->media_input( 'company_logo', __( 'Company logo', 'wordpress-seo' ) );
		?>
	</div>
	<div id="knowledge-graph-person">
		<h3><?php esc_html_e( 'Person', 'wordpress-seo' ); ?></h3>
		<?php $yform->textinput( 'person_name', __( 'Your name', 'wordpress-seo' ), array( 'autocomplete' => 'name' ) ); ?>
	</div>
</div>
