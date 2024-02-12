import type { AfterReadHook } from 'payload/dist/collections/config/types';

import type { Page, Product } from '../payload-types';
// import { buildProduct } from './aptifyHelpers';
// const aptifyProdURL = 'https://aptify70ebiz7multitenancy.azurewebsites.net/SOA/v1/Products';

export const populateArchiveBlock: AfterReadHook = async ({ doc, context, req: { payload } }) => {
  // pre-populate the archive block if `populateBy` is `collection`
  // then hydrate it on your front-end

  const layoutWithArchive = await Promise.all(
    doc.layout.map(async block => {
      if (block.blockType === 'archive') {
        const archiveBlock = block as Extract<Page['layout'][0], { blockType: 'archive' }> & {
          populatedDocs: Array<{
            relationTo: 'products' | 'pages';
            value: string;
          }>;
        };

        if (archiveBlock.populateBy === 'collection' && !context.isPopulatingArchiveBlock) {
          const res: { totalDocs: number; docs: Product[] } = await payload.find({
            collection: archiveBlock?.relationTo || 'products',
            limit: archiveBlock.limit || 10,
            context: {
              isPopulatingArchiveBlock: true,
            },
            where: {
              ...((archiveBlock?.categories?.length || 0) > 0
                ? {
                    categories: {
                      in: archiveBlock?.categories
                        ?.map(cat => {
                          if (typeof cat === 'string' || typeof cat === 'number') return cat;
                          return cat.id;
                        })
                        .join(','),
                    },
                  }
                : {}),
            },
            sort: '-publishedOn',
          });

          // const aptify = await fetch(aptifyProdURL, {
          //   method: 'GET',
          // });

          // const aptifyProd = await aptify.json();

          // console.log(
          //   'APTIFY 2',
          //   aptifyProd
          //     .slice(0, 4)
          //     .map(product => product.name)
          //     .join(', '),
          // );

          // const newProd = buildProduct(aptifyProd[0]);

          // const row = newProd.layout[0].columns[0];
          // const text = row.richText[0].children[0];
          // console.log('newPRod', newProd.id);
          // console.log('newText', text);

          // console.log(' ');
          // console.log('ARCHIVE RES', res.totalDocs);
          // console.log(' ');

          // aptifyProd.reverse().map(next => res.docs.unshift(buildProduct(next)));

          return {
            ...block,
            populatedDocsTotal: res.totalDocs,
            populatedDocs: res.docs.map((thisDoc: Product) => ({
              relationTo: archiveBlock.relationTo,
              value: thisDoc.id,
            })),
          };
        }
      }

      return block;
    }),
  );

  return {
    ...doc,
    layout: layoutWithArchive,
  };
};
