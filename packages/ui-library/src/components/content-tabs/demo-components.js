import React from "react";
import Table from "../../elements/table";
import ContentTabs from ".";
import { CONTENT_TYPE_BY_PRODUCT_ID, PRODUCT_SPECS, PRODUCT_VARIANTS } from "./constants";

/**
 * A `<ul>` for wrapping `ContentTabs.TabButton`s, with `role="list"`.
 * Rendered through a variable tag, which only inspects statically-known tag names, doesn't flag
 * the role as redundant on a plain `<ul>`.
 *
 * @param {React.ReactNode} children The tabs.
 * @param {...any} [props]           Extra props, spread onto the `<ul>`.
 *
 * @returns {JSX.Element} The list.
 */
export const TabList = ( { children, ...props } ) => {
	const Component = "ul";
	return <Component role="list" { ...props }>{ children }</Component>;
};

/**
 * The "N images [· M missing alt]" meta line, reused by the tab, the detail panel and the table.
 *
 * @param {Object} props                  The props.
 * @param {Object} props.product          The product ({ imageCount, missingAltCount }).
 * @param {string} [props.className=""]   Extra class name for the wrapping element.
 *
 * @returns {JSX.Element} The meta line.
 */
export const ProductMeta = ( { product, className = "" } ) => (
	<span className={ `yst-flex yst-items-center yst-gap-1 ${ className }` }>
		<span>{ product.imageCount } images</span>
		{ product.missingAltCount > 0 && (
			<>
				<span className="yst-h-0.5 yst-w-0.5 yst-rounded-full yst-bg-current" aria-hidden="true" />
				<span className="yst-text-red-800">{ product.missingAltCount } missing alt</span>
			</>
		) }
	</span>
);

/**
 * A product's tab id, prefixed so multiple stories on the same docs page don't clash. This is the
 * single source of truth for that id — used both for the rendered tab and for matching a story's
 * `selectedId` state back to a product, so the two can never drift out of sync.
 *
 * @param {string} idPrefix The story-specific prefix.
 * @param {Object} product  The product ({ id }).
 *
 * @returns {string} The tab id.
 */
export const getProductTabId = ( idPrefix, product ) => `${ idPrefix }-content-tabs-${ product.id }`;

/**
 * One product tab. `isSelected`/`onClick` are deliberately NOT passed here — `ContentTabs.TabButton`
 * derives both from the surrounding `ContentTabs`'s context.
 *
 * @param {Object} props            The props.
 * @param {Object} props.product    The product ({ id, title }).
 * @param {string} props.idPrefix   Prefix for the tab's id, so multiple examples on the same docs page don't clash.
 *
 * @returns {JSX.Element} The tab.
 */
export const ProductTabButton = ( { product, idPrefix } ) => (
	<ContentTabs.TabButton id={ getProductTabId( idPrefix, product ) }>
		<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800 group-aria-[current=true]:yst-text-primary-500">{ product.title }</span>
		<ProductMeta product={ product } className="yst-text-xs yst-text-slate-500 group-aria-[current=true]:yst-text-slate-600" />
	</ContentTabs.TabButton>
);

/**
 * The detail panel a selection drives — dummy content standing in for whatever a consumer would
 * show elsewhere on the page. The panel is a fully independent slot, not required to echo the tab's label.
 *
 * @param {Object} props         The props.
 * @param {Object} props.product The selected product ({ panelTitle, imageCount, missingAltCount, price, description }).
 *
 * @returns {JSX.Element} The panel.
 */
export const ProductDetail = ( { product } ) => (
	<div className="yst-space-y-2 yst-p-4">
		<div className="yst-flex yst-items-start yst-justify-between yst-gap-2">
			<span className="yst-text-sm yst-font-semibold yst-text-slate-800">{ product.panelTitle }</span>
			<span className="yst-text-sm yst-font-semibold yst-text-slate-800">{ product.price }</span>
		</div>
		<ProductMeta product={ product } className="yst-text-xs yst-text-slate-500" />
		<p className="yst-text-sm yst-text-slate-600">{ product.description }</p>
	</div>
);

/**
 * A table a selection can drive instead of a freeform detail panel.
 *
 * @param {Object} props         The props.
 * @param {Object} props.product The selected product ({ id, panelTitle, imageCount, missingAltCount }).
 *
 * @returns {JSX.Element} The table.
 */
export const ProductTable = ( { product } ) => (
	<div className="yst-overflow-hidden">
		<div className="yst-space-y-1 yst-p-4">
			<span className="yst-block yst-text-sm yst-font-semibold yst-text-slate-800">{ product.panelTitle }</span>
			<ProductMeta product={ product } className="yst-text-xs yst-text-slate-500" />
		</div>
		<div className="[&_.yst-table-wrapper]:yst-rounded-none [&_.yst-table-wrapper]:yst-shadow-none [&_.yst-table-wrapper]:yst-ring-0 [&_.yst-table-header]:!yst-rounded-none [&_.yst-table-cell]:!yst-rounded-none">
			<Table>
				<Table.Head>
					<Table.Row>
						<Table.Header>Size</Table.Header>
						<Table.Header>Availability</Table.Header>
						<Table.Header>Price</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					{ ( PRODUCT_VARIANTS[ product.id ] ?? [] ).map( ( variant ) => (
						<Table.Row key={ variant.id }>
							<Table.Cell>{ variant.size }</Table.Cell>
							<Table.Cell>{ variant.availability }</Table.Cell>
							<Table.Cell>{ variant.price }</Table.Cell>
						</Table.Row>
					) ) }
				</Table.Body>
			</Table>
		</div>
	</div>
);

/**
 * A key/value spec sheet a selection can drive, to show the content area isn't limited to
 * one layout.
 *
 * @param {Object} props         The props.
 * @param {Object} props.product The selected product ({ id, panelTitle }).
 *
 * @returns {JSX.Element} The spec sheet.
 */
export const ProductSpecs = ( { product } ) => (
	<div className="yst-space-y-3 yst-p-4">
		<span className="yst-block yst-text-sm yst-font-semibold yst-text-slate-800">{ product.panelTitle }</span>
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
 * Resolves the content area for a product. Used by the "With multiple tab buttons" and "With pagination" stories.
 *
 * @param {Object}  product The product whose content area to render.
 * @param {boolean} mixed   Whether to vary content per product via `CONTENT_TYPE_BY_PRODUCT_ID`.
 *
 * @returns {JSX.Element} The content area.
 */
export const getContent = ( product, mixed ) => {
	const contentType = mixed ? CONTENT_TYPE_BY_PRODUCT_ID[ product.id ] : null;

	if ( contentType === "table" ) {
		return <ProductTable product={ product } />;
	}
	if ( contentType === "specs" ) {
		return <ProductSpecs product={ product } />;
	}
	return <ProductDetail product={ product } />;
};
