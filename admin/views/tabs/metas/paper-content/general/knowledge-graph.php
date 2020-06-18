<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\General
 *
 * @uses    Yoast_Form $yform Form object.
 */

$knowledge_graph_help = new WPSEO_Admin_Help_Button(
	'https://yoa.st/3ye',
	__( 'Learn more about the knowledge graph setting', 'wordpress-seo' )
);
?>
<div class="tab-block yoast-feature">
	<h2 class="help-button-inline"><?php echo esc_html__( 'Knowledge Graph & Schema.org', 'wordpress-seo' ) . $knowledge_graph_help; ?></h2>
	<?php
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
		<?php endif; ?>

		<h3><?php esc_html_e( 'Organization', 'wordpress-seo' ); ?></h3>
		<?php
		$yform->textinput( 'company_name', __( 'Organization name', 'wordpress-seo' ), [ 'autocomplete' => 'organization' ] );
		$yform->media_input( 'company_logo', __( 'Organization logo', 'wordpress-seo' ) );
		?>
		<div id="wpseo-local-seo-upsell"></div>
	</div>
	<div id="knowledge-graph-person">
		<h3><?php esc_html_e( 'Personal info', 'wordpress-seo' ); ?></h3>
		<?php
		echo '<div id="wpseo-person-selector"></div>';
		$yform->media_input( 'person_logo', __( 'Person logo / avatar', 'wordpress-seo' ) );
		$yform->hidden( 'company_or_person_user_id', 'person_id' );
		?>
	</div>
</div>
