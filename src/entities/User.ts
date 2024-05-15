export class User {
  constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: string = "user",
    public readonly dateofbirth: Date,
    public readonly isblocked: boolean,
    public readonly googleId?: number,
    public readonly _id?: string
  ) {}
}

export class googleUser {
  constructor(
    public readonly googleId: string,
    public readonly username: string,
    public readonly email: string,
    public readonly dateofbirth: Date,
    public readonly role:string,
    public readonly _id?: string
  ) {}
}
