import classNames from "classnames";
import React, { useCallback, useState } from "react";
import Pagination from "../pagination";
import ContentTabs from ".";
import { CONTAINER_CLASS, PAGE_SIZE, PRODUCTS, TAB_LIST_CLASS } from "./constants";
import { ProductDetail, ProductMeta, ProductTabButton, TabList, getContent, getProductTabId } from "./demo-components";
import { component, factory, withMultiple } from "./docs";

export const Factory = {
	render: ( { as, className } ) => {
		const [ isOpen, setIsOpen ] = useState( false );
		const toggleOpen = useCallback( () => setIsOpen( ( open ) => ! open ), [] );

		return (
			<ContentTabs
				activeTab={ isOpen ? "factory-tab" : null }
				onTabChange={ toggleOpen }
				as={ as }
				className={ classNames( CONTAINER_CLASS, className ) }
			>
				<TabList className={ TAB_LIST_CLASS }>
					<ContentTabs.TabButton id="factory-tab">
						<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800 group-aria-[current=true]:yst-text-primary-500">{ PRODUCTS[ 0 ].title }</span>
						<ProductMeta product={ PRODUCTS[ 0 ] } className="yst-text-xs yst-text-slate-500 group-aria-[current=true]:yst-text-slate-600" />
					</ContentTabs.TabButton>
				</TabList>
				{ isOpen && (
					<ContentTabs.Panel className="yst-flex-1">
						<ProductDetail product={ PRODUCTS[ 0 ] } />
					</ContentTabs.Panel>
				) }
			</ContentTabs>
		);
	},
	parameters: {
		docs: {
			description: {
				story: factory,
			},
			source: {
				transform: () => `
const [ isOpen, setIsOpen ] = useState( false );

<ContentTabs
	activeTab={ isOpen ? "detail-panel-tab" : null }
	onTabChange={ () => setIsOpen( ( open ) => ! open ) }
>
	<ul>
		<ContentTabs.TabButton id="detail-panel-tab">
			Click me to see a detail panel
		</ContentTabs.TabButton>
	</ul>
	{ isOpen && (
		<ContentTabs.Panel>
			{ /* The detail panel. */ }
		</ContentTabs.Panel>
	) }
</ContentTabs>
				`.trim(),
			},
		},
	},
	args: {
		as: "div",
		className: "",
	},
};

export const WithMultiple = {
	name: "With multiple tab buttons",
	render: () => {
		const [ selectedTabId, setSelectedTabId ] = useState( getProductTabId( "multiple", PRODUCTS[ 0 ] ) );
		const selectedProduct = PRODUCTS.find( ( product ) => getProductTabId( "multiple", product ) === selectedTabId );

		return (
			<ContentTabs activeTab={ selectedTabId } onTabChange={ setSelectedTabId } className={ CONTAINER_CLASS }>
				<TabList aria-label="Products" className={ TAB_LIST_CLASS }>
					{ PRODUCTS.map( ( product ) => (
						<ProductTabButton key={ product.id } product={ product } idPrefix="multiple" />
					) ) }
				</TabList>
				<ContentTabs.Panel className="yst-flex-1">
					{ getContent( selectedProduct, true ) }
				</ContentTabs.Panel>
			</ContentTabs>
		);
	},
	parameters: {
		docs: {
			description: {
				story: withMultiple,
			},
			source: {
				transform: () => `
const [ selectedId, setSelectedId ] = useState( products[ 0 ].id );
const selectedProduct = products.find( ( product ) => product.id === selectedId );

<ContentTabs activeTab={ selectedId } onTabChange={ setSelectedId }>
	<ul aria-label="Products">
		{ products.map( ( product ) => (
			<ContentTabs.TabButton key={ product.id } id={ product.id }>
				{ product.title }
			</ContentTabs.TabButton>
		) ) }
	</ul>
	<ContentTabs.Panel>
		{ /* A detail panel, a table, or a spec sheet — driven by selectedProduct. */ }
	</ContentTabs.Panel>
</ContentTabs>
				`.trim(),
			},
		},
	},
};

