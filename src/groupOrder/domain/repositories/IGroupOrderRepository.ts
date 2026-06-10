// src/groupOrder/domain/repositories/IGroupOrderRepository.ts
import { GroupOrderEntity, Product, UserEntity } from '../../../core/types';

export interface IGroupOrderRepository {
  createGroup(host: UserEntity): Promise<string>;
  streamGroup(groupId: string, callback: (group: GroupOrderEntity | null) => void): () => void;
  addParticipantByEmail(groupId: string, email: string): Promise<void>;
  addItemToCart(groupId: string, userId: string, product: Product): Promise<void>;
  executeCheckout(groupId: string): Promise<void>;
}
