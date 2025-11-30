export interface DatabaseUserTable {
    "id": number,
    "name": string
};

export interface DatabaseProjectsTable {
    "id": number,
    "name": number,
    "description": string|null,
    "color": string,
    "owner": number,
    "collaborators": string
};

export interface DatabaseTimeEntriesTable {
    "id": number,
    "projectId": number,
    "name": string,
    "startTime": number,
    "endTime": number|null,
    "owner": number
};

export interface ApiAuth {
    "auth": boolean,
    "userId": number
};