import React, { useCallback, useState } from "react";
import ContentTabs from ".";
import { PRODUCTS } from "./constants";
import { ProductDetail, ProductMeta, ProductTabButton, getContent, getProductTabId } from "./demo-components";
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
				className={ className }
			>
				<ContentTabs.TabList>
					<ContentTabs.TabButton id="factory-tab">
						<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800 group-aria-[current=true]:yst-text-primary-500">{ PRODUCTS[ 0 ].title }</span>
						<ProductMeta product={ PRODUCTS[ 0 ] } className="yst-text-xs yst-text-slate-500 group-aria-[current=true]:yst-text-slate-600" />
					</ContentTabs.TabButton>
				</ContentTabs.TabList>
				<ContentTabs.Content>
					<ContentTabs.Panel tabId="factory-tab" className="yst-flex-1">
						<ProductDetail product={ PRODUCTS[ 0 ] } />
					</ContentTabs.Panel>
				</ContentTabs.Content>
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
	<ContentTabs.TabList>
		<ContentTabs.TabButton id="detail-panel-tab">
			Click me to see a detail panel
		</ContentTabs.TabButton>
	</ContentTabs.TabList>
	<ContentTabs.Content>
		<ContentTabs.Panel tabId="detail-panel-tab">
			{ /* The detail panel. */ }
		</ContentTabs.Panel>
	</ContentTabs.Content>
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
	render: () => (
		<ContentTabs defaultActiveTab={ getProductTabId( "multiple", PRODUCTS[ 0 ] ) } className="yst-max-h-64">
			<ContentTabs.TabList aria-label="Products" >
				{ PRODUCTS.map( ( product ) => (
					<ContentTabs.TabButton id={ getProductTabId( "multiple", product ) } key={ product.id }>
						<ProductTabButton product={ product } />
					</ContentTabs.TabButton>
				) ) }
			</ContentTabs.TabList>
			<ContentTabs.Content>
				{ PRODUCTS.map( ( product ) => (
					<ContentTabs.Panel key={ product.id } tabId={ getProductTabId( "multiple", product ) }>
						{ getContent( product, true ) }
					</ContentTabs.Panel>
				) ) }
			</ContentTabs.Content>
		</ContentTabs>
	),
	parameters: {
		docs: {
			description: {
				story: withMultiple,
			},
			source: {
				transform: () => `
<ContentTabs defaultActiveTab={ products[ 0 ].id }>
	<ContentTabs.TabList aria-label="Products">
		{ products.map( ( product ) => (
			<ContentTabs.TabButton key={ product.id } id={ product.id }>
				{ product.title }
			</ContentTabs.TabButton>
		) ) }
	</ContentTabs.TabList>
	<ContentTabs.Content>
		{ products.map( ( product ) => (
			<ContentTabs.Panel key={ product.id } tabId={ product.id }>
				{ /* A detail panel, a table, or a spec sheet for this product. */ }
			</ContentTabs.Panel>
		) ) }
	</ContentTabs.Content>
</ContentTabs>
				`.trim(),
			},
		},
	},
};

export const WithADisabledTab = {
	name: "With a disabled tab",
	render: () => (
		<ContentTabs defaultActiveTab={ PRODUCTS[ 0 ].id }>
			<ContentTabs.TabList>
				<ContentTabs.TabButton id={ PRODUCTS[ 0 ].id }>
					<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800 group-aria-[current=true]:yst-text-primary-500">{ PRODUCTS[ 0 ].title }</span>
					<ProductMeta product={ PRODUCTS[ 0 ] } className="yst-text-xs yst-text-slate-500 group-aria-[current=true]:yst-text-slate-600" />
				</ContentTabs.TabButton>
				<ContentTabs.TabButton id={ PRODUCTS[ 1 ].id } disabled={ true }>
					<span className="yst-block yst-text-sm yst-font-medium yst-text-slate-800">{ PRODUCTS[ 1 ].title }</span>
					<ProductMeta product={ PRODUCTS[ 1 ] } className="yst-text-xs yst-text-slate-500" />
				</ContentTabs.TabButton>
			</ContentTabs.TabList>
			<ContentTabs.Content>
				<ContentTabs.Panel tabId={ PRODUCTS[ 0 ].id } className="yst-flex-1">
					<ProductDetail product={ PRODUCTS[ 0 ] } />
				</ContentTabs.Panel>
			</ContentTabs.Content>
		</ContentTabs>
	),
	parameters: {
		docs: {
			source: {
				transform: () => `
<ContentTabs defaultActiveTab={ products[ 0 ].id }>
	<ContentTabs.TabList>
		<ContentTabs.TabButton id={ products[ 0 ].id }>
			{ products[ 0 ].title }
		</ContentTabs.TabButton>
		<ContentTabs.TabButton id={ products[ 1 ].id } disabled={ true }>
			{ products[ 1 ].title }
		</ContentTabs.TabButton>
	</ContentTabs.TabList>
	<ContentTabs.Content>
		<ContentTabs.Panel tabId={ products[ 0 ].id }>
			{ /* The first product's detail panel. */ }
		</ContentTabs.Panel>
	</ContentTabs.Content>
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
