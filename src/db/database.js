const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
    const { data, error } = await supabase
        .from('astronauts')
        .select('*')
        .limit(1);

    if (error && error.code === '42P01') { // Table does not exist
        const { error: createError } = await supabase
            .rpc('create_astronauts_table'); // Assuming you have a stored procedure to create the table

        if (createError) {
            console.error('Error creating astronauts table:', createError);
        } else {
            console.log('Table "astronauts" created.');
            await insertDefaultData();
        }
    } else if (error) {
        console.error('Error checking astronauts table:', error);
    } else {
        console.log('Table "astronauts" already exists.');
    }
};

createAstronautsTable();

module.exports = supabase;