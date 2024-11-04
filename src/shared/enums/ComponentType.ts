export enum ComponentType {
    Procedure = 0,
    Function = 1,
    Middleware = 2,
    Validation = 3,
    Dto = 4,
    Security = 5,
    Configuration = 6,
    Response = 7
}

export function getComponentTypeName(value: number): string {
    return ComponentType[value] ?? "Unknown"; // Retorna "Unknown" se o valor não estiver no enum
}
