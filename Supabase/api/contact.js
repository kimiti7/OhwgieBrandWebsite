const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, name, phone, message } = req.body;

    const { data, error } = await supabase
        .from("contact_information")
        .insert([{ email, name, phone, message }]);

    if (error) {
        return res.status(500).json({ 
            message: "Error saving data",
            error: error.message  
        });
    }

    res.status(200).json({ message: "Message received!" });
}