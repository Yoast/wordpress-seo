import { noop } from "lodash";
import React, { useCallback, useState } from "react";
import Pagination from "../pagination";
import Table from "../../elements/table";
import ContentTabs from ".";

const PAGE_SIZE = 2;

const PRODUCT_IMAGES = {
	1: [
		{ id: 1, file: "sneakers-featured-main.jpg", altText: "A stylish sneaker with a modern design and vibrant colors." },
		{ id: 2, file: "sneakers-sixty-se7en.jpg", altText: "Sixty Se7en side view." },
		{ id: 3, file: "sneakers-iconic-on-feet.jpg", altText: "" },
	],
	2: [
		{ id: 4, file: "basketball-shoe-side.jpg", altText: "Retro basketball shoe side profile." },
		{ id: 5, file: "basketball-shoe-sole.jpg", altText: "" },
	],
	3: [
		{ id: 6, file: "earbuds-case-open.jpg", altText: "" },
		{ id: 7, file: "earbuds-in-hand.jpg", altText: "Wireless earbuds resting in an open palm." },
		{ id: 8, file: "earbuds-charging-case.jpg", altText: "" },
	],
	4: [
		{ id: 9, file: "coffee-mug-pour-over.jpg", altText: "Ceramic mug set up for pour-over brewing." },
	],
};

const PRODUCT_SPECS = {
	1: [
		{ label: "Material", value: "Leather & mesh" },
		{ label: "Weight", value: "310 g" },
	],
	2: [
		{ label: "Material", value: "Synthetic leather" },
		{ label: "Weight", value: "410 g" },
	],
	3: [
		{ label: "Battery life", value: "30 hours (with case)" },
		{ label: "Connectivity", value: "Bluetooth 5.3" },
	],
};

const PRODUCTS = [
	{
		id: 1,
		title: "Click me to see the detail panel",
		imageCount: 2,
		price: "€79.00",
		description: "An example of how the content area can be used to display more information.",
	},
	{
		id: 2,
		title: "Retro Basketball Shoe",
		imageCount: 5,
		missingAltCount: 0,
		description: "A high-top silhouette inspired by 90s courts, with padded ankle support.",
	},
	{
		id: 3,
		title: "Wireless Bluetooth Earbuds",
		imageCount: 3,
		missingAltCount: 2,
		price: "€59.00",
		description: "Compact true-wireless earbuds with active noise cancellation and a 30-hour battery case.",
	},
	{
		id: 4,
		title: "Ceramic Pour-Over Coffee Mug",
		imageCount: 1,
		missingAltCount: 0,
		price: "€18.00",
		description: "A hand-glazed ceramic mug with a wide base, built for pour-over brewing.",
	},
];

/**
 * The "N images [· M missing alt]" meta line, reused by the tab, the detail panel and the table.
 *
 * @param {Object} props                  The props.
 * @param {Object} props.product          The product ({ imageCount, missingAltCount }).
 * @param {string} [props.className=""]   Extra class name for the wrapping element.
 *
 * @returns {JSX.Element} The meta line.
 */
const ProductMeta = ( { product, className = "" } ) => (
	<span className={ `yst-flex yst-items-center yst-gap-1 ${ className }` }>
		<span>{ product.imageCount } images</span>
		{ product.missingAltCount > 0 && (
			<>
				<span className="yst-h-0.5 yst-w-0.5 yst-rounded-full yst-bg-current" aria-hidden="true" />
				<span className="yst-text-analysis-bad">{ product.missingAltCount } missing alt</span>
			</>
		) }
	</span>
);

/**
 * One product tab. Wraps its own `onSelect` call in a stable callback so the list above doesn't
 * need to hand an inline arrow function to `ContentTabs`.
 *
 * @param {Object}   props            The props.
 * @param {Object}   props.product    The product ({ id, title }).
 * @param {boolean}  props.isSelected Whether this product is selected.
 * @param {Function} props.onSelect   Called with the product id when this tab is clicked.
 * @param {string}   props.idPrefix   Prefix for the tab's id, so multiple examples on the same docs page don't clash.
 * @param {...any}   [props.rest]     Extra props (e.g. Storybook's `as`/`className` args), spread onto the item.
 *
 * @returns {JSX.Element} The tab.
 */
const ProductRow = ( { product, isSelected, onSelect, idPrefix, ...rest } ) => {
	const handleClick = useCallback( () => onSelect( product.id ), [ onSelect, product.id ] );

	return (
		<ContentTabs { ...rest } id={ `${ idPrefix }-content-tabs-${ product.id }` } isSelected={ isSelected } onClick={ handleClick }>
			<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800 group-aria-[current=true]:yst-text-primary-500">{ product.title }</span>
			<ProductMeta product={ product } className="yst-text-xs yst-text-slate-500 group-aria-[current=true]:yst-text-slate-600" />
		</ContentTabs>
	);
};

/**
 * The detail panel a selection drives — dummy content standing in for whatever a consumer would
 * show elsewhere on the page (e.g. the product's image gallery and fields).
 *
 * @param {Object} props         The props.
 * @param {Object} props.product The selected product ({ title, meta, price, description }).
 *
 * @returns {JSX.Element} The panel.
 */
