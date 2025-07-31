import { PageCollection } from './PageCollection';
import { IComponentFieldsConfiguration } from '../services/TemplateService/TemplateService';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { ServiceScope } from '@microsoft/sp-core-library';
import { Skill } from './Skill';

interface ITemplateContext {
    items: PageCollection<Skill>;
    resultCount: number;
    showResultsCount: boolean;
    showBlank: boolean;
    showPagination: boolean;
    showLPC: boolean;
    skillFields?: IComponentFieldsConfiguration[];
    themeVariant?: IReadonlyTheme;
    serviceScope: ServiceScope;
    [key:string]: IComponentFieldsConfiguration[] | number | boolean | PageCollection<Skill> | IReadonlyTheme | ServiceScope;
}

export default ITemplateContext;