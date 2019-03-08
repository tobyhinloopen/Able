export declare type AbleAbilities = string[];
export interface IAbleDefinition {
    [key: string]: AbleAbilities;
}
export interface IAbleValues {
    [key: string]: string;
}
export declare namespace Able {
    function flatten(definition: IAbleDefinition, abilities: AbleAbilities): AbleAbilities;
    function extractValues(abilities: AbleAbilities): [IAbleValues, AbleAbilities];
    function applyValues(abilities: AbleAbilities, values: IAbleValues): AbleAbilities;
    function getMissingAbilities(abilities: AbleAbilities, requiredAbilities: AbleAbilities): AbleAbilities;
    function canAccess(appliedAbilities: AbleAbilities, requiredAbilities: AbleAbilities): boolean;
}