export const WithADisabledTab = {
	name: "With a disabled tab",
	render: () => (
		<ContentTabs defaultActiveTab={ PRODUCTS[ 0 ].id } className={ CONTAINER_CLASS }>
			<TabList className={ TAB_LIST_CLASS }>
				<ContentTabs.TabButton id={ PRODUCTS[ 0 ].id }>
					<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800 group-aria-[current=true]:yst-text-primary-500">{ PRODUCTS[ 0 ].title }</span>
					<ProductMeta product={ PRODUCTS[ 0 ] } className="yst-text-xs yst-text-slate-500 group-aria-[current=true]:yst-text-slate-600" />
				</ContentTabs.TabButton>
				<ContentTabs.TabButton id={ PRODUCTS[ 1 ].id } disabled={ true }>
					<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800">{ PRODUCTS[ 1 ].title }</span>
					<ProductMeta product={ PRODUCTS[ 1 ] } className="yst-text-xs yst-text-slate-500" />
				</ContentTabs.TabButton>
			</TabList>
			<ContentTabs.Panel className="yst-flex-1">
				<ProductDetail product={ PRODUCTS[ 0 ] } />
			</ContentTabs.Panel>
		</ContentTabs>
	),
	parameters: {
		docs: {
			source: {
				transform: () => `
<ContentTabs defaultActiveTab={ products[ 0 ].id }>
	<ul>
		<ContentTabs.TabButton id={ products[ 0 ].id }>
			{ products[ 0 ].title }
		</ContentTabs.TabButton>
		<ContentTabs.TabButton id={ products[ 1 ].id } disabled={ true }>
			{ products[ 1 ].title }
		</ContentTabs.TabButton>
	</ul>
	<ContentTabs.Panel>
		{ /* The first product's detail panel. */ }
	</ContentTabs.Panel>
</ContentTabs>
				`.trim(),
			},
		},
	},
};

export const WithPagination = {
	name: "With pagination",
	render: () => {
		const [ selectedTabId, setSelectedTabId ] = useState( getProductTabId( "paginated", PRODUCTS[ 0 ] ) );
		const [ page, setPage ] = useState( 1 );
		const selectedProduct = PRODUCTS.find( ( product ) => getProductTabId( "paginated", product ) === selectedTabId );
		const pageProducts = PRODUCTS.slice( ( page - 1 ) * PAGE_SIZE, page * PAGE_SIZE );

		return (
			<ContentTabs activeTab={ selectedTabId } onTabChange={ setSelectedTabId } className={ CONTAINER_CLASS }>
				<div className={ TAB_LIST_CLASS }>
					<TabList aria-label="Products">
						{ pageProducts.map( ( product ) => (
							<ProductTabButton key={ product.id } product={ product } idPrefix="paginated" />
						) ) }
					</TabList>
					<div className="yst-flex yst-justify-center yst-border-t yst-border-slate-200 yst-p-3">
						<Pagination
							current={ page }
							total={ Math.ceil( PRODUCTS.length / PAGE_SIZE ) }
							onNavigate={ setPage }
							screenReaderTextPrevious="Previous"
							screenReaderTextNext="Next"
						/>
					</div>
				</div>
				<ContentTabs.Panel className="yst-flex-1">
					{ getContent( selectedProduct, true ) }
				</ContentTabs.Panel>
			</ContentTabs>
		);
	},
	parameters: {
		docs: {
			source: {
				transform: () => `
const [ selectedId, setSelectedId ] = useState( products[ 0 ].id );
const [ page, setPage ] = useState( 1 );
const pageProducts = products.slice( ( page - 1 ) * PAGE_SIZE, page * PAGE_SIZE );

<ContentTabs activeTab={ selectedId } onTabChange={ setSelectedId }>
	<div>
		<ul aria-label="Products">
			{ pageProducts.map( ( product ) => (
				<ContentTabs.TabButton key={ product.id } id={ product.id }>
					{ product.title }
				</ContentTabs.TabButton>
			) ) }
		</ul>
		<Pagination current={ page } total={ totalPages } onNavigate={ setPage } ... />
	</div>
	<ContentTabs.Panel>
		{ /* A detail panel, a table, or a spec sheet — driven by selectedProduct. */ }
	</ContentTabs.Panel>
</ContentTabs>
				`.trim(),
			},
		},
	},
};

export default {
	title: "2) Components/Content tabs",
	component: ContentTabs,
	argTypes: {
		children: {
			control: { disable: true },
			type: { required: true },
			table: { type: { summary: "node" } },
		},
		activeTab: {
			control: { disable: true },
			table: { type: { summary: "string" } },
		},
		defaultActiveTab: {
			control: { disable: true },
			table: {
				type: { summary: "string" },
				defaultValue: { summary: null },
			},
		},
		onTabChange: {
			control: { disable: true },
			table: { type: { summary: "func" } },
		},
		as: {
			control: { type: "select" },
			options: [ "div", "section", "article" ],
			table: { type: { summary: "div | section | article" }, defaultValue: { summary: "div" } },
		},
		className: {
			control: "text",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "" },
			},
		},
	},
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				component,
			},
		},
	},
};
