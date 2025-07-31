import { Skill } from '../../models/Skill';
import { PageCollection } from '../../models/PageCollection';
import { IComponentFieldsConfiguration } from '../TemplateService/TemplateService';

export interface ISearchService {
    selectFields: string[];
    filterParameter: string;
    orderByParameter: string;
    searchParameter: string;
    pageSize: number;
    searchSkills(templateParameters: {
      [key: string]: IComponentFieldsConfiguration[] | number;
    }): Promise<PageCollection<Skill>>;
    fetchPage(pageNumber: number): Promise<PageCollection<Skill>>;
}
