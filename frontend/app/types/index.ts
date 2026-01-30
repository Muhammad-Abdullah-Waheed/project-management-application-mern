export interface User {
    _id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    updatedAt: Date;
    profilePicture?: string;
    createdAt: Date;
}


export interface workSpace {
    _id: string;
    name: string;
    description?: string;
    owner: User | string;
    members: {
        user: User | string;
        role: "owner" | "admin" | "member" | "viewer";
        joinDate: Date;
    }[];
    color: string;
    createdAt: Date;
    updatedAt: Date;
}
