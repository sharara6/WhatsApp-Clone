import { supabase } from '../lib/supabase.js';

export class User {
    static async create(userData) {
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    static async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    static async update(id, updateData) {
        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
} 