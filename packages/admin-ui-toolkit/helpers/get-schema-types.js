import { __ } from "@wordpress/i18n";

/**
 * Gets the Schema page types with their translations.
 * @returns {Object} The schema page types.
 */
export const getSchemaPageTypes = () => ( {
	WebPage: __( "Web Page", "admin-ui" ),
	ItemPage: __( "Item Page", "admin-ui" ),
	AboutPage: __( "About Page", "admin-ui" ),
	FAQPage: __( "FAQ Page", "admin-ui" ),
	QAPage: __( "QA Page", "admin-ui" ),
	ProfilePage: __( "Profile Page", "admin-ui" ),
	ContactPage: __( "Contact Page", "admin-ui" ),
	MedicalWebPage: __( "Medical Web Page", "admin-ui" ),
	CollectionPage: __( "Collection Page", "admin-ui" ),
	CheckoutPage: __( "Checkout Page", "admin-ui" ),
	RealEstateListing: __( "Real Estate Listing", "admin-ui" ),
	SearchResultsPage: __( "Search Results Page", "admin-ui" ),
} );

/**
 * Gets the Schema article types with their translations.
 * @returns {Object} The schema article types.
 */
export const getSchemaArticleTypes = () => ( {
	Article: __( "Article", "admin-ui" ),
	SocialMediaPosting: __( "Social Media Posting", "admin-ui" ),
	NewsArticle: __( "News Article", "admin-ui" ),
	AdvertiserContentArticle: __( "Advertiser Content Article", "admin-ui" ),
	SatiricalArticle: __( "Satirical Article", "admin-ui" ),
	ScholarlyArticle: __( "Scholarly Article", "admin-ui" ),
	TechArticle: __( "Tech Article", "admin-ui" ),
	Report: __( "Report", "admin-ui" ),
} );
