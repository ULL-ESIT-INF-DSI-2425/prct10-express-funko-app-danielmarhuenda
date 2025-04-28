import { Document, Schema, model } from 'mongoose';

interface FunkoDocumentInterface extends Document {
  ID: number,
  nombre: string,
  descripcion: string,
  tipo: 'Pop!' | 'Pop! Rides' | 'Vynil Soda' | 'Vynil Gold',
  genero: "Animación" | "Películas y TV" | "Videojuegos" | "Deportes" | "Música" | "Ánime",
  franquicia: string,
  numero: number,
  exclusivo: boolean,
  caracteristicas: string,
  mercado: number,
}

const FunkoSchema = new Schema<FunkoDocumentInterface>({
  ID: {
    type: Number,
    unique: true,
    required: true,
    trim: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  tipo: {
    type: String,
    trim: true,
    default: 'Pop!',
    enum: ['Pop!', 'Pop! Rides', 'Vynil Soda', 'Vynil Gold'],
  },
  genero: {
    type: String,
    trim: true,
    default: 'Música',
    enum: ["Animación", "Películas y TV", "Videojuegos", "Deportes", "Música", "Ánime"],
  },
  franquicia: {
    type: String,
    required: true,
    trim: true,
  },
  numero: {
    type: Number,
    required: true,
    trim: true,
  },
  exclusivo: {
    type: Boolean,
    required: true,
    trim: true,
  },
  caracteristicas: {
    type: String,
    required: true,
    trim: true,
  },
  mercado: {
    type: Number,
    required: true,
    trim: true,
  },
});

export const Funko = model<FunkoDocumentInterface>('Funko', FunkoSchema);
