import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import { HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';

// export type UserDocument = User & Document;
export class ExtendFunction extends Document {
  checkPassword: any;
  updateStatus: (status: string, actor?: any) => void;
}

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class User extends ExtendFunction {
  @Prop()
  username: string;
  @Prop()
  fullName: string;
  @Prop({ unique: true })
  email: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  password: string;
  @Prop(
    raw({
      isActive: { type: Boolean },
      isPasswordSet: { type: Boolean },
    }),
  )
  status: Record<string, any>;
  @Prop()
  statusHistories: [];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

UserSchema.pre<UserDocument>('save', function (next: NextFunction): any {
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

UserSchema.methods.checkPassword = function (
  password: string,
): Promise<boolean> {
  return new Promise((resolve: any, reject: any) => {
    bcrypt.compare(password, this.password, (error: any, isMatch: boolean) => {
      if (error) reject(error);
      resolve(isMatch);
    });
  });
};

UserSchema.methods.updateStatus = function (status: string, actor?: any): void {
  const statusHistory = {
    actor: actor ? actor._id : null,
    actorModel: actor ? actor.constuctor.modelName : 'System',
    status: status,
    updatedAt: new Date(),
  };
  this.satusHistories.push(statusHistory);
};
