/* global ajaxurl */

describe( "quick edit notifications", () => {
	it( "includes the notification nonce when polling after a slug change", () => {
		const handlers = {};
		const element = {
			length: 1,
			attr: jest.fn( key => key === "pathname" ? "/wp-admin/edit.php" : "edit-1" ),
			children: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			find: jest.fn().mockReturnThis(),
			html: jest.fn().mockReturnValue( "old-slug" ),
			val: jest.fn().mockReturnValue( "new-slug" ),
			on: jest.fn( ( event, callback ) => {
				handlers[ event ] = callback;
			} ),
		};
		global.jQuery = jest.fn().mockReturnValue( element );
		global.jQuery.post = jest.fn();
		global.ajaxurl = "/wp-admin/admin-ajax.php";
		global.wpseoAdminGlobalL10n = { notificationsNonce: "notification-nonce" };

		jest.isolateModules( () => {
			require( "../src/quick-edit-handler" );
		} );
		handlers.click( { target: {} } );

		expect( global.jQuery.post ).toHaveBeenCalledWith(
			ajaxurl,
			{
				action: "yoast_get_notifications",
				nonce: "notification-nonce",
				version: 2,
			},
			expect.any( Function )
		);
	} );
} );
