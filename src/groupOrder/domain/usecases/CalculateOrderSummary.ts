// src/groupOrder/domain/usecases/CalculateOrderSummary.ts
import { GroupOrderEntity, OrderItem, UserEntity } from '../../../core/types';

export interface ParticipantTotalBreakdown {
  user: UserEntity;
  items: OrderItem[];
  subtotal: number;
}

export class CalculateOrderSummary {
  execute(group: GroupOrderEntity) {
    let grandTotal = 0;
    const individualBreakdown: ParticipantTotalBreakdown[] = [];

    group.participants.forEach((participant) => {
      const userItems = group.items[participant.id] || [];
      const subtotal = userItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      grandTotal += subtotal;
      
      individualBreakdown.push({
        user: participant,
        items: userItems,
        subtotal
      });
    });

    return { grandTotal, individualBreakdown };
  }
}
