import { mockAnalysisData, mockDetailData, mockDetailMetadata, mockItemsData } from "../example-config";

export default {
	contentTypes: {
		products: {
			slug: "products",
			label: "Products",
			defaultSort: {
				column: "title",
				direction: "desc",
			},
			columns: [
				{
					key: "image",
					label: "Image",
					sortable: false,
					type: "thumbnail",
				},
				{
					key: "title",
					label: "Title",
					sortable: true,
					type: "",
				},
				{
					key: "date",
					label: "Date",
					sortable: true,
					type: "date",
				},
				{
					key: "seoScore",
					icon: <svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						stroke="none"
						fill="currentColor"
						className="yst-w-5 yst-h-5 yst-mx-auto yst-text-gray-500"
					>
						<path
							key="outerPath"
							d="M13.56 0H7a3.5 3.5 0 0 0-3.34 3.4v13.16A3.41 3.41 0 0 0 7.06 20h6.5A3.41 3.41 0 0 0 17 16.56V3.4A3.51 3.51 0 0 0 13.56 0zm1.9 16.08a2.37 2.37 0 0 1-2.35 2.37H7.52a2.37 2.37 0 0 1-2.35-2.37V3.86a2.37 2.37 0 0 1 2.35-2.37h5.59a2.37 2.37 0 0 1 2.35 2.37z"
						/>
						<circle key="circle1" cx="10.31" cy="9.98" r="2.15" />
						<circle key="circle2" cx="10.31" cy="4.69" r="2.15" />
						<circle key="circle3" cx="10.31" cy="15.31" r="2.15" />
					</svg>,
					label: "SEO score",
					sortable: false,
					type: "score",
				},
				{
					key: "readabilityScore",
					icon: <svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						stroke="none"
						fill="currentColor"
						className="yst-w-5 yst-h-5 yst-mx-auto yst-text-gray-500"
					>
						<path
							d="M2.42 19.81a.11.11 0 1 0 .19.1C5.75 14.5 8.88 17 13.17 14.17c-2.92 0-3.72-1.56-3.72-1.56a7 7 0 0 0 5.26.39c1-.8 2.79-2.64 2.93-6.59a3.44 3.44 0 0 1-2.42.29 4.81 4.81 0 0 0 2.4-1.7 5.85 5.85 0 0 0-2.74-5c.79 10.33-9.17 5.88-11.67 18.29A12.55 12.55 0 0 1 9 11.78c2.83-1.49 5.15-2.93 6-6.71-.64 4.56-2.7 6.25-5.55 7.53-2.66 1.2-5.39 2.68-7.03 7.21z"
						/>
					</svg>,
					label: "Readability score",
					sortable: false,
					type: "score",
				},
				{
					key: "seoTitle",
					label: "SEO title",
					sortable: false,
					type: "",
				},
				{
					key: "metaDescription",
					label: "Meta description",
					sortable: true,
					type: "",
				},
				{
					key: "focusKeyphrase",
					label: "Focus keyphrase",
					sortable: true,
					type: "",
				},
			],
			filters: [
				{
					key: "status",
					values: [ "all", "active", "draft", "archived" ],
				}, {
					key: "seoScore",
					values: [ "needsImprovement", "ok", "good", "noFocusKeyphrase", "noIndex" ],
				}, {
					key: "readabilityScore",
					values: [ "needsImprovement", "ok", "good" ],
				},
			],
		},
		productTags: {
			slug: "productTags",
			label: "Product Tags",
			defaultSort: {
				column: "date",
				direction: "desc",
			},
			columns: [
				{
					key: "image",
					label: "Image",
					sortable: false,
					type: "thumbnail",
				},
				{
					key: "title",
					label: "Title",
					sortable: true,
					type: "",
				},
				{
					key: "date",
					label: "Date",
					sortable: true,
					type: "date",
				},
				{
					key: "seoScore",
					icon: <svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						stroke="none"
						fill="currentColor"
						className="yst-w-5 yst-h-5 yst-mx-auto yst-text-gray-500"
					>
						<path
							key="outerPath"
							d="M13.56 0H7a3.5 3.5 0 0 0-3.34 3.4v13.16A3.41 3.41 0 0 0 7.06 20h6.5A3.41 3.41 0 0 0 17 16.56V3.4A3.51 3.51 0 0 0 13.56 0zm1.9 16.08a2.37 2.37 0 0 1-2.35 2.37H7.52a2.37 2.37 0 0 1-2.35-2.37V3.86a2.37 2.37 0 0 1 2.35-2.37h5.59a2.37 2.37 0 0 1 2.35 2.37z"
						/>
						<circle key="circle1" cx="10.31" cy="9.98" r="2.15" />
						<circle key="circle2" cx="10.31" cy="4.69" r="2.15" />
						<circle key="circle3" cx="10.31" cy="15.31" r="2.15" />
					</svg>,
					label: "SEO score",
					sortable: false,
					type: "score",
				},
				{
					key: "readabilityScore",
					icon: <svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						stroke="none"
						fill="currentColor"
						className="yst-w-5 yst-h-5 yst-mx-auto yst-text-gray-500"
					>
						<path
							d="M2.42 19.81a.11.11 0 1 0 .19.1C5.75 14.5 8.88 17 13.17 14.17c-2.92 0-3.72-1.56-3.72-1.56a7 7 0 0 0 5.26.39c1-.8 2.79-2.64 2.93-6.59a3.44 3.44 0 0 1-2.42.29 4.81 4.81 0 0 0 2.4-1.7 5.85 5.85 0 0 0-2.74-5c.79 10.33-9.17 5.88-11.67 18.29A12.55 12.55 0 0 1 9 11.78c2.83-1.49 5.15-2.93 6-6.71-.64 4.56-2.7 6.25-5.55 7.53-2.66 1.2-5.39 2.68-7.03 7.21z"
						/>
					</svg>,
					label: "Readability score",
					sortable: false,
					type: "score",
				},
				{
					key: "seoTitle",
					label: "SEO title",
					sortable: false,
					type: "",
				},
				{
					key: "metaDescription",
					label: "Meta description",
					sortable: true,
					type: "",
				},
				{
					key: "focusKeyphrase",
					label: "Focus keyphrase",
					sortable: true,
					type: "",
				},
			],
			filters: [
				{
					key: "status",
					values: [ "all", "active", "draft", "archived" ],
				}, {
					key: "seoScore",
					values: [ "needsImprovement", "ok", "good", "noFocusKeyphrase", "noIndex" ],
				}, {
					key: "readabilityScore",
					values: [ "needsImprovement", "ok", "good" ],
				},
			],
		},
		blogPosts: {
			slug: "blogPosts",
			label: "Blog posts",
			defaultSort: {
				column: "date",
				direction: "desc",
			},
			hasSchemaPageTypes: false,
			hasSchemaArticleTypes: false,
			hasAutomaticSchemaTypes: false,
			hasReadabilityAnalysis: false,
			hasSeoAnalysis: false,
			hasRelatedKeyphrases: false,
			hasCornerstone: false,
		},
	},
	handleQuery: jest.fn( query => {
		return {
			status: 200,
			data: {
				items: mockItemsData[ query.contentType ],
				after: "hash-to-request-more-items",
			},
		};
	} ),
	runAnalysis: jest.fn( () => {
		return {
			status: 200,
			data: mockAnalysisData,
		};
	} ),
	getDetail: jest.fn( () => {
		return {
			status: 200,
			data: mockDetailData,
			metadata: mockDetailMetadata,
		};
	} ),
};
