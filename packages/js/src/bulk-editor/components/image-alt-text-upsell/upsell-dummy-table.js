import FilterIcon from "@heroicons/react/outline/FilterIcon";
import ChevronRightIcon from "@heroicons/react/solid/ChevronRightIcon";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Table } from "@yoast/ui-library";
import classNames from "classnames";
import { DUMMY_ACTIVE_PRODUCT, DUMMY_IMAGES, DUMMY_PRODUCTS } from "./upsell-dummy-data";

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
 * The missing alt text count of a product.
 *
 * @param {number} count The number of images without alt text.
 *
 * @returns {string} The missing alt text count.
 */
const formatMissingAltCount = ( count ) => sprintf(
	/* translators: %d expands to the number of product images without alt text. */
	__( "%d missing alt", "wordpress-seo" ),
	count
);

/**
 * The image counts of a product.
 *
 * @param {Object} props The props.
 * @param {number} props.imageCount The number of product images.
 * @param {number} props.missingAltCount The number of those images without alt text.
 *
 * @returns {JSX.Element} The image counts.
 */
const ImageCounts = ( { imageCount, missingAltCount } ) => (
	<span className="yst-flex yst-items-center yst-gap-1 yst-text-xs yst-font-medium">
		<span className="yst-text-slate-500">{ formatImageCount( imageCount ) }</span>
		{ missingAltCount > 0 && (
			<>
				<span className="yst-text-slate-500">·</span>
				<span className="yst-text-red-600">{ formatMissingAltCount( missingAltCount ) }</span>
			</>
		) }
	</span>
);

/**
 * A checkbox that only looks the part.
 *
 * Borrows the ui-library's checkbox styling, but as a `span` rather than an input: nothing here is meant to be
 * operated, and a real input would need an id, a name and a disabled state that dims it out of step with the rest.
 *
 * @returns {JSX.Element} The checkbox shape.
 */
const DummyCheckbox = () => (
	<span className="yst-checkbox__input yst-block yst-border yst-bg-white" />
);

/**
 * The faded, non-interactive impression of the Yoast WooCommerce SEO image alt text tab shown behind the upsell.
 *
 * Purely decorative, so it borrows the ui-library's classes rather than its components: the shapes match the
 * add-on's tab without a single focusable element, which is what lets the `aria-hidden` wrapper stay valid.
 *
 * @returns {JSX.Element} The dummy table.
 */
export const DummyImageAltTextTable = () => (
	<div
		aria-hidden="true"
		className="yst-pointer-events-none yst-select-none yst-opacity-30 yst-overflow-hidden yst-rounded-lg yst-border yst-border-slate-300 yst-bg-white yst-shadow-sm"
	>
		<div className="yst-flex yst-justify-end yst-border-b yst-border-slate-300 yst-bg-slate-50 yst-p-3">
			<span className="yst-button yst-button--secondary yst-button--small yst-gap-1.5">
				{ __( "Filters", "wordpress-seo" ) }
				<FilterIcon className="yst-h-4 yst-w-4" />
			</span>
		</div>
		<div className="yst-content-tabs yst-border-none">
			<ul className="yst-content-tabs__tab-list">
				{ DUMMY_PRODUCTS.map( ( product, index ) => (
					<li key={ product.title } className="yst-content-tabs__tab">
						<span
							className={ classNames(
								"yst-content-tabs__button",
								index === 0 && "yst-content-tabs__button--selected"
							) }
						>
							<span className="yst-content-tabs__label yst-flex yst-flex-col yst-gap-1">
								<span
									className={ classNames(
										"yst-truncate yst-text-sm yst-font-medium",
										index === 0 ? "yst-text-primary-500" : "yst-text-slate-800"
									) }
								>
									{ product.title }
								</span>
								<ImageCounts imageCount={ product.imageCount } missingAltCount={ product.missingAltCount } />
							</span>
							<ChevronRightIcon className="yst-content-tabs__icon" />
						</span>
					</li>
				) ) }
			</ul>
			<div className="yst-content-tabs__content">
				<div className="yst-content-tabs__panel">
					<div className="yst-flex yst-flex-col yst-gap-2 yst-p-4">
						<div>
							<span className="yst-block yst-text-lg yst-font-medium yst-text-slate-900">{ DUMMY_ACTIVE_PRODUCT.title }</span>
							<ImageCounts imageCount={ DUMMY_ACTIVE_PRODUCT.imageCount } missingAltCount={ DUMMY_ACTIVE_PRODUCT.missingAltCount } />
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
					<Table className="yst-table-fixed yst-w-full">
						<Table.Head>
							<Table.Row>
								<Table.Header className="yst-table-checkbox-header"><DummyCheckbox /></Table.Header>
								<Table.Header className="yst-w-[72px] yst-px-1">{ __( "Image", "wordpress-seo" ) }</Table.Header>
								<Table.Header className="yst-max-w-72 yst-ps-3 yst-pe-2">{ __( "File / Location", "wordpress-seo" ) }</Table.Header>
								<Table.Header className="yst-min-w-64 yst-px-2">{ __( "Alternative text", "wordpress-seo" ) }</Table.Header>
								<Table.Header className="yst-w-20 yst-text-end">{ __( "Actions", "wordpress-seo" ) }</Table.Header>
							</Table.Row>
						</Table.Head>
						<Table.Body>
							{ DUMMY_IMAGES.map( ( image ) => (
								<Table.Row key={ image.fileName }>
									<Table.Cell className="yst-table-checkbox-cell"><DummyCheckbox /></Table.Cell>
									<Table.ImageCell cellProps={ { className: "yst-w-[72px] yst-px-1 yst-py-3" } } />
									<Table.Cell className="yst-max-w-72 yst-ps-3 yst-pe-2">
										<span className="yst-block yst-truncate yst-font-medium yst-text-slate-800">{ image.fileName }</span>
										<span className="yst-block yst-truncate yst-text-slate-600">{ image.path }</span>
									</Table.Cell>
									<Table.Cell className="yst-px-2 yst-text-slate-600">{ image.alt }</Table.Cell>
									<Table.Cell className="yst-ps-2">
										<div className="yst-flex yst-flex-col yst-items-end">
											<span className="yst-button yst-button--tertiary yst-button--small">{ __( "Edit", "wordpress-seo" ) }</span>
										</div>
									</Table.Cell>
								</Table.Row>
							) ) }
						</Table.Body>
					</Table>
				</div>
			</div>
		</div>
	</div>
);
