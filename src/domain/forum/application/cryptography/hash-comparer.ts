export abstract class HasherComparer {
  abstract compare(plan: string, hash: string): Promise<boolean>
}
