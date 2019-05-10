# ABLE

ABLE is a tiny library that can be used to manage access control using arrays of strings that represent abilities.

## Structure

ABLE allows you to write a "definition" that is essentially a map of abilities that contain other abilities. Such a defintion might look like this:

```
{
  "news-writer": ["news-reader", "news:create", "news:update"],
  "news-reader": ["news:index", "news:show"],
  "comment-moderator": ["news-reader", "comment:edit", "comment:delete"],
  "moderator": ["comment-moderator", "news-writer"],
  "head-of-site": ["moderator"],
}
```

## API

    type AbleAbilities = string[];
    interface IAbleDefinition { [key: string]: AbleAbilities; }
    interface IAbleValues { [key: string]: string; }
    class Able {
      public static flatten(definition: IAbleDefinition, resolved: AbleAbilities): AbleAbilities;
      public static extractValues(abilities: AbleAbilities): [IAbleValues, AbleAbilities];
      public static applyValues(abilities: AbleAbilities, values: IAbleValues): AbleAbilities;
      public static getMissingAbilities(appliedAbilities: AbleAbilities, requiredAbilities: AbleAbilities): AbleAbilities;
      public static canAccess(appliedAbilities: AbleAbilities, requiredAbilities: AbleAbilities): boolean;
    }

## Parameters

You can create template abilities. For example, abilities: `["article:{articleId}:read", "?articleId=4"]` will have values applied to `["article:4:read"]`. You can also have arrays of values, like `["article:{articleId}:read", "?articleId[]=4", "?articleId[]=5"]` which resolves to `["article:4:read", "article:5:read"]`. Without the `[]` in the key name, the value will be overwritten rather than added.
