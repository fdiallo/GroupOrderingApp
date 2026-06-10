// src/groupOrder/data/repositories/GroupOrderRepositoryImpl.ts
import { IGroupOrderRepository } from '../../domain/repositories/IGroupOrderRepository';
import { GroupOrderEntity, Product, UserEntity } from '../../../core/types';
import { db } from '../../../core/config/firebase';
import { doc, runTransaction, onSnapshot, setDoc, collection, updateDoc } from 'firebase/firestore';
import { AuthRepositoryImpl } from '../../../auth/data/repositories/AuthRepositoryImpl';

const authRepo = new AuthRepositoryImpl();

export class GroupOrderRepositoryImpl implements IGroupOrderRepository {
  
  async createGroup(host: UserEntity): Promise<string> {
    const groupRef = doc(collection(db, 'group_orders'));
    const newGroup: GroupOrderEntity = {
      id: groupRef.id,
      hostId: host.id,
      hostEmail: host.email,
      participants: [host],
      items: { [host.id]: [] },
      status: 'active'
    };
    await setDoc(groupRef, newGroup);
    return groupRef.id;
  }

  streamGroup(groupId: string, callback: (group: GroupOrderEntity | null) => void): () => void {
    const docRef = doc(db, 'group_orders', groupId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as GroupOrderEntity);
      } else {
        callback(null);
      }
    });
  }

  async addParticipantByEmail(groupId: string, email: string): Promise<void> {
    const targetUser = await authRepo.getUserByEmail(email);
    if (!targetUser) throw new Error('Invited user account does not exist.');

    const groupRef = doc(db, 'group_orders', groupId);
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(groupRef);
      if (!sfDoc.exists()) throw new Error("Group Order session missing!");

      const groupData = sfDoc.data() as GroupOrderEntity;
      if (groupData.participants.length >= 3) {
        throw new Error("Group capacity constraint reached! Maximum 3 participants allowed.");
      }
      if (groupData.participants.some(p => p.id === targetUser.id)) {
        throw new Error("User has already joined this group.");
      }

      const updatedParticipants = [...groupData.participants, targetUser];
      const updatedItems = { ...groupData.items, [targetUser.id]: [] };

      transaction.update(groupRef, { 
        participants: updatedParticipants,
        items: updatedItems
      });
    });
  }

  async addItemToCart(groupId: string, userId: string, product: Product): Promise<void> {
    const groupRef = doc(db, 'group_orders', groupId);
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(groupRef);
      if (!sfDoc.exists()) throw new Error("Order session ended.");

      const groupData = sfDoc.data() as GroupOrderEntity;
      const currentCart = groupData.items[userId] ? [...groupData.items[userId]] : [];
      const exactIndex = currentCart.findIndex(item => item.product.id === product.id);

      if (exactIndex > -1) {
        currentCart[exactIndex].quantity += 1;
      } else {
        currentCart.push({ product, quantity: 1 });
      }

      const updatedItems = { ...groupData.items, [userId]: currentCart };
      transaction.update(groupRef, { items: updatedItems });
    });
  }

  async executeCheckout(groupId: string): Promise<void> {
    const groupRef = doc(db, 'group_orders', groupId);
    await updateDoc(groupRef, { status: 'checked_out' });
  }
}
