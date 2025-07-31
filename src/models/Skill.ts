export interface Skill {
    Id: number;
    Title: string;
    Description?: string;
    Category?: string;
    Level?: string;
    Created: string;
    Modified: string;
    Author: {
        Title: string;
        Email: string;
    };
}