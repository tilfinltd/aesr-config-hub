import { ComplexProfile, SingleProfile } from "aesr-config";

/**
 * This is an example of a function that generates a profile JSON.
 * In practice, it is necessary to implement getting user profile 
 * data from a database or spreadsheet API and converting it into data.
 *
 * @param user
 * @param orgDomain
 * @returns ProfileSet
 */
export async function getUserProfileSet(
  user: string,
  orgDomain: string,
): Promise<{ singles: SingleProfile[]; complexes: ComplexProfile[] }> {
  const singles: SingleProfile[] = [
    {
      name: "CommonProfile",
      aws_account_id: "123456789000",
      role_name: "developer",
      color: "0011ff",
    },
  ];

  const complexes: ComplexProfile[] = [
    {
      name: "YourCompany",
      aws_account_id: "123456789012",
      target_role_name: `user-${user}`,
      targets: [
        {
          name: "Project1 dev",
          aws_account_id: "123456789013",
          role_name: "developer",
          color: "2222ee",
        },
        {
          name: "Project1 stg",
          aws_account_id: "123456789014",
          role_name: "developer",
          color: "22ee22",
        },
        {
          name: "Project1 prod",
          aws_account_id: "123456789015",
          role_name: "developer",
          color: "ee2222",
        },
      ],
    },
  ];

  return {
    singles,
    complexes,
  };
}
