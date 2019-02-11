module.exports = [
	{
		"@type": "HowToStep",

		"attributes": [
			{
				"key": "@type",
				"type": "string",
				"source": "value",
				"value": "@HowToStep"
			},
			{
				"key": "position",
				"type": "number",
				"source": "position"
			},
			{
				"key": "text",
				"type": "string",
				"source": "valueBlock",
				"valueBlock": "FreeformBlocks"
			}
		]
	},
	{
		"@type": "HowToSection",
		blockLabel: "HowToSection",

		attributes: [
			{
				key: "@type",
				type: "string",
				source: "value",
				value: "@HowToSection",
			},
			{
				key: "name",
				type: "string",
				source: "input",
				input: "RichText",
			},
			{
				key: "position",
				type: "number",
				source: "position",
			},
			{
				key: "itemListElement",
				type: "array",
				source: "structuralBlock",
				"structuralBlocks": [ "HowToStep" ],
			},
		],

		editAreas: [
			{
				areaName: "step",
			},
		],
	},
	{
		"@type": "HowTo",
		blockLabel: "How to",

		attributes: [
			{
				key: "@type",
				type: "string",
				source: "value",
				value: "HowTo",
			},
			{
				key: "@id",
				type: "string",
				source: "identifier",
			},
			{
				key: "name",
				type: "string",
				source: "context",
				context: "post_title",
			},
			{
				key: "description",
				type: "string",
				source: "area",
				area: "main",
				childrenTypes: [ "Description" ],
			},
			{
				key: "estimatedCost",
				type: "object",
			},
			{
				key: "totalTime",
				type: "string",
				source: "area",
				area: "main",
				childrenTypes: [ "TotalTime" ],
			},
			{
				key: "tool",
				type: "array",
			},
			{
				key: "supply",
				type: "object",
			},
			{
				key: "step",
				type: "array",
				source: "area",
				area: "main",
				childrenTypes: [ "Steps" ],
			},
		],

		editTemplate: [
			"TotalTime",
			"Description",
			"Steps",
		],

		editAreas: [
			{
				areaName: "main",
			},
		],
	},
];
