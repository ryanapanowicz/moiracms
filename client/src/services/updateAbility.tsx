import { Ability, AbilityBuilder } from "@casl/ability";

type RolesArray =
    | [
          {
              __typename?: "Role";
              id: string;
              name: string;
              permissions: [
                  {
                      __typename?: "Permission";
                      id: string;
                      name: string;
                  }
              ];
          }
      ]
    | undefined;

const updateAbility = (ability: Ability, roles: RolesArray) => {
    const { can, rules } = new AbilityBuilder(Ability);

    if (roles) {
        // Merge all permissions into one array
        const permissions = roles
            .flatMap((role) => role.permissions)
            .filter(
                (value, index, array) =>
                    array.findIndex((obj) => obj.id === value.id) === index
            );
            
        permissions.forEach((permission) => {
            const value = permission.name.split(" ");
            // Permissions from the server are split by a space
            // for the subject and action e.g. "update user" (action subject)
            can(value[0], value[1]);
        });
    }
    
    ability.update(rules);
};

export default updateAbility;
