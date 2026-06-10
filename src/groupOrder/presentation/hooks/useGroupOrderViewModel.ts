// src/groupOrder/presentation/hooks/useGroupOrderViewModel.ts
import { useState, useEffect } from 'react';
import { GroupOrderRepositoryImpl } from '../../data/repositories/GroupOrderRepositoryImpl';
import { CalculateOrderSummary } from '../../domain/usecases/CalculateOrderSummary';
import { GroupOrderEntity, Product, UserEntity } from '../../../core/types';

const orderRepo = new GroupOrderRepositoryImpl();
const summaryUseCase = new CalculateOrderSummary();

export const useGroupOrderViewModel = (groupId: string | null, currentUser: UserEntity | null) => {
  const [group, setGroup] = useState<GroupOrderEntity | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    const unsubscribe = orderRepo.streamGroup(groupId, (updatedGroup) => {
      setGroup(updatedGroup);
    });
    return unsubscribe;
  }, [groupId]);

  const createNewSession = async () => {
    if (!currentUser) return null;
    setLoading(true);
    try {
      return await orderRepo.createGroup(currentUser);
    } catch (e: any) {
      alert(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const inviteParticipant = async (email: string) => {
    if (!groupId) return;
    await orderRepo.addParticipantByEmail(groupId, email);
  };

  const addProductToCart = async (product: Product) => {
    if (!groupId || !currentUser) return;
    await orderRepo.addItemToCart(groupId, currentUser.id, product);
  };

  const finalizeOrder = async () => {
    if (!groupId) return;
    await orderRepo.executeCheckout(groupId);
  };

  const orderSummary = group ? summaryUseCase.execute(group) : { grandTotal: 0, individualBreakdown: [] };

  return {
    group,
    loading,
    createNewSession,
    inviteParticipant,
    addProductToCart,
    finalizeOrder,
    orderSummary
  };
};
