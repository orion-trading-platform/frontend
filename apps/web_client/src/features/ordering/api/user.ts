const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getCurrentUser() {
  await delay(300);
  return {
    id: "u_001",
    name: "John Doe",
    initials: "JD",
  };
}

export async function getAccountBalance() {
  await delay(300);
  return {
    account_id: "acc_001",
    balance: 12450.00,
  };
}
