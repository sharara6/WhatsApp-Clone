import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';



dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);



export const connectDB = async () => {
    try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) throw error;
        console.log('Supabase connected successfully');
    } catch (error) {
        console.error(`Error connecting to Supabase: ${error.message}`);
        process.exit(1);
    }
}; 