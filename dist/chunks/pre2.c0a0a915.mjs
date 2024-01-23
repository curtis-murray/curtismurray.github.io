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

				const frontmatter = {"title":"Revealing Patient-Reported Experiences in Healthcare from Social Media using the DAPMAV Framework","authors":["Curtis Murray","Lewis Mitchell","Simon Tuke","Mark Mackay"],"year":"2023","journal":"ArXiv preprint","doi":"https://doi.org/10.48550/arXiv.2210.04232","bgColor":"bg-edu-card-one"};
				const file = "/Users/curtismurray/Dropbox/Website/revamp/src/content/preprints/pre2.md";
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
