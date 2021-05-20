/**
 * WordPress e2e utilities
 */
import {
	createNewPost,
	trashAllPosts,
	insertBlock,
} from "@wordpress/e2e-test-utils";

describe( "Yoast SEO blocks", () => {

	const title = "Test Post";

	beforeEach( async () => {
		await trashAllPosts();
	} );

	it( "shows correctly Yoast SEO FAQ block", async () => {
		await createNewPost( { title } );

		await insertBlock( "Yoast FAQ" );
		expect( 
			await page.$( '[data-type="yoast/faq-block"]' ) 
		).not.toBeNull();
	} );

	it( "shows correctly Yoast Breadcrumbs block", async () => {
		await createNewPost( { title } );

		await insertBlock( "Yoast Breadcrumbs" );
		expect( 
			await page.$( '[data-type="yoast-seo/breadcrumbs"]' ) 
		).not.toBeNull();
	} );

	it( "shows correctly Yoast How-to block", async () => {
		await createNewPost( { title } );

		await insertBlock( "Yoast How-to" );
		expect( 
			await page.$( '[data-type="yoast/how-to-block"]' ) 
		).not.toBeNull();
	} );

} );
