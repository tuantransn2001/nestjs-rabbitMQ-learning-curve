import * as mongoose from 'mongoose';

export const mongooseProvider = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      mongoose.connect('Connection string go here'),
  },
];
