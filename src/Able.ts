export type AbleAbilities = string[];
export interface IAbleDefinition { [key: string]: AbleAbilities; }
export interface IAbleValues { [key: string]: string; }

export namespace Able {
  export function flatten(definition: IAbleDefinition, abilities: AbleAbilities): AbleAbilities {
    abilities = abilities.slice();
    for (const ability of abilities) {
      const members = definition[ability];
      if (members) {
        for (const member of members) {
          if (!abilities.includes(member)) {
            abilities.push(member);
          }
        }
      }
    }
    return abilities;
  }

  export function extractValues(abilities: AbleAbilities): [IAbleValues, AbleAbilities] {
    const values: IAbleValues = {};
    const remainder: string[] = [];
    for (const ability of abilities) {
      if (ability[0] === "?") {
        const [key, value] = ability.substr(1).split("=", 2);
        values[key] = typeof value === "undefined" ? "" : value;
      } else {
        remainder.push(ability);
      }
    }
    return [values, remainder];
  }

  export function applyValues(abilities: AbleAbilities, values: IAbleValues): AbleAbilities {
    const REGEX = /\{([^}]+)\}/;
    return abilities
      .map((ability) => ability.replace(REGEX, (original, key) => key in values ? values[key] : original))
      .filter((ability) => !REGEX.test(ability));
  }

  export function getMissingAbilities(abilities: AbleAbilities, requiredAbilities: AbleAbilities): AbleAbilities {
    return requiredAbilities.filter((ability) => !abilities.includes(ability));
  }

  export function canAccess(appliedAbilities: AbleAbilities, requiredAbilities: AbleAbilities): boolean {
    return this.getMissingAbilities(appliedAbilities, requiredAbilities).length === 0;
  }
}
