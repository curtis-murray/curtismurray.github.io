import { j as createVNode, F as Fragment, s as spreadAttributes } from './astro.4185f597.mjs';
import '@astrojs/internal-helpers/path';
import 'html-escaper';

const images = {
					
				};

				function updateImageReferences(html) {
					return html.replaceAll(
						/__ASTRO_IMAGE_="([^"]+)"/gm,
						(full, imagePath) => spreadAttributes({src: images[imagePath].src, ...images[imagePath].attributes})
					);
				}

				const html = updateImageReferences("");

				const frontmatter = {"skill":"Statistical Modelling","about":"I'm particularly interested in the transparency and interpretability of generative models and Bayesian statistics, over opaque, black-box approaches.","img":"/assets/icons/stats.svg","bgColor":"bg-skill-bg-five"};
				const file = "/Users/curtismurray/Dropbox/Website/revamp/src/content/skills/skill-5.md";
				const url = undefined;
				function rawContent() {
					return "";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}
				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return contentFragment;
				}
				Content[Symbol.for('astro.needsHeadRendering')] = true;

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, images, rawContent, url };
