import mongoose from 'mongoose';

export class UserResponse {
  _id: mongoose.Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}
