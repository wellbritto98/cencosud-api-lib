export enum ProjectStatus {
    Ativo = 0,
    Desenvolvimento = 1,
    Cancelado = 2,
}

export function getProjectStatusName(value: number): string {
    return ProjectStatus[value] ?? "Unknown";
}
