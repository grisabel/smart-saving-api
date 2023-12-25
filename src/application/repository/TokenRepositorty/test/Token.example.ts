const token1 =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InNtYXJ0LXNhdmluZy1hcGkiLCJpYXQiOjE3MDM1MjE3OTcsImV4cCI6MTcwMzUyNTM5Nywic3ViIjoidGVzdEB0ZXN0LmNvbSJ9.2gscDxHm8yyxy5VRZ821cnaJHjtlLRNc9q8kok4JvhI';

const token2 =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InNtYXJ0LXNhdmluZy1hcGkiLCJpYXQiOjE3MDM1MjIyODUsImV4cCI6MTcwMzUyNTg4NSwic3ViIjoidGVzdEB0ZXN0LmNvbSJ9.ewE-Mo5o-qKIHujPaBR2MH11X7a1aC1CJnKmUyBYx5U';

export class TokenExample {
  static token1(): string {
    return token1;
  }
  static token2(): string {
    return token2;
  }
}
