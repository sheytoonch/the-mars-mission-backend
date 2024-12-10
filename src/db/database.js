const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to insert default data
const insertDefaultData = async () => {
    const pathToAstronautsDefaultDataFile = path.join(__dirname, '../../data/astronauts.json');
    const jsonString = fs.readFileSync(pathToAstronautsDefaultDataFile);
    const astronauts = JSON.parse(jsonString);

    for (const astronaut of astronauts) {
        const { data, error } = await supabase
            .from('astronauts')
            .insert([{ name: astronaut.name, role: astronaut.role }]);

        if (error) {
            console.error('Error inserting default data:', error);
        } else {
            console.log('Default data inserted:', data);
        }
    }
};

// Function to create the astronauts table if it doesn't exist
const createAstronautsTable = async () => {
    const { error } = await supabase.rpc('create_astronauts_table');

    if (error) {
        console.error('Error creating astronauts table:', error);
    } else {
        console.log('Table "astronauts" created.');
        await insertDefaultData();
    }
};

// Call the function to create the table and insert default data
createAstronautsTable();

module.exports = supabase;