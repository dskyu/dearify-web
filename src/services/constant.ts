export const CacheKey = {
  Theme: "THEME",
  InviteCode: "INVITE_CODE",
};

export const AffiliateStatus = {
  Pending: "pending",
  Completed: "completed",
};

export const AffiliateRewardPercent = {
  Invited: 0,
  Paied: 20, // 20%
};

export const AffiliateRewardAmount = {
  Invited: 0,
  Paied: 5000, // $50
};

export const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME || "None";
