<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Views
 */

/*
 * @var array  $redirect_types
 * @var string $old_url
 * @var string $origin_label_value
 */
?>
<div class="redirect_form_row" id="row-wpseo_redirects_type">
	<label class='textinput' for='<?php echo esc_attr( 'wpseo_redirects_type' . $input_suffix ); ?>'>
		<span class="title"><?php echo esc_html_x( 'Type', 'noun', 'wordpress-seo-premium' ); ?></span>
	</label>
	<select name='wpseo_redirects_type' id='<?php echo esc_attr( 'wpseo_redirects_type' . $input_suffix ); ?>' class='select'>
		<?php
		// Loop through the redirect types.
		if ( count( $redirect_types ) > 0 ) {
			foreach ( $redirect_types as $type => $desc ) {
				echo '<option value="' . esc_attr( $type ) . '"' . sprintf( $values['type'], $type ) . '>' . esc_html( $desc ) . '</option>' . "\n";
			}
		}
		?>
	</select>
</div>

<p class="label desc description wpseo-redirect-clear">
	<?php
	printf(
		/* translators: 1: opens a link to a related knowledge base article. 2: closes the link. */
		esc_html__( 'The redirect type is the HTTP response code sent to the browser telling the browser what type of redirect is served. %1$sLearn more about redirect types%2$s.', 'wordpress-seo-premium' ),
		'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/2jb' ) . '" target="_blank">',
		'</a>'
	);
	?>
</p>

<div class='redirect_form_row' id="row-wpseo_redirects_origin">
	<label class='textinput' for='<?php echo esc_attr( 'wpseo_redirects_origin' . $input_suffix ); ?>'>
		<span class="title"><?php echo esc_html( $origin_label_value ); ?></span>
	</label>
	<input type='text' class='textinput' name='wpseo_redirects_origin' id='<?php echo esc_attr( 'wpseo_redirects_origin' . $input_suffix ); ?>' value='<?php echo esc_attr( $values['origin'] ); ?>' />
</div>
<br class='clear'/>

<div class="redirect_form_row wpseo_redirect_target_holder" id="row-wpseo_redirects_target">
	<label class='textinput' for='<?php echo esc_attr( 'wpseo_redirects_target' . $input_suffix ); ?>'>
		<span class="title"><?php esc_html_e( 'URL', 'wordpress-seo-premium' ); ?></span>
	</label>
	<input type='text' class='textinput' name='wpseo_redirects_target' id='<?php echo esc_attr( 'wpseo_redirects_target' . $input_suffix ); ?>' value='<?php echo esc_attr( $values['target'] ); ?>' />
</div>
<br class='clear'/>
