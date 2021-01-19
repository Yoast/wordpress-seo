
export enum BlockValidation {
	Skipped = -2,
	Unknown = -1,
	Valid = 0,
	Invalid = 1,
	MissingAttribute = 2,
	MissingBlock = 3,
	TooMany = 4,
}
