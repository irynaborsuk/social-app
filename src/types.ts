export interface RegistrationFormValues {
    email: string;
    firstName: string;
    lastName: string;
    password: string
    confirmPassword: string;
    avatar: string;
}
export interface LoginFormValues {
    email: string;
    password: string;
}

export interface CreatedBy {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface User extends CreatedBy {
    email: string;
}

export enum LocalStorageKeys {
    TOKEN = 'token'
}

export interface TokenResponse {
    token: string;
}

export interface NewPostForm {
    content: string;
}

export interface UpdatePostRequest {
    _id: string;
    content: string;
}

export interface CommentForm {
    content: string,
    parent: string;
}

export interface PostResponse {
    _id: string;
    createdBy: CreatedBy;
    content: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    parent?: string;
}

export interface Post extends PostResponse {
   comments: Post[];
}

export interface UpdateUserForm {
    email: string;
    firstName: string;
    lastName: string;
    password: string
    currentPassword: string;
    avatar: string;
}

export interface DeleteUserRequest {
    currentPassword: string;
}