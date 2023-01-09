import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import { HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class User {
  @Prop()
  username: string;
  @Prop()
  fullName: string;
  @Prop()
  email: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  password: string;
  @Prop()
  status: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

UserSchema.pre<UserDocument>('save', function (next: NextFunction) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();

  bcrypt.genSalt(10, (error: any, salt: any) => {
    if (error) return next(error);
    bcrypt.hash(this.password, salt, (err: any, hash: any) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});
