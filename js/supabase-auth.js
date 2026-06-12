// Initialize Supabase Client
// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

let supabaseClient = null;

if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn("Supabase library not loaded. Authentication will not work.");
}

const SupabaseAuth = {
    client: supabaseClient,

    async checkSession() {
        if (!this.client) return null;
        const { data, error } = await this.client.auth.getSession();
        if (error) {
            console.error("Error checking session:", error);
            return null;
        }
        return data.session;
    },

    async signUp(email, password) {
        if (!this.client) throw new Error("Supabase client not initialized.");
        const { data, error } = await this.client.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async signIn(email, password) {
        if (!this.client) throw new Error("Supabase client not initialized.");
        const { data, error } = await this.client.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        if (!this.client) return;
        const { error } = await this.client.auth.signOut();
        if (error) throw error;
    },

    async saveAlbum(userId, albumCode) {
        if (!this.client) return;
        // Table 'user_albums' should have columns: id (uuid, pk, matches auth.users), album_code (text), updated_at (timestamp)
        const { error } = await this.client
            .from('user_albums')
            .upsert({
                id: userId,
                album_code: albumCode,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (error) {
            console.error("Error saving album to Supabase:", error);
            throw error;
        }
    },

    async loadAlbum(userId) {
        if (!this.client) return null;
        const { data, error } = await this.client
            .from('user_albums')
            .select('album_code')
            .eq('id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows returned, perfectly fine for new users
                return null;
            }
            console.error("Error loading album from Supabase:", error);
            throw error;
        }

        return data ? data.album_code : null;
    }
};

window.SupabaseAuth = SupabaseAuth;
