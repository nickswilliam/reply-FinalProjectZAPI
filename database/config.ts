import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const dbURL = process.env.DB_URL
        if(!dbURL){
            throw new Error('La URL no está definida correctamente')
        }

        await mongoose.connect(dbURL)
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.error(error);
        throw new Error('Error al conectarse a la base de datos')
    }
};
