
import { UserId } from "../../value-objects/user-id";


type UserProps = {
  id: UserId;
  firstName: string;
  lastName: string;
  birthDate: Date;

};

export class User {
  private readonly id: UserId;
  private firstName: string;
  private lastName: string;
  private readonly birthDate: Date;
    constructor(props: UserProps) {
        const { id, firstName, lastName, birthDate } = props;

                this.ensureValidName(firstName, 'First name');
                this.ensureValidName(lastName, 'Last name');
                this.ensureValidBirthDate(birthDate);
        
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
    }


    

    getId(): UserId {
        return this.id;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getBirthDate(): Date {
        return this.birthDate;

    }

    getAge(referenceDate: Date): number {
        const today = referenceDate;
        let age = today.getFullYear() - this.birthDate.getFullYear();
        const monthDiff = today.getMonth() - this.birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate.getDate())) {
            age--;
        }
        return age;
    }
    
    changeName(firstName: string, lastName: string): void {
        this.ensureValidName(firstName, 'First name');
        this.ensureValidName(lastName, 'Last name');
        this.firstName = firstName;
        this.lastName = lastName;
    }

    
    isTeen(referenceDate: Date=new Date()): boolean {
        const age = this.getAge(referenceDate);
        return age >= 13 && age < 18;
    }

    private ensureValidName(value: string, field: string): void {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new Error(`${field} is required`);
        }
    }

    private ensureValidBirthDate(birthDate: Date): void {
        if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
            throw new Error('Birth date must be a valid date');
        }

        const now = new Date();
        if (birthDate > now) {
            throw new Error('Birth date cannot be in the future');
        }
    }

}