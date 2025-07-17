const blockedUsers: string[] = [];

export function blockUserInteraction(userId: string): void {
  if (!blockedUsers.includes(userId)) {
    blockedUsers.push(userId);
  }
}

export function unblockUserInteraction(userId: string): void {
  const index = blockedUsers.indexOf(userId);
  if (index !== -1) {
    blockedUsers.splice(index, 1);
  }
}

export function isUserBlocked(userId: string): boolean {
  return blockedUsers.includes(userId);
}
