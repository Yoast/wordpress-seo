import { noop } from "lodash";
import React, { useCallback, useState } from "react";
import Table from "../../elements/table";
import SelectableList from ".";

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
		{ id: 6, file: "running-shoe-front.jpg", altText: "Lightweight running shoe front view." },
	],
	4: [
		{ id: 7, file: "slip-on-top.jpg", altText: "" },
		{ id: 8, file: "slip-on-side.jpg", altText: "Casual slip-on side view." },
	],
};

const PRODUCTS = [
	{
		id: 1,
		title: "Classic Athletic Sneaker",
		imageCount: 4,
		missingAltCount: 2,
		price: "€79.00",
		description: "A timeless low-top sneaker with a cushioned sole, built for everyday wear.",
	},
	{
		id: 2,
		title: "Retro Basketball Shoe",
		imageCount: 5,
		missingAltCount: 0,
		price: "€95.00",
		description: "A high-top silhouette inspired by 90s courts, with padded ankle support.",
	},
	{
		id: 3,
		title: "Lightweight Running Shoe",
		imageCount: 3,
		missingAltCount: 1,
		price: "€110.00",
		description: "A breathable mesh upper paired with a responsive sole for daily mileage.",
	},
	{
		id: 4,
		title: "Casual Slip-On Sneaker",
		imageCount: 2,
		missingAltCount: 0,
		price: "€65.00",
		description: "An easy, laceless slip-on with a knit upper for all-day comfort.",
	},
];

/**
 * The "N images [· M missing alt]" meta line, reused by both the row and the detail panel.
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
 * One product row. Wraps its own `onSelect` call in a stable callback so the list above doesn't
 * need to hand an inline arrow function to `SelectableList.Item`.
 *
 * @param {Object}   props            The props.
 * @param {Object}   props.product    The product ({ id, title, meta }).
 * @param {boolean}  props.isSelected Whether this product is selected.
 * @param {Function} props.onSelect   Called with the product id when this row is clicked.
 * @param {string}   [props.idPrefix] Prefix for the row's id, so multiple examples on the same docs page don't clash.
 *
 * @returns {JSX.Element} The row.
 */
const ProductRow = ( { product, isSelected, onSelect, idPrefix = "" } ) => {
	const handleClick = useCallback( () => onSelect( product.id ), [ onSelect, product.id ] );

	return (
		<SelectableList.Item id={ `${ idPrefix }selectable-list-item-${ product.id }` } isSelected={ isSelected } onClick={ handleClick }>
			<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800 group-aria-[current=true]:yst-text-primary-500">{ product.title }</span>
			<ProductMeta product={ product } className="yst-text-xs yst-text-slate-500 group-aria-[current=true]:yst-text-slate-600" />
		</SelectableList.Item>
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
 * A controlled example: `SelectableList` itself holds no selection state, so a consumer tracks
 * which row is active and passes `isSelected`/`onClick` down to each `SelectableList.Item`. The
 * content area next to the list demonstrates the selection driving content shown elsewhere.
 *
 * @param {Object}   props           The props.
 * @param {Function} props.render    Called with the selected product; returns the content area.
 * @param {string}   [props.idPrefix] Prefix for each row's id (see `ProductRow`).
 *
 * @returns {JSX.Element} The example.
 */
const ControlledExample = ( { render, idPrefix } ) => {
	const [ selectedId, setSelectedId ] = useState( PRODUCTS[ 0 ].id );
	const selectedProduct = PRODUCTS.find( ( product ) => product.id === selectedId );

	return (
		<div className="yst-flex yst-border yst-border-slate-200">
			<div className="yst-w-72 yst-shrink-0 yst-overflow-hidden yst-border-e yst-border-slate-200">
				<SelectableList aria-label="Products">
					{ PRODUCTS.map( ( product ) => (
						<ProductRow
							key={ product.id }
							product={ product }
							isSelected={ product.id === selectedId }
							onSelect={ setSelectedId }
							idPrefix={ idPrefix }
						/>
					) ) }
				</SelectableList>
			</div>
			{ render( selectedProduct ) }
		</div>
	);
};

const renderProductDetail = ( product ) => <ProductDetail product={ product } />;
const renderProductImagesTable = ( product ) => <ProductImagesTable product={ product } />;

export const Factory = {
	render: () => <ControlledExample idPrefix="factory-" render={ renderProductDetail } />,
};

export const WithADisabledRow = {
	name: "With a disabled row",
	render: () => (
		<div className="yst-flex yst-border yst-border-slate-200">
			<div className="yst-w-72 yst-shrink-0 yst-overflow-hidden yst-border-e yst-border-slate-200">
				<SelectableList aria-label="Products">
					<SelectableList.Item id="selectable-list-item-disabled-example-active" isSelected={ true } onClick={ noop }>
						<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800 group-aria-[current=true]:yst-text-primary-500">{ PRODUCTS[ 0 ].title }</span>
						<ProductMeta product={ PRODUCTS[ 0 ] } className="yst-text-xs yst-text-slate-500 group-aria-[current=true]:yst-text-slate-600" />
					</SelectableList.Item>
					<SelectableList.Item id="selectable-list-item-disabled-example-disabled" disabled={ true } onClick={ noop }>
						<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800">{ PRODUCTS[ 1 ].title }</span>
						<ProductMeta product={ PRODUCTS[ 1 ] } className="yst-text-xs yst-text-slate-500" />
					</SelectableList.Item>
				</SelectableList>
			</div>
			<ProductDetail product={ PRODUCTS[ 0 ] } />
		</div>
	),
};

export const WithTableContent = {
	name: "With table content",
	render: () => <ControlledExample idPrefix="table-content-" render={ renderProductImagesTable } />,
};

export default {
	title: "2) Components/Selectable list",
	component: SelectableList,
	argTypes: {
		as: { options: [ "ul", "ol", "div" ] },
		className: { control: "text" },
	},
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				component: "A vertical list of selectable rows. Each `SelectableList.Item` is fully agnostic about its content and can render whatever markup you like as its children (a title, a meta line, badges, and so on); the component only owns the row's background, hover/selected state, and trailing chevron.",
			},
		},
	},
};
