export class User {
    _id: number;
    status: string;
    password: string;
    name?: string;
    accessToken?: string;
    email_id: string;
    profile_image?: string;
    user_type?: string;
    permissions?: any;
}
