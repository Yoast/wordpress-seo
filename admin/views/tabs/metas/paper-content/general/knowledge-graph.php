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
		__( 'This data is shown as metadata in your site. It is intended to appear in %1$sGoogle\'s Knowledge Graph%2$s. You can be either a company, or a person.', 'wordpress-seo' ),
		'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/1-p' ) ) . '" target="_blank" rel="noopener noreferrer">',
		'</a>'
	),
	'has-wrapper'
);
?>
<div class="tab-block">
	<h2 class="help-button-inline"><?php echo esc_html__( 'Knowledge Graph', 'wordpress-seo' ) . $knowledge_graph_help->get_button_html(); ?></h2>
	<?php echo $knowledge_graph_help->get_panel_html(); ?>
	<p>
		<?php esc_html_e( 'Choose whether the site represents a company or a person.', 'wordpress-seo' ); ?>
	</p>
	<?php
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
		<h3><?php esc_html_e( 'Personal info', 'wordpress-seo' ); ?></h3>
		<?php
		$class = '';
		if ( WPSEO_Options::get( 'company_or_person' ) === 'person' && WPSEO_Options::get( 'company_or_person_user_id', false ) === false ) {
			$class = 'error';
			echo '<p class="error-message">';
			esc_html_e( 'Error: Please select a user below to make your site\'s meta data complete.', 'wordpress-seo' );
			echo '</p>';
		}
		$yform->label(
			__( 'Name', 'wordpress-seo' ) . ':',
			array(
				'for'   => 'person_id',
				'class' => 'select ' . $class,
			)
		);
		echo '<span class="yoast-styled-select">';
		$args = array(
			'show_option_none'        => __( 'Select a user', 'wordpress-seo' ),
			'hide_if_only_one_author' => false,
			'selected'                => WPSEO_Options::get( 'company_or_person_user_id', '-1' ),
			'name'                    => 'wpseo_titles[company_or_person_user_id]',
			'id'                      => 'person_id',
			'class'                   => $class,
		);
		wp_dropdown_users( $args );
		echo '</span>';
		if ( WPSEO_Options::get( 'company_or_person_user_id', false ) ) {
			$user = get_userdata( WPSEO_Options::get( 'company_or_person_user_id' ) );
			printf( esc_html__( 'You have selected the user %1$s as the person this site represents. Their user profile information will now be used in search results.', 'wordpress-seo' ), '<strong>' . $user->display_name . '</strong>' );
			echo ' <a href="', self_admin_url( 'user-edit.php?user_id=' . $user->ID ), '">', esc_html__( 'Update their profile to make sure the information is correct.', 'wordpress-seo' ), '</a>';
		}
		?>
	</div>
</div>
