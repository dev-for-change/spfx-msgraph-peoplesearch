import * as React from 'react';
import ResultsLayoutOption from '../../models/ResultsLayoutOption';
import { IPropertyPaneField } from '@microsoft/sp-property-pane';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import * as strings from 'PeopleSearchWebPartStrings';
import { PropertyPaneChoiceGroup } from "@microsoft/sp-property-pane";
import { IPeopleSearchWebPartProps } from '../../webparts/peoplesearch/IPeopleSearchWebPartProps';
import { DebugViewComponent, IDebugViewProps } from '../../components/DebugViewComponent';
import ITemplateContext from '../../models/ITemplateContext';
import { PeopleViewComponent, IPeopleViewProps } from '../../components/PeopleViewComponent/PeopleViewComponent';
import { IPeopleShimmerViewProps, PeopleShimmerViewComponent } from '../../components/PeopleViewComponent/PeopleShimmerViewComponent';
import { ExtendedUser } from '../../models/ExtendedUser';
import { ISkillViewProps, SkillViewComponent } from '../../components/SkillViewComponent/SkillViewComponent';
import { Skill } from '../../models/Skill';

export interface IComponentFieldsConfiguration {

    /**
     * The name of the field
     */
    name: string;

    /**
     * The field name for the inner component props
     */
    field: string;

    /**
     * The value of the field
     */
    value: string;

    /**
     * Whether the field is searchable
     */
    searchable: boolean;

}

export class TemplateService {
    /**
     * Gets template parameters
     * @param layout the selected layout
     * @param properties the Web Part properties
     * @param onUpdateAvailableProperties callback when the list of managed properties is fetched by the control (Optional)
     * @param availableProperties the list of available managed properties already fetched once (Optional)
     */
    public getTemplateParameters(layout: ResultsLayoutOption, properties: IPeopleSearchWebPartProps): IPropertyPaneField<any>[] { // eslint-disable-line @typescript-eslint/no-explicit-any

        switch (layout) {
            case ResultsLayoutOption.People:
                return this._getPeopleLayoutFields(properties);
            case ResultsLayoutOption.Skills:
                return this._getSkillsLayoutFields(properties);
            default:
                return [];
        }
    }

    public getTemplateComponent(layout: ResultsLayoutOption, results: ITemplateContext): JSX.Element {
        let templateComponent = null;
        switch (layout) {
            case ResultsLayoutOption.People:
                templateComponent = React.createElement(
                    PeopleViewComponent,
                    {
                        templateContext: results
                    } as IPeopleViewProps
                );
                break;
            case ResultsLayoutOption.Skills:
                templateComponent = React.createElement(
                    SkillViewComponent,
                    {
                        templateContext: results
                    } as ISkillViewProps
                );
                break;
            case ResultsLayoutOption.Debug:
                templateComponent = React.createElement(
                    DebugViewComponent,
                    {
                        content: JSON.stringify(results.items, undefined, 2)
                    } as IDebugViewProps
                );
                break;
        }
        return templateComponent;
    }

    public getShimmerTemplateComponent(layout: ResultsLayoutOption, results: ITemplateContext): JSX.Element {
        let templateComponent = null;
        switch (layout) {
            case ResultsLayoutOption.People:
                templateComponent = React.createElement(
                    PeopleShimmerViewComponent,
                    {
                        templateContext: results
                    } as IPeopleShimmerViewProps
                );
                break;
        }
        return templateComponent;
    }

        /**
     * Replaces item field values with field mapping values configuration
     * @param fieldsConfigurationAsString the fields configuration as stringified object
     * @param itemAsString the item context as stringified object
     * @param themeVariant the current theem variant
     */
    public static processFieldsConfiguration<T>(fieldsConfiguration: IComponentFieldsConfiguration[], item: ExtendedUser): T {

        const processedProps = {};

        // Use configuration
        fieldsConfiguration.map(configuration => {

            const processedValue = item[configuration.value];
            processedProps[configuration.field] = processedValue;
        });

        return processedProps as T;
    }

    /**
     * Replaces item field values with field mapping values configuration for Skills
     * @param fieldsConfiguration the fields configuration
     * @param item the skill item
     */
    public static processSkillFieldsConfiguration<T>(fieldsConfiguration: IComponentFieldsConfiguration[], item: Skill): T {
        const processedProps = {};

        // Use configuration
        fieldsConfiguration.map(configuration => {
            const processedValue = item[configuration.value];
            processedProps[configuration.field] = processedValue;
        });

        return processedProps as T;
    }

