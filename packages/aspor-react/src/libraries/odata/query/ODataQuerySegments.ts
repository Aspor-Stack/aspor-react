
export interface ODataQuerySegments {
    select?: string[];
    orderBy?: string[];
    skip?: number;
    top?: number;
    filter?: string;
    key?: any;
    count?: boolean;
    expand?: string[];
    value?: boolean;
}
