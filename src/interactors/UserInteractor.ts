import { User } from "../entities/User";
import { IUserInteractor } from "../providers/interfaces/IUserInteractor";
import { IUserRepository } from "../providers/interfaces/IUserRepository";

export class UserInteractor implements IUserInteractor{

    private repostitory: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repostitory = repository;
    }

    async checkotp(value: number): Promise<boolean> {
        try {
            return await this.repostitory.otpcheck(value);
        } catch (error) {
            console.error("Error in checkotp:", error);
            throw error; 
        }
    }

    async sendmail(email: string): Promise<string> {
        try {
            return await this.repostitory.sendmail(email);
        } catch (error) {
            console.error("Error in sendmail:", error);
            throw error; 
        }
    }

    async jwt(payload: User): Promise<string> {
        try {
            return await this.repostitory.jwt(payload);
        } catch (error) {    
            console.error("Error in jwt:", error);
            throw error; 
        }
    }

    async checkpass(email: string, password: string) {
        try {
            return await this.repostitory.passwordmatch(email, password);
        } catch (error) {      
            console.error("Error in checkpass:", error);
            throw error; 
        }
    }

    async login(email: string): Promise<User | null> {
        try {
            return await this.repostitory.findByOne(email);
        } catch (error) {      
            console.error("Error in login:", error);
            throw error; 
        }
    }

    async signup(username: string, email: string, password: string, dateofbirth: Date, isblocked: boolean): Promise<User> {
        try {
            return await this.repostitory.create(username, email, password, dateofbirth, isblocked);
        } catch (error) {
            console.error("Error in signup:", error);
            throw error; 
        }
    }
}
