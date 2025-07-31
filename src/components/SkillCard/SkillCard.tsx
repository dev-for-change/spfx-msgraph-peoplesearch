import * as React from 'react';
import { ISkillCardProps } from './ISkillCardProps';
import { ISkillCardState } from './ISkillCardState';
import { TemplateService } from '../../services/TemplateService/TemplateService';
import { isEmpty } from '@microsoft/sp-lodash-subset';

export class SkillCard extends React.Component<ISkillCardProps, ISkillCardState> {
  
  private determineSkillConfig(): ISkillCardProps {
    let processedProps: ISkillCardProps = this.props;

    if (this.props.fieldsConfiguration && this.props.item) {
        processedProps = TemplateService.processFieldsConfiguration<ISkillCardProps>(this.props.fieldsConfiguration, this.props.item);
    }

    return processedProps;
  }

  public render(): React.ReactElement<ISkillCardProps> {
    const processedProps: ISkillCardProps = this.determineSkillConfig();
    const skill = this.props.item;

    return (
      <div>
        <div className="skillTitle">
          {processedProps.title || skill.Title}
        </div>
        
        {(processedProps.description || skill.Description) && (
          <div className="skillDescription">
            {processedProps.description || skill.Description}
          </div>
        )}
        
        <div className="skillMeta">
          {(processedProps.category || skill.Category) && (
            <div className="skillCategory">
              Category: {processedProps.category || skill.Category}
            </div>
          )}
          
          {(processedProps.level || skill.Level) && (
            <div className="skillLevel">
              Level: {processedProps.level || skill.Level}
            </div>
          )}
          
          {skill.Author && skill.Author.Title && (
            <div className="skillAuthor">
              Created by: {skill.Author.Title}
            </div>
          )}
        </div>
      </div>
    );
  }
}