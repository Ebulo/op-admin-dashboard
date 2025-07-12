export interface Publisher {
    id: number;
    publisher_name: string;
    email: string;
}

export interface PublisherResponse {
    message: string;
    data: Publisher[];
}
