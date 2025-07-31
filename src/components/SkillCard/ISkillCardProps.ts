import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { IComponentFieldsConfiguration } from "../../services/TemplateService/TemplateService";
import { ServiceScope } from '@microsoft/sp-core-library';
import { Skill } from '../../models/Skill';

export interface ISkillCardProps {
  serviceScope: ServiceScope;
  item: Skill;
  fieldsConfiguration: IComponentFieldsConfiguration[];
  themeVariant: IReadonlyTheme;
  
  // Individual content properties (i.e web component attributes)
  title?: string;
  description?: string;
  category?: string;
  level?: string;
  author?: string;
}