const { createClient } = require('@supabase/supabase-js');
const supabase = require('../db/database');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const getAllAstronauts = async (callback) => {
    const { data, error } = await supabase
        .from('astronauts')
        .select('*');

    if (error) {
        callback(error, null);
    } else {
        callback(null, data);
    }
};

const getAstronautById = async (id, callback) => {
    const { data, error } = await supabase
        .from('astronauts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        callback(error, null);
    } else {
        callback(null, data);
    }
};

const createAstronaut = async (name, role, callback) => {
    const { data, error } = await supabase
        .from('astronauts')
        .insert([{ name, role }])
        .single();

    if (error) {
        callback(error, null);
    } else {
        callback(null, data);
    }
};

const updateAstronaut = async (id, { name, role }, callback) => {
    const { data: existingAstronaut, error: getError } = await supabase
        .from('astronauts')
        .select('*')
        .eq('id', id)
        .single();

    if (getError) {
        return callback(getError, null);
    }

    const updatedName = name !== undefined ? name : existingAstronaut.name;
    const updatedRole = role !== undefined ? role : existingAstronaut.role;

    const { data, error } = await supabase
        .from('astronauts')
        .update({ name: updatedName, role: updatedRole })
        .eq('id', id)
        .single();

    if (error) {
        callback(error, null);
    } else {
        callback(null, data);
    }
};

const deleteAstronaut = async (id, callback) => {
    const { data, error } = await supabase
        .from('astronauts')
        .delete()
        .eq('id', id)
        .single();

    if (error) {
        callback(error, null);
    } else {
        callback(null, { message: 'Astronaut deleted successfully!' });
    }
};

module.exports = {
    getAllAstronauts,
    getAstronautById,
    createAstronaut,
    updateAstronaut,
    deleteAstronaut
};