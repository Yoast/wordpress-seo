import FilterIcon from "@heroicons/react/outline/FilterIcon";
import ChevronRightIcon from "@heroicons/react/solid/ChevronRightIcon";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Table } from "@yoast/ui-library";
import classNames from "classnames";
import { DUMMY_ACTIVE_PRODUCT, DUMMY_IMAGES, DUMMY_PRODUCTS } from "./upsell-dummy-data";

/**
 * A drawn, non-interactive checkbox.
 *
 * @returns {JSX.Element} The checkbox lookalike.
 */
const FakeCheckbox = () => (
	<span className="yst-block yst-h-4 yst-w-4 yst-rounded yst-border yst-border-slate-300 yst-bg-white" />
);

/**
 * The image count of a product, e.g. "4 images".
 *
 * @param {number} count The number of images.
 *
 * @returns {string} The image count.
 */
const formatImageCount = ( count ) => sprintf(
	/* translators: %d expands to the number of product images. */
	_n( "%d image", "%d images", count, "wordpress-seo" ),
	count
);

/**
 * The faded, non-interactive impression of the Yoast WooCommerce SEO image alt text tab shown behind the upsell.
 *
 * Purely decorative: hidden from assistive technology, ignores pointer events and contains no focusable element.
 *
 * @returns {JSX.Element} The dummy table.
 */
export const DummyImageAltTextTable = () => (
	<div
		aria-hidden="true"
		className="yst-pointer-events-none yst-select-none yst-opacity-30 yst-mix-blend-luminosity yst-overflow-hidden yst-rounded-lg yst-border yst-border-slate-300 yst-bg-white yst-shadow-sm"
	>
		<div className="yst-flex yst-justify-end yst-border-b yst-border-slate-300 yst-bg-slate-50 yst-p-3">
			<span className="yst-inline-flex yst-items-center yst-gap-1.5 yst-rounded-md yst-border yst-border-slate-300 yst-bg-white yst-px-2.5 yst-py-1.5 yst-text-xs yst-font-medium yst-text-slate-800 yst-shadow-sm">
				{ __( "Filters", "wordpress-seo" ) }
				<FilterIcon className="yst-h-4 yst-w-4" />
			</span>
		</div>
		<div className="yst-flex">
			{ /* max-lg rather than hidden + lg:block: the ai-frontend stylesheet loads later and redefines .yst-hidden. */ }
			<ul className="yst-m-0 max-lg:yst-hidden yst-w-72 yst-shrink-0 yst-border-e yst-border-slate-300 yst-bg-slate-50">
				{ DUMMY_PRODUCTS.map( ( product, index ) => (
					<li
						key={ product.title }
						className={ classNames(
							"yst-flex yst-items-center yst-gap-2 yst-border-b yst-border-slate-200 yst-py-4 yst-ps-3 yst-pe-3",
							index === 0 && "yst-bg-slate-100"
						) }
					>
						<span className="yst-flex yst-min-w-0 yst-grow yst-flex-col yst-gap-1">
							<span className={ classNames( "yst-truncate yst-text-sm yst-font-medium", index === 0 ? "yst-text-primary-500" : "yst-text-slate-800" ) }>
								{ product.title }
							</span>
							<span className="yst-text-xs yst-font-medium yst-text-slate-500">{ formatImageCount( product.imageCount ) }</span>
						</span>
						<ChevronRightIcon className="yst-h-4 yst-w-4 yst-shrink-0 yst-text-slate-400 yst-icon-rtl" />
					</li>
				) ) }
			</ul>
			<div className="yst-min-w-0 yst-grow yst-overflow-hidden">
				<div className="yst-flex yst-flex-col yst-gap-2 yst-p-4">
					<div>
						<span className="yst-block yst-text-lg yst-font-medium yst-text-slate-900">{ DUMMY_ACTIVE_PRODUCT.title }</span>
						<span className="yst-flex yst-items-center yst-gap-1 yst-text-xs yst-font-medium">
							<span className="yst-text-slate-500">{ formatImageCount( DUMMY_ACTIVE_PRODUCT.imageCount ) }</span>
							<span className="yst-text-slate-500">·</span>
							<span className="yst-text-red-600">
								{ sprintf(
									/* translators: %d expands to the number of product images without alt text. */
									__( "%d missing alt", "wordpress-seo" ),
									DUMMY_ACTIVE_PRODUCT.missingAltCount
								) }
							</span>
						</span>
					</div>
					<div className="yst-flex yst-max-w-2xl yst-flex-col yst-gap-2">
						<span className="yst-text-sm yst-font-medium yst-text-slate-800">{ __( "Focus keyphrase", "wordpress-seo" ) }</span>
						<span className="yst-flex yst-h-10 yst-max-w-md yst-items-center yst-rounded-md yst-border yst-border-slate-300 yst-bg-white yst-px-3 yst-text-sm yst-text-slate-600 yst-shadow-sm">
							{ DUMMY_ACTIVE_PRODUCT.focusKeyphrase }
						</span>
						<span className="yst-text-sm yst-text-slate-600">
							{ __( "Use the main word or phrase you want your content found for across search, AI, and beyond.", "wordpress-seo" ) }
							{ " " }
							<span className="yst-underline yst-text-primary-500">
								{ __( "Learn more about best practices for product page keyphrases", "wordpress-seo" ) }
							</span>
							.
						</span>
					</div>
				</div>
				<Table variant="minimal">
					<Table.Head>
						<Table.Row>
							<Table.Header className="yst-w-12"><FakeCheckbox /></Table.Header>
							<Table.Header className="yst-w-20">{ __( "Image", "wordpress-seo" ) }</Table.Header>
							<Table.Header className="yst-w-72">{ __( "File / Location", "wordpress-seo" ) }</Table.Header>
							<Table.Header>{ __( "Alt text", "wordpress-seo" ) }</Table.Header>
							<Table.Header className="yst-text-end">{ __( "Actions", "wordpress-seo" ) }</Table.Header>
						</Table.Row>
					</Table.Head>
					<Table.Body>
						{ DUMMY_IMAGES.map( ( image ) => (
							<Table.Row key={ image.fileName }>
								<Table.Cell><FakeCheckbox /></Table.Cell>
								<Table.ImageCell />
								<Table.Cell>
									<span className="yst-block yst-truncate yst-font-medium yst-text-slate-800">{ image.fileName }</span>
									<span className="yst-block yst-truncate yst-text-slate-600">{ image.path }</span>
								</Table.Cell>
								<Table.Cell className="yst-text-slate-600">{ image.alt }</Table.Cell>
								<Table.Cell className="yst-text-end">
									<span className="yst-text-xs yst-font-medium yst-text-primary-500">{ __( "Edit", "wordpress-seo" ) }</span>
								</Table.Cell>
							</Table.Row>
						) ) }
					</Table.Body>
				</Table>
			</div>
		</div>
	</div>
);
