declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;
	export type CollectionEntry<C extends keyof AnyEntryMap> = Flatten<AnyEntryMap[C]>;

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"education": {
"education-1.md": {
	id: "education-1.md";
  slug: "education-1";
  body: string;
  collection: "education";
  data: any
} & { render(): Render[".md"] };
"education-2.md": {
	id: "education-2.md";
  slug: "education-2";
  body: string;
  collection: "education";
  data: any
} & { render(): Render[".md"] };
"education-3.md": {
	id: "education-3.md";
  slug: "education-3";
  body: string;
  collection: "education";
  data: any
} & { render(): Render[".md"] };
};
"experience": {
"experience-1.md": {
	id: "experience-1.md";
  slug: "experience-1";
  body: string;
  collection: "experience";
  data: any
} & { render(): Render[".md"] };
"experience-2.md": {
	id: "experience-2.md";
  slug: "experience-2";
  body: string;
  collection: "experience";
  data: any
} & { render(): Render[".md"] };
"experience-3.md": {
	id: "experience-3.md";
  slug: "experience-3";
  body: string;
  collection: "experience";
  data: any
} & { render(): Render[".md"] };
"experience-4.md": {
	id: "experience-4.md";
  slug: "experience-4";
  body: string;
  collection: "experience";
  data: any
} & { render(): Render[".md"] };
"experience-5.md": {
	id: "experience-5.md";
  slug: "experience-5";
  body: string;
  collection: "experience";
  data: any
} & { render(): Render[".md"] };
"experience-6.md": {
	id: "experience-6.md";
  slug: "experience-6";
  body: string;
  collection: "experience";
  data: any
} & { render(): Render[".md"] };
};
"knowledges": {
"index.md": {
	id: "index.md";
  slug: "index";
  body: string;
  collection: "knowledges";
  data: any
} & { render(): Render[".md"] };
};
"menu": {
"item-1.md": {
	id: "item-1.md";
  slug: "item-1";
  body: string;
  collection: "menu";
  data: any
} & { render(): Render[".md"] };
"item-2.md": {
	id: "item-2.md";
  slug: "item-2";
  body: string;
  collection: "menu";
  data: any
} & { render(): Render[".md"] };
"item-3.md": {
	id: "item-3.md";
  slug: "item-3";
  body: string;
  collection: "menu";
  data: any
} & { render(): Render[".md"] };
"item-4.md": {
	id: "item-4.md";
  slug: "item-4";
  body: string;
  collection: "menu";
  data: any
} & { render(): Render[".md"] };
"item-5.md": {
	id: "item-5.md";
  slug: "item-5";
  body: string;
  collection: "menu";
  data: any
} & { render(): Render[".md"] };
"item-6.md": {
	id: "item-6.md";
  slug: "item-6";
  body: string;
  collection: "menu";
  data: any
} & { render(): Render[".md"] };
};
"personalInfo": {
"index.md": {
	id: "index.md";
  slug: "index";
  body: string;
  collection: "personalInfo";
  data: any
} & { render(): Render[".md"] };
};
"portfolioFilters": {
"filter-1.md": {
	id: "filter-1.md";
  slug: "filter-1";
  body: string;
  collection: "portfolioFilters";
  data: any
} & { render(): Render[".md"] };
"filter-2.md": {
	id: "filter-2.md";
  slug: "filter-2";
  body: string;
  collection: "portfolioFilters";
  data: any
} & { render(): Render[".md"] };
"filter-3.md": {
	id: "filter-3.md";
  slug: "filter-3";
  body: string;
  collection: "portfolioFilters";
  data: any
} & { render(): Render[".md"] };
};
"progressBar": {
"progressBar-1.md": {
	id: "progressBar-1.md";
  slug: "progressbar-1";
  body: string;
  collection: "progressBar";
  data: any
} & { render(): Render[".md"] };
"progressBar-2.md": {
	id: "progressBar-2.md";
  slug: "progressbar-2";
  body: string;
  collection: "progressBar";
  data: any
} & { render(): Render[".md"] };
"progressBar-3.md": {
	id: "progressBar-3.md";
  slug: "progressbar-3";
  body: string;
  collection: "progressBar";
  data: any
} & { render(): Render[".md"] };
"progressBar-4.md": {
	id: "progressBar-4.md";
  slug: "progressbar-4";
  body: string;
  collection: "progressBar";
  data: any
} & { render(): Render[".md"] };
};
"publications": {
"publication-1.md": {
	id: "publication-1.md";
  slug: "publication-1";
  body: string;
  collection: "publications";
  data: any
} & { render(): Render[".md"] };
"publication-2.md": {
	id: "publication-2.md";
  slug: "publication-2";
  body: string;
  collection: "publications";
  data: any
} & { render(): Render[".md"] };
"publication-3.md": {
	id: "publication-3.md";
  slug: "publication-3";
  body: string;
  collection: "publications";
  data: any
} & { render(): Render[".md"] };
"publication-4.md": {
	id: "publication-4.md";
  slug: "publication-4";
  body: string;
  collection: "publications";
  data: any
} & { render(): Render[".md"] };
};
"skills": {
"skill-1.md": {
	id: "skill-1.md";
  slug: "skill-1";
  body: string;
  collection: "skills";
  data: any
} & { render(): Render[".md"] };
"skill-2.md": {
	id: "skill-2.md";
  slug: "skill-2";
  body: string;
  collection: "skills";
  data: any
} & { render(): Render[".md"] };
"skill-3.md": {
	id: "skill-3.md";
  slug: "skill-3";
  body: string;
  collection: "skills";
  data: any
} & { render(): Render[".md"] };
"skill-4.md": {
	id: "skill-4.md";
  slug: "skill-4";
  body: string;
  collection: "skills";
  data: any
} & { render(): Render[".md"] };
};
"works": {
"portfolio-1.md": {
	id: "portfolio-1.md";
  slug: "portfolio-1";
  body: string;
  collection: "works";
  data: any
} & { render(): Render[".md"] };
"portfolio-2.md": {
	id: "portfolio-2.md";
  slug: "portfolio-2";
  body: string;
  collection: "works";
  data: any
} & { render(): Render[".md"] };
"portfolio-3.md": {
	id: "portfolio-3.md";
  slug: "portfolio-3";
  body: string;
  collection: "works";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = never;
}
