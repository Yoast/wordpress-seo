<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\General
 *
 * @uses    Yoast_Form $yform Form object.
 */

$knowledge_graph_help = new WPSEO_Admin_Help_Panel(
	'search-appearance-knowledge-graph',
	__( 'Learn more about the knowledge graph setting', 'wordpress-seo' ),
	sprintf(
		/* translators: %1$s opens the link to the Yoast.com article about Google's Knowledge Graph, %2$s closes the link, */
		__( 'This data is shown as metadata in your site. It is intended to appear in %1$sGoogle\'s Knowledge Graph%2$s. You can be either an organization, or a person.', 'wordpress-seo' ),
		'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/1-p' ) ) . '" target="_blank" rel="noopener noreferrer">',
		'</a>'
	),
	'has-wrapper'
);
?>
<div class="tab-block">

	<h2 class="help-button-inline">
		<?php
		// phpcs:ignore WordPress.Security.EscapeOutput -- get_button_html() output is properly escaped.
		echo esc_html__( 'Knowledge Graph & Schema.org', 'wordpress-seo' ) . $knowledge_graph_help->get_button_html();
		?>
	</h2>
	<?php
	// phpcs:ignore WordPress.Security.EscapeOutput -- get_panel_html() output is properly escaped.
	echo $knowledge_graph_help->get_panel_html();

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
		if ( empty( $yoast_seo_company_name ) || empty( $yoast_seo_company_logo ) ) :
			?>
			<div id="knowledge-graph-company-warning"></div>
			<?php
		endif;

		$yform->textinput( 'company_name', __( 'Organization name', 'wordpress-seo' ), [ 'autocomplete' => 'organization' ] );
		$yform->hidden( 'company_logo', 'company_logo' );
		$yform->hidden( 'company_logo_id', 'company_logo_id' );
		?>
		<div id="yoast-organization-image-select"></div>
		<div id="wpseo-local-seo-upsell"></div>
	</div>
	<div id="knowledge-graph-person">
		<h3><?php esc_html_e( 'Personal info', 'wordpress-seo' ); ?></h3>

		<div id="wpseo-person-selector"></div>
		<div id="yoast-person-image-select"></div>
		<?php
		$yform->hidden( 'person_logo', 'person_logo' );
		$yform->hidden( 'person_logo_id', 'person_logo_id' );
		$yform->hidden( 'company_or_person_user_id', 'person_id' );
		?>
	</div>
</div>
