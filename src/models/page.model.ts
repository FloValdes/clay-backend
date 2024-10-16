import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
  page: string;
  translations: Map<string, Map<string, string>>;
  updatedAt: Date;
}

const PageSchema: Schema = new Schema({
  page: { type: String, required: true, unique: true },
  translations: { type: Map, of: Map, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPage>('Page', PageSchema);

