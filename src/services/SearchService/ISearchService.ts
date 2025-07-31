import { PageCollection } from '../../models/PageCollection';
import { ExtendedUser } from '../../models/ExtendedUser';
import { Skill } from '../../models/Skill';
import { IComponentFieldsConfiguration } from '../TemplateService/TemplateService';
import { IProfileImage } from '../../models/IProfileImage';

export interface ISearchService {
    selectParameter?: string[];
    selectFields?: string[];
    filterParameter: string;
    orderByParameter: string;
    searchParameter: string;
    enableUmlautReplacement?: boolean;
    pageSize: number;
    
    // Methods for people search
    searchUsers?(templateParameters: {
        [key: string]: IComponentFieldsConfiguration[] | number;
    }): Promise<PageCollection<ExtendedUser>>;
    
    fetchPage?(pageLink: string | number): Promise<PageCollection<ExtendedUser | Skill>>;
    
    fetchProfilePictures?(users: ExtendedUser[]): Promise<IProfileImage>;
    
    // Methods for skills search
    searchSkills?(templateParameters: {
        [key: string]: IComponentFieldsConfiguration[] | number;
    }): Promise<PageCollection<Skill>>;
}