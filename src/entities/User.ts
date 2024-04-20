export class User {
    constructor(
        public readonly username: string,
        public readonly email: string,
        public readonly password: string,
        public readonly role: string = 'user', 
        public readonly dateofbirth: Date,
        public readonly _id?: string 
    ) {}
}
