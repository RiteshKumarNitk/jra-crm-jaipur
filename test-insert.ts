import { createClient } from './src/utils/supabase/client';

async function testGalleryInsert() {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://jra-crm.insforge.dev'; // Assuming this is the URL
    // I don't have the anon key easily but I can try to run it in the environment.
    const supabase = createClient();
    const { data, error } = await supabase.from('gallery_items').insert({
        title: 'Test Item',
        category: 'Firm',
        image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f',
        order_index: 0
    });
    console.log({ data, error });
}
testGalleryInsert();
