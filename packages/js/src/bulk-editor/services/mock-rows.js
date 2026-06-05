/**
 * TEMPORARY development response: one page of rows (20, matching the design's page size) until the list
 * endpoint feeds the table through the RemoteDataProvider. Remove together with its usage in the
 * bulk editor content component.
 */

const ITEMS = [
	[ "What Is SEO and How It Works", "what is seo", "What Is SEO? Complete Beginner's Guide (2026)", "Learn what SEO is, how it works, and how to optimize your website for higher rankings in search engines." ],
	[ "Keyword Research for Beginners", "keyword research", "Keyword Research Guide: Find the Best Keywords", "Discover how to do keyword research and find high-ranking opportunities for your website." ],
	[ "On-Page SEO Checklist", "on page seo", "On-Page SEO Checklist: Optimize Every Page", "Follow this on-page SEO checklist to improve rankings and boost organic traffic." ],
	[ "Technical SEO Basics", "technical seo", "Technical SEO Basics: Complete Guide", "Understand technical SEO fundamentals like crawling, indexing, and site performance." ],
	[ "Link Building Strategies That Work", "link building strategies", "10 Link Building Strategies That Actually Work", "Learn proven link building strategies to increase your domain authority and rankings." ],
	[ "SEO Content Writing Tips", "seo content writing", "SEO Content Writing: Tips to Rank Higher", "Improve your content writing skills with SEO strategies that drive traffic and engagement." ],
	[ "Local SEO Optimization Guide", "local seo", "Local SEO Guide: Rank Higher Locally", "Optimize your business for local search results and attract nearby customers." ],
	[ "SEO Audit Step-by-Step", "seo audit", "SEO Audit Guide: Step-by-Step Process", "Learn how to perform a complete SEO audit to identify and fix website issues." ],
	[ "Best SEO Tools Compared", "best seo tools", "Best SEO Tools Compared (2026 Edition)", "Compare the best SEO tools for keyword research, backlinks, and analytics." ],
	[ "How to Improve Organic Traffic", "increase organic traffic", "How to Increase Organic Traffic", "Discover actionable ways to boost your organic traffic and search visibility." ],
	[ "Image SEO Best Practices", "image seo", "Image SEO: Optimize Images for Search", "Learn how to optimize images for faster loading and better search rankings." ],
	[ "Internal Linking Explained", "internal linking", "Internal Linking: Boost Your Site Structure", "Use internal links strategically to spread link value and improve crawlability." ],
	[ "Core Web Vitals Guide", "core web vitals", "Core Web Vitals: Measure and Improve", "Understand Core Web Vitals and how to improve them for better user experience." ],
	[ "Structured Data and Schema", "structured data", "Structured Data: A Practical Schema Guide", "Add structured data to your pages to qualify for rich results in search." ],
	[ "Mobile SEO Essentials", "mobile seo", "Mobile SEO: Optimize for Mobile-First Indexing", "Make sure your site performs well on mobile devices and mobile-first indexing." ],
	[ "E-commerce SEO Tactics", "ecommerce seo", "E-commerce SEO: Tactics That Convert", "Optimize product and category pages to win organic traffic that converts." ],
	[ "Voice Search Optimization", "voice search", "Voice Search: Optimize for Spoken Queries", "Prepare your content for voice assistants and conversational search queries." ],
	[ "Content Pruning Strategy", "content pruning", "Content Pruning: Less Content, More Traffic", "Find and improve or remove underperforming content to lift overall site quality." ],
	[ "International SEO Setup", "international seo", "International SEO: hreflang Done Right", "Set up hreflang and site structure for multilingual and multi-regional sites." ],
	[ "SEO Reporting Basics", "seo reporting", "SEO Reporting: Metrics That Matter", "Build SEO reports around the metrics that actually show progress." ],
];

// Mark a couple of rows as non-published, like the design shows.
const STATUSES = { 3: "draft", 13: "pending" };

/**
 * @returns {import("../field-sets").BulkEditorRow[]} One page of mock rows.
 */
export const getMockRows = () => ITEMS.map( ( [ title, focusKeyphrase, seoTitle, metaDescription ], index ) => {
	const id = index + 1;

	return {
		id,
		title,
		status: STATUSES[ id ] ?? "publish",
		editLink: `post.php?post=${ id }&action=edit`,
		focusKeyphrase,
		seoTitle,
		metaDescription,
		socialTitle: title,
		socialDescription: metaDescription,
	};
} );
