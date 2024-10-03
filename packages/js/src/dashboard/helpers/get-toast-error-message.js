import { __ } from "@wordpress/i18n";

export const getToastErrorMessage = ( alertType ) => {
	if ( alertType === "error" ) {
		return __( "This problem can't be hidden at this time. Please try again later.", "wordpress-seo" );
	}
	return __( "This notification can't be hidden at this time. Please try again later.", "wordpress-seo" );
};
