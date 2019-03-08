export type AbleAbilities = string[];
export interface IAbleDefinition { [key: string]: AbleAbilities; }
export interface IAbleValues { [key: string]: string|string[]; }

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
        if (key[key.length - 2] === "[" && key[key.length - 1] === "]") {
          const arrKey = key.substr(0, key.length - 2);
          if (!(values[arrKey] instanceof Array)) {
            values[arrKey] = [];
          }
          if (typeof value !== "undefined") {
            (values[arrKey] as string[]).push(value);
          }
        } else {
          values[key] = typeof value === "undefined" ? "" : value;
        }
      } else {
        remainder.push(ability);
      }
    }
    return [values, remainder];
  }

  export function applyValues(abilities: AbleAbilities, values: IAbleValues): AbleAbilities {
    const REGEX = /\{([^}]+)\}/g;
    return abilities.reduce((outerAbilitiesAcc, ability) => {
      const match = ability.match(REGEX);
      if (!match) {
        return outerAbilitiesAcc.concat([ability]);
      }
      return outerAbilitiesAcc.concat(match
        .map((k) => k.substr(1, k.length - 2))
        .reduce((abilitiesAcc, k) =>
          abilitiesAcc.reduce((acc, innerAbility) =>
            acc.concat(arr(values[k]).map((v) => innerAbility.replace(`{${k}}`, v))), [] as string[]), [ability]));
    }, [] as string[]);
  }

  export function resolve(definition: IAbleDefinition, abilities: AbleAbilities): AbleAbilities {
    const flattened = Able.flatten(definition, abilities);
    const [extractedValues, extractedAbilities] = Able.extractValues(flattened);
    return Able.applyValues(extractedAbilities, extractedValues);
  }

  export function getMissingAbilities(abilities: AbleAbilities, requiredAbilities: AbleAbilities): AbleAbilities {
    return requiredAbilities.filter((ability) => !abilities.includes(ability));
  }

  export function canAccess(appliedAbilities: AbleAbilities, requiredAbilities: AbleAbilities): boolean {
    return this.getMissingAbilities(appliedAbilities, requiredAbilities).length === 0;
  }
}

function arr(valueOrValues?: string|string[]|null): string[] {
  if (valueOrValues === "") {
    return [""];
  } else if (typeof valueOrValues === "undefined" || valueOrValues === null) {
    return [];
  } else if (typeof valueOrValues === "string") {
    return [valueOrValues];
  } else {
    return valueOrValues;
  }
}
