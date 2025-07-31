import { ISearchService } from "./ISearchService";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { isEmpty } from "@microsoft/sp-lodash-subset";
import { PageCollection } from "../../models/PageCollection";
import { Skill } from "../../models/Skill";
import { IComponentFieldsConfiguration } from "../TemplateService/TemplateService";

export class SharePointSearchService implements ISearchService {
  private _spHttpClient: SPHttpClient;
  private _siteUrl: string;
  private _listName: string;
  private _selectFields: string[];
  private _filterParameter: string;
  private _orderByParameter: string;
  private _searchParameter: string;
  private _pageSize: number;

  public get selectFields(): string[] { return this._selectFields; }
  public set selectFields(value: string[]) { this._selectFields = value; }

  public get filterParameter(): string { return this._filterParameter; }
  public set filterParameter(value: string) { this._filterParameter = value; }

  public get orderByParameter(): string { return this._orderByParameter; }
  public set orderByParameter(value: string) { this._orderByParameter = value; }

  public get searchParameter(): string { return this._searchParameter; }
  public set searchParameter(value: string) { this._searchParameter = value; }

  public get pageSize(): number { return this._pageSize; }
  public set pageSize(value: number) { this._pageSize = value; }

  constructor(spHttpClient: SPHttpClient, siteUrl: string, listName: string = "SkillsLibrary") {
    this._spHttpClient = spHttpClient;
    this._siteUrl = siteUrl;
    this._listName = listName;
  }

  public async searchSkills(templateParameters: { [key: string]: IComponentFieldsConfiguration[] | number; }): Promise<PageCollection<Skill>> {
    let apiUrl = `${this._siteUrl}/_api/web/lists/getbytitle('${this._listName}')/items`;
    
    const queryParams: string[] = [];

    // Add select fields
    if (!isEmpty(this.selectFields)) {
      queryParams.push(`$select=${this.selectFields.join(',')},Author/Title,Author/Email&$expand=Author`);
    } else {
      queryParams.push(`$select=Id,Title,Description,Category,Level,Created,Modified,Author/Title,Author/Email&$expand=Author`);
    }

    // Add filter
    let filterQuery = '';
    if (!isEmpty(this.filterParameter)) {
      filterQuery = this.filterParameter;
    }

    // Add search functionality
    if (!isEmpty(this.searchParameter)) {
      const searchFilters: string[] = [];
      
      (templateParameters.skillFields as IComponentFieldsConfiguration[])?.forEach((field) => {
        if (field.searchable && field.value) {
          searchFilters.push(`substringof('${this.searchParameter}',${field.value})`);
        }
      });

      if (searchFilters.length > 0) {
        const searchFilter = `(${searchFilters.join(' or ')})`;
        filterQuery = filterQuery ? `(${filterQuery}) and ${searchFilter}` : searchFilter;
      }
    }

    if (filterQuery) {
      queryParams.push(`$filter=${filterQuery}`);
    }

    // Add ordering
    if (!isEmpty(this.orderByParameter)) {
      queryParams.push(`$orderby=${this.orderByParameter}`);
    } else {
      queryParams.push(`$orderby=Modified desc`);
    }

    // Add pagination
    if (this.pageSize) {
      queryParams.push(`$top=${this.pageSize}`);
    }

    if (queryParams.length > 0) {
      apiUrl += `?${queryParams.join('&')}`;
    }

    try {
      const response: SPHttpClientResponse = await this._spHttpClient.get(
        apiUrl,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        throw new Error(`Error fetching skills: ${response.statusText}`);
      }

      const data = await response.json();
      
      const skills: Skill[] = data.value.map((item: any) => ({
        Id: item.Id,
        Title: item.Title,
        Description: item.Description,
        Category: item.Category,
        Level: item.Level,
        Created: item.Created,
        Modified: item.Modified,
        Author: {
          Title: item.Author?.Title || '',
          Email: item.Author?.Email || ''
        }
      }));

      return {
        value: skills,
        hasNext: false, // SharePoint REST API doesn't provide easy pagination info
        totalCount: skills.length
      };

    } catch (error) {
      console.error('Error fetching skills from SharePoint:', error);
      throw error;
    }
  }

  public async fetchPage(pageNumber: number): Promise<PageCollection<Skill>> {
    // For now, we'll implement basic pagination by skipping items
    const skipCount = (pageNumber - 1) * this.pageSize;
    
    let apiUrl = `${this._siteUrl}/_api/web/lists/getbytitle('${this._listName}')/items`;
    
    const queryParams: string[] = [];

    // Add select fields
    if (!isEmpty(this.selectFields)) {
      queryParams.push(`$select=${this.selectFields.join(',')},Author/Title,Author/Email&$expand=Author`);
    } else {
      queryParams.push(`$select=Id,Title,Description,Category,Level,Created,Modified,Author/Title,Author/Email&$expand=Author`);
    }

    // Add filter if exists
    if (!isEmpty(this.filterParameter)) {
      queryParams.push(`$filter=${this.filterParameter}`);
    }

    // Add ordering
    if (!isEmpty(this.orderByParameter)) {
      queryParams.push(`$orderby=${this.orderByParameter}`);
    } else {
      queryParams.push(`$orderby=Modified desc`);
    }

    // Add pagination
    if (this.pageSize) {
      queryParams.push(`$top=${this.pageSize}`);
      if (skipCount > 0) {
        queryParams.push(`$skip=${skipCount}`);
      }
    }

    if (queryParams.length > 0) {
      apiUrl += `?${queryParams.join('&')}`;
    }

    try {
      const response: SPHttpClientResponse = await this._spHttpClient.get(
        apiUrl,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        throw new Error(`Error fetching skills page: ${response.statusText}`);
      }

      const data = await response.json();
      
      const skills: Skill[] = data.value.map((item: any) => ({
        Id: item.Id,
        Title: item.Title,
        Description: item.Description,
        Category: item.Category,
        Level: item.Level,
        Created: item.Created,
        Modified: item.Modified,
        Author: {
          Title: item.Author?.Title || '',
          Email: item.Author?.Email || ''
        }
      }));

      return {
        value: skills,
        hasNext: skills.length === this.pageSize, // Assume there are more if we got a full page
        totalCount: skills.length
      };

    } catch (error) {
      console.error('Error fetching skills page from SharePoint:', error);
      throw error;
    }
  }
}