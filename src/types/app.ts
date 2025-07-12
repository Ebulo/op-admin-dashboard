export interface App {
    id: number;
    app_name: string;
    app_image_url: string;
    app_link: string;
    postback_url: string;
    dollar_equivalent: number;
    unique_app_key: string;
    created_on: string;
    updated_at: string;
    publisher: number;
}

export interface AppResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: App[];
}