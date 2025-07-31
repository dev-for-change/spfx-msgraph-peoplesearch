export interface PageCollection<T> {
    value: T[];
    hasNext?: boolean;
    totalCount?: number;
}