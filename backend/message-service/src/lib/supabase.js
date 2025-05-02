import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';


dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const connectDB = async () => {
    try {
        // Check if messages table exists
        const { data: tableExists, error: tableError } = await supabase
            .from('messages')
            .select('*')
            .limit(1);

        if (tableError && tableError.code === '42P01') { // Table does not exist
            console.log('Creating messages table...');
            
            // Create messages table
            const { error: createError } = await supabase.rpc('create_messages_table');
            
            if (createError) {
                console.error('Error creating messages table:', createError);
                throw createError;
            }
            
            console.log('Messages table created successfully');
        }

        // Test connection with users table
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) throw error;
        console.log('Supabase connected successfully');
    } catch (error) {
        console.error(`Error connecting to Supabase: ${error.message}`);
        process.exit(1);
    }
}; 