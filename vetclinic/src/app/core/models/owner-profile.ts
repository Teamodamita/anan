export type PaymentMethod = 'card' | 'cash';

export interface OwnerProfile {
  owner_id: number;
  user_id: number;
  payment_method_prefer: PaymentMethod;
}