    private _getPeopleLayoutFields(properties: IPeopleSearchWebPartProps): IPropertyPaneField<any>[] { // eslint-disable-line @typescript-eslint/no-explicit-any
        
        // Setup default values
        if (!properties.templateParameters.peopleFields) {

            properties.templateParameters.peopleFields = [
                { name: 'User Principal Name', field: 'upn', value: "userPrincipalName", searchable: false },
                { name: 'Primary Text', field: 'text', value: "displayName", searchable: true },
                { name: 'Secondary Text', field: 'secondaryText', value: "jobTitle", searchable: false },
                { name: 'Tertiary Text', field: 'tertiaryText',  value: "mail", searchable: false },
                { name: 'Optional Text', field: 'optionalText',  value: "mobilePhone", searchable: false }
            ] as IComponentFieldsConfiguration[];
        }

        if (!properties.templateParameters.personaSize) {
            properties.templateParameters.personaSize = 14;
        }

        return [
            PropertyFieldCollectionData('templateParameters.peopleFields', {
                manageBtnLabel: strings.TemplateParameters.ManagePeopleFieldsLabel,
                key: 'templateParameters.peopleFields',
                panelHeader: strings.TemplateParameters.ManagePeopleFieldsLabel,
                panelDescription: strings.TemplateParameters.ManagePeopleFieldsPanelDescriptionLabel,
                enableSorting: false,
                disableItemCreation: true,
                disableItemDeletion: true,
                label: strings.TemplateParameters.ManagePeopleFieldsLabel,
                value: properties.templateParameters.peopleFields as IComponentFieldsConfiguration[],
                fields: [
                    {
                        id: 'name',
                        type: CustomCollectionFieldType.string,
                        disableEdit: true,
                        title: strings.TemplateParameters.PlaceholderNameFieldLabel
                    },
                    {
                        id: 'value',
                        type: CustomCollectionFieldType.string,
                        title: strings.TemplateParameters.PlaceholderValueFieldLabel
                    },
                    {
                        id: 'searchable',
                        type: CustomCollectionFieldType.boolean,
                        title: strings.TemplateParameters.PlaceholderSearchableFieldLabel
                    }
                ]
            }),
            PropertyPaneChoiceGroup('templateParameters.personaSize', {
                label: strings.TemplateParameters.PersonaSizeOptionsLabel,
                options: [
                    {
                        key: 11,
                        text: strings.TemplateParameters.PersonaSizeExtraSmall
                    },
                    {
                        key: 12,
                        text: strings.TemplateParameters.PersonaSizeSmall
                    },
                    {
                        key: 13,
                        text: strings.TemplateParameters.PersonaSizeRegular
                    },
                    {
                        key: 14,
                        text: strings.TemplateParameters.PersonaSizeLarge
                    },
                    {
                        key: 15,
                        text: strings.TemplateParameters.PersonaSizeExtraLarge
                    }
                ]
            }),      
        ];
    }

    private _getSkillsLayoutFields(properties: IPeopleSearchWebPartProps): IPropertyPaneField<any>[] { // eslint-disable-line @typescript-eslint/no-explicit-any
        
        // Setup default values
        if (!properties.templateParameters.skillFields) {
            properties.templateParameters.skillFields = [
                { name: 'Title', field: 'title', value: "Title", searchable: true },
                { name: 'Description', field: 'description', value: "Description", searchable: true },
                { name: 'Category', field: 'category', value: "Category", searchable: true },
                { name: 'Level', field: 'level', value: "Level", searchable: false },
                { name: 'Author', field: 'author', value: "Author.Title", searchable: false }
            ] as IComponentFieldsConfiguration[];
        }

        return [
            PropertyFieldCollectionData('templateParameters.skillFields', {
                manageBtnLabel: 'Manage skill fields',
                key: 'templateParameters.skillFields',
                panelHeader: 'Manage skill fields',
                panelDescription: 'Here you can map each field values with the corresponding skill placeholders.',
                enableSorting: false,
                disableItemCreation: true,
                disableItemDeletion: true,
                label: 'Manage skill fields',
                value: properties.templateParameters.skillFields as IComponentFieldsConfiguration[],
                fields: [
                    {
                        id: 'name',
                        type: CustomCollectionFieldType.string,
                        disableEdit: true,
                        title: 'Name'
                    },
                    {
                        id: 'value',
                        type: CustomCollectionFieldType.string,
                        title: 'Value'
                    },
                    {
                        id: 'searchable',
                        type: CustomCollectionFieldType.boolean,
                        title: 'Searchable'
                    }
                ]
            })
        ];
    }
}