export interface User {
  id?: number;
  uuid?: string;
  email: string;
  created_at?: string | Date;
  nickname: string;
  avatar_url: string;
  locale?: string;
  signin_type?: string;
  signin_ip?: string;
  signin_provider?: string;
  signin_openid?: string;
  credits?: UserCredits;
  invite_code?: string;
  invited_by?: string;
  is_affiliate?: boolean;
  subscription_credits?: number;
  subscription_expires_date?: string | Date;
  subscription_order_no?: string;
  subscription_product_id?: string;
  subscription_plan?: string;
  subscription_status?: string;
  subscription_credits_reset_date?: string | Date;
}

export interface UserCredits {
  left_credits: number;
  one_time_credits?: number;
  monthly_left_credits?: number;
  monthly_credits?: number;
  is_recharged?: boolean;
  is_pro?: boolean;
  subscription_credits?: number;
  subscription_expires_date?: string | Date;
  subscription_order_no?: string;
  subscription_product_id?: string;
  subscription_plan?: string;
  subscription_status?: string;
  subscription_credits_reset_date?: string | Date;
}
