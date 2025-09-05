
'use client';

import { getLocalStorage, updateLocalStorage } from "@/lib/localStorage-helpers";

export type Attachment = {
  id: string;
  personnelId: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string; // ISO String
  dataUrl: string;
};

// This service layer simulates async operations with a database.
// In a real application, these functions would make API calls to a backend
// which would then interact with a database like Firestore.

// Simulates fetching attachments for a specific personnel member from a database.
export async function getAttachmentsForPersonnel(personnelId: number): Promise<Attachment[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allAttachments = getLocalStorage('attachmentsData', []) as Attachment[];
  return allAttachments.filter(att => att.personnelId === personnelId);
}

// Simulates adding multiple new attachments to the database.
export async function addAttachments(newAttachmentsData: Omit<Attachment, 'id'>[]): Promise<Attachment[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const allAttachments = getLocalStorage('attachmentsData', []) as Attachment[];
  
  const addedAttachments: Attachment[] = newAttachmentsData.map(data => ({
      ...data,
      id: `${data.personnelId}-${Date.now()}-${Math.random()}`, // Create a unique ID
  }));

  const updatedAttachments = [...allAttachments, ...addedAttachments];
  updateLocalStorage('attachmentsData', updatedAttachments);
  
  return addedAttachments;
}

// Simulates updating an attachment's data in the database.
export async function updateAttachment(attachmentId: string, updates: Partial<Attachment>): Promise<Attachment> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const allAttachments = getLocalStorage('attachmentsData', []) as Attachment[];
    let updatedAttachment: Attachment | undefined;

    const updatedList = allAttachments.map(att => {
        if (att.id === attachmentId) {
            updatedAttachment = { ...att, ...updates };
            return updatedAttachment;
        }
        return att;
    });

    if (!updatedAttachment) {
        throw new Error("Attachment not found");
    }

    updateLocalStorage('attachmentsData', updatedList);
    return updatedAttachment;
}

// Simulates deleting an attachment from the database.
export async function deleteAttachment(attachmentId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const allAttachments = getLocalStorage('attachmentsData', []) as Attachment[];
    const updatedList = allAttachments.filter(att => att.id !== attachmentId);

    if (allAttachments.length === updatedList.length) {
        throw new Error("Attachment not found to delete");
    }

    updateLocalStorage('attachmentsData', updatedList);
}
