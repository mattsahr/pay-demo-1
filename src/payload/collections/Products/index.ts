import type { CollectionConfig, CollectionBeforeReadHook } from 'payload/types';

import { admins } from '../../access/admins';
import { Archive } from '../../blocks/ArchiveBlock';
import { CallToAction } from '../../blocks/CallToAction';
import { Content } from '../../blocks/Content';
import { MediaBlock } from '../../blocks/MediaBlock';
import { slugField } from '../../fields/slug';
import { populateArchiveBlock } from '../../hooks/populateArchiveBlock';
import { checkUserPurchases } from './access/checkUserPurchases';
import { beforeProductChange } from './hooks/beforeChange';
import { deleteProductFromCarts } from './hooks/deleteProductFromCarts';
import { revalidateProduct } from './hooks/revalidateProduct';
import { CustomList } from '../../blocks/List/CustomList';
import { CustomEdit } from '../../blocks/Edit/CustomEdit';
import { BeforeListUX }from '../../blocks/List/BeforeList';
import { ProductSelect } from './ui/ProductSelect';

const beforeReadHook: CollectionBeforeReadHook = async ({
  doc, // full document data
  req, // full express request
  query, // JSON formatted query
}) => {
  console.log(' ');
  console.log('QUERY');
  console.log(query);
  console.log('DOC');
  console.log((doc?.title || 'NO TITLE') + '  id: ' + (doc?.id || 'X') );
  // console.log('ENV');
  // console.log(process.env);
  console.log(' ');

  return doc;
};

/*
{
  slug: 'my-collection',
  access: {
    read: 'admin', // Set the access control property for this collection
  },
  admin: {
    components: {
      BeforeList: [
        {
          component: 'MyActionComponent',
          props: {
            // Add any props you need for your action component
          },
          access: {
            read: 'admin', // Set the access control property for the action component
          },
        },
      ],
    },
  },
}
*/

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'stripeProductID', '_status'],
    preview: doc => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/products/${doc.slug}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`;
    },
    components: {
      BeforeList: [ BeforeListUX ],
      views: {
        List: CustomList,
        // Edit: CustomEdit,
      },
    },
  },
  hooks: {
    beforeChange: [beforeProductChange],
    afterChange: [revalidateProduct],
    beforeRead: [beforeReadHook],
    afterRead: [populateArchiveBlock],
    afterDelete: [deleteProductFromCarts],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },
  // customHeader: 'Woot', // CustomHeader,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'aptify_id',
      type: 'text',
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
        {
          label: 'Product Details',
          fields: [
            {
              name: 'stripeProductID',
              label: 'Stripe Product',
              type: 'text',
              admin: {
                components: {
                  Field: ProductSelect,
                },
              },
            },
            {
              name: 'priceJSON',
              label: 'Price JSON',
              type: 'textarea',
              admin: {
                readOnly: true,
                hidden: true,
                rows: 10,
              },
            },
            {
              name: 'enablePaywall',
              label: 'Enable Paywall',
              type: 'checkbox',
            },
            {
              name: 'paywall',
              label: 'Paywall',
              type: 'blocks',
              access: {
                read: checkUserPurchases,
              },
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        };
      },
    },
    slugField(),
    {
      name: 'skipSync',
      label: 'Skip Sync',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
  ],
};

export default Products;
