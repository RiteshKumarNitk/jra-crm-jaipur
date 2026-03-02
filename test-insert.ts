import { insforge } from './src/utils/insforge';

async function testGalleryInsert() {
    const { data, error } = await insforge.database.from('gallery_items').insert({
        title: 'Test Item',
        category: 'Firm',
        image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f',
        order_index: 0
    });
    console.log({ data, error });
}
testGalleryInsert();
