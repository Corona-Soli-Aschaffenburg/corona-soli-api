import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true, unique: true })
    nickName: string;

    @Column({ nullable: true })
    description: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true, select: false })
    loginHash: string;

    @Column({ default: false })
    enabled: boolean;

    @Column({ nullable: true })
    latLon: string;

}