const ProductDetail = ( { product } ) => (
	<div className="yst-flex-1 yst-space-y-2 yst-p-4">
		<div className="yst-flex yst-items-start yst-justify-between yst-gap-2">
			<span className="yst-text-sm yst-font-semibold yst-text-slate-800">{ product.title }</span>
			<span className="yst-text-sm yst-font-semibold yst-text-slate-800">{ product.price }</span>
		</div>
		<ProductMeta product={ product } className="yst-text-xs yst-text-slate-500" />
		<p className="yst-text-sm yst-text-slate-600">{ product.description }</p>
	</div>
);

/**
 * The per-image table a selection can drive instead of a freeform detail panel — mirrors the
 * design's file/alt-text table, minus the checkbox and thumbnail columns.
 *
 * @param {Object} props         The props.
 * @param {Object} props.product The selected product ({ id, title }).
 *
 * @returns {JSX.Element} The table.
 */
const ProductImagesTable = ( { product } ) => (
	<div className="yst-flex-1 yst-overflow-hidden">
		<div className="yst-space-y-1 yst-p-4">
			<span className="yst-block yst-text-sm yst-font-semibold yst-text-slate-800">{ product.title }</span>
			<ProductMeta product={ product } className="yst-text-xs yst-text-slate-500" />
		</div>
		<div className="[&_.yst-table-wrapper]:yst-rounded-none [&_.yst-table-wrapper]:yst-shadow-none [&_.yst-table-wrapper]:yst-ring-0 [&_.yst-table-header]:!yst-rounded-none [&_.yst-table-cell]:!yst-rounded-none">
			<Table>
				<Table.Head>
					<Table.Row>
						<Table.Header>File / Location</Table.Header>
						<Table.Header>Alt text</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					{ ( PRODUCT_IMAGES[ product.id ] ?? [] ).map( ( image ) => (
						<Table.Row key={ image.id }>
							<Table.Cell>{ image.file }</Table.Cell>
							<Table.Cell>
								{ image.altText || <span className="yst-text-slate-400">No alt text yet</span> }
							</Table.Cell>
						</Table.Row>
					) ) }
				</Table.Body>
			</Table>
		</div>
	</div>
);

/**
 * A key/value spec sheet a selection can drive — a third, structurally distinct content shape
 * (alongside the freeform detail panel and the table), to show the content area isn't limited to
 * one layout.
 *
 * @param {Object} props         The props.
 * @param {Object} props.product The selected product ({ id, title }).
 *
 * @returns {JSX.Element} The spec sheet.
 */
const ProductSpecs = ( { product } ) => (
	<div className="yst-flex-1 yst-space-y-3 yst-p-4">
		<span className="yst-block yst-text-sm yst-font-semibold yst-text-slate-800">{ product.title }</span>
		<dl className="yst-space-y-1">
			{ ( PRODUCT_SPECS[ product.id ] ?? [] ).map( ( spec ) => (
				<div key={ spec.label } className="yst-flex yst-justify-between yst-gap-2 yst-text-sm">
					<dt className="yst-text-slate-500">{ spec.label }</dt>
					<dd className="yst-text-slate-800">{ spec.value }</dd>
				</div>
			) ) }
		</dl>
	</div>
);

/**
 * Which content shape each product's tab drives in the "With multiple" story: one freeform detail
 * panel, one table, one spec sheet — demonstrating that the content area isn't tied to a single
 * layout, even across tabs in the same list.
 */
const CONTENT_TYPE_BY_PRODUCT_ID = {
	1: "detail",
	2: "table",
	3: "specs",
};

/**
 * Resolves the content area for a product, given the story's `variant`. Only the "detail" variant
 * (the "With multiple" story) varies content per product via `CONTENT_TYPE_BY_PRODUCT_ID`; every
 * other variant that reaches here always shows the freeform detail panel.
 *
 * @param {string} variant The story variant.
 * @param {Object} product The product whose content area to render.
 *
 * @returns {JSX.Element} The content area.
 */
const getContent = ( variant, product ) => {
	const contentType = variant === "detail" ? CONTENT_TYPE_BY_PRODUCT_ID[ product.id ] : null;

	if ( contentType === "table" ) {
		return <ProductImagesTable product={ product } />;
	}
	if ( contentType === "specs" ) {
		return <ProductSpecs product={ product } />;
	}
	return <ProductDetail product={ product } />;
};

/**
 * One template shared by every story, switching content by `variant` (a Storybook-only arg, not a
 * real `ContentTabs` prop).
 *
 * @param {Object} props          The passed-through `ContentTabs` props.
 * @param {string} props.variant  Which content to show: "single" | "detail" | "disabled" | "paginated".
 *
 * @returns {JSX.Element} The example.
 */
const Template = ( { variant, ...props } ) => {
	const [ selectedId, setSelectedId ] = useState( PRODUCTS[ 0 ].id );
	const [ page, setPage ] = useState( 1 );
	const [ isOpen, setIsOpen ] = useState( false );
	const toggleOpen = useCallback( () => setIsOpen( ( open ) => ! open ), [] );
	const selectedProduct = PRODUCTS.find( ( product ) => product.id === selectedId );
	const pageProducts = variant === "paginated"
		? PRODUCTS.slice( ( page - 1 ) * PAGE_SIZE, page * PAGE_SIZE )
		: PRODUCTS;

	if ( variant === "single" ) {
		return (
			<div className="yst-flex yst-border yst-border-slate-200">
				<ul className="yst-w-72 yst-shrink-0 yst-overflow-hidden yst-border-e yst-border-slate-200">
					<ContentTabs { ...props } onClick={ toggleOpen } />
				</ul>
				{ isOpen && <ProductDetail product={ PRODUCTS[ 0 ] } /> }
			</div>
		);
	}

	const rows = variant === "disabled"
		? (
			<>
				<ContentTabs { ...props } id="content-tabs-disabled-example-active" isSelected={ true } onClick={ noop }>
					<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800 group-aria-[current=true]:yst-text-primary-500">{ PRODUCTS[ 0 ].title }</span>
					<ProductMeta product={ PRODUCTS[ 0 ] } className="yst-text-xs yst-text-slate-500 group-aria-[current=true]:yst-text-slate-600" />
				</ContentTabs>
				<ContentTabs { ...props } id="content-tabs-disabled-example-disabled" disabled={ true } onClick={ noop }>
					<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800">{ PRODUCTS[ 1 ].title }</span>
					<ProductMeta product={ PRODUCTS[ 1 ] } className="yst-text-xs yst-text-slate-500" />
				</ContentTabs>
			</>
		)
		: pageProducts.map( ( product ) => (
			<ProductRow
				{ ...props }
				key={ product.id }
				product={ product }
				isSelected={ product.id === selectedId }
				onSelect={ setSelectedId }
				idPrefix={ variant }
			/>
		) );

	const content = getContent( variant, variant === "disabled" ? PRODUCTS[ 0 ] : selectedProduct );

	return (
		<div className="yst-flex yst-border yst-border-slate-200">
			<div className="yst-w-72 yst-shrink-0 yst-overflow-hidden yst-border-e yst-border-slate-200">
				<ul aria-label="Products">
					{ rows }
				</ul>
				{ variant === "paginated" && (
					<div className="yst-flex yst-justify-center yst-border-t yst-border-slate-200 yst-p-3">
						<Pagination
							current={ page }
							total={ Math.ceil( PRODUCTS.length / PAGE_SIZE ) }
							onNavigate={ setPage }
							screenReaderTextPrevious="Previous"
							screenReaderTextNext="Next"
						/>
					</div>
				) }
			</div>
			{ content }
		</div>
	);
};
Template.displayName = "ContentTabs";

export const Factory = {
	args: {
		variant: "single",
		children: (
			<>
				<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800 group-aria-[current=true]:yst-text-primary-500">{ PRODUCTS[ 0 ].title }</span>
				<ProductMeta product={ PRODUCTS[ 0 ] } className="yst-text-xs yst-text-slate-500 group-aria-[current=true]:yst-text-slate-600" />
			</>
		),
		isSelected: false,
		disabled: false,
	},
	parameters: {
		controls: { disable: false },
	},
};

export const WithMultiple = {
	name: "With multiple",
	args: {
		variant: "detail",
	},
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: "Each tab shows its own content here (a detail panel, a table, and a spec sheet), to show the content area isn't tied to a single layout, even across tabs in the same list.",
			},
		},
	},
};

export const WithADisabledTab = {
	name: "With a disabled tab",
	args: {
		variant: "disabled",
	},
	parameters: {
		controls: { disable: false },
	},
};

export const WithPagination = {
	name: "With pagination",
	args: {
		variant: "paginated",
	},
	parameters: {
		controls: { disable: false },
	},
};

export default {
	title: "2) Components/Content tabs",
	component: Template,
	argTypes: {
		as: {
			description: "The element to render the tab as.",
			options: [ "li", "div" ],
			table: { type: { summary: "elementType" }, defaultValue: { summary: "li" } },
		},
		children: {
			description: "The tab's content.",
			control: false,
			table: { type: { summary: "node" } },
		},
		isSelected: {
			description: "Whether this tab is the active/selected one.",
			control: "boolean",
			table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
		},
		disabled: {
			description: "Whether the tab is disabled.",
			control: "boolean",
			table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
		},
		className: {
			description: "Extra class name for the tab element.",
			control: "text",
			table: { type: { summary: "string" } },
		},
		variant: {
			control: false,
			table: { disable: true },
		},
	},
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				component: "A single selectable tab. Fully agnostic about its content, renders whatever markup you like as its children (a title, a meta line, badges, and so on). The component only owns the tab's background, hover/selected state, and trailing chevron. Stack several of the tabs in a plain `<ul>` or `<div>` to form a list — there is no dedicated list-wrapper component. Pagination composes the same way: page the underlying data and render `Pagination` alongside the stacked tabs, as shown in \"With pagination\".",
			},
		},
	},
};
