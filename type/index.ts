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

export interface DatabasetimeEntriesTable {
    "id": number,
    "projectid": number,
    "name": string,
    "starttime": number,
    "endtime": number|null,
    "owner": number
};

export interface ApiAuth {
    "auth": boolean,
    "userId": number
};