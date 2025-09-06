
'use server';

import db from '@/lib/db';

export type Attachment = {
  id: string;
  personnelId: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string; // ISO String
  dataUrl: string;
};

// Simulates fetching attachments for a specific personnel member from a database.
export async function getAttachmentsForPersonnel(personnelId: number): Promise<Attachment[]> {
  const stmt = db.prepare('SELECT * FROM attachments WHERE personnel_id = ?');
  return stmt.all(personnelId) as Attachment[];
}

// Simulates adding multiple new attachments to the database.
export async function addAttachments(newAttachmentsData: Omit<Attachment, 'id'>[]): Promise<Attachment[]> {
  const addedAttachments: Attachment[] = newAttachmentsData.map((data, index) => ({
      ...data,
      id: `${data.personnelId}-${Date.now()}-${index}-${data.name}-${data.size}`,
  }));
  
  const stmt = db.prepare('INSERT INTO attachments (id, personnel_id, name, type, size, uploadDate, dataUrl) VALUES (@id, @personnelId, @name, @type, @size, @uploadDate, @dataUrl)');

  const insertMany = db.transaction((attachments) => {
    for (const attachment of attachments) {
      stmt.run({
        id: attachment.id,
        personnelId: attachment.personnelId,
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
        uploadDate: attachment.uploadDate,
        dataUrl: attachment.dataUrl,
      });
    }
  });

  insertMany(addedAttachments);
  
  return addedAttachments;
}

// Simulates updating an attachment's data in the database.
export async function updateAttachment(attachmentId: string, updates: Partial<Attachment>): Promise<Attachment> {
    const setClause = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
    const stmt = db.prepare(`UPDATE attachments SET ${setClause} WHERE id = @id`);
    
    const result = stmt.run({ ...updates, id: attachmentId });

    if (result.changes === 0) {
        throw new Error("Attachment not found");
    }
    
    const getStmt = db.prepare('SELECT * FROM attachments WHERE id = ?');
    return getStmt.get(attachmentId) as Attachment;
}

// Simulates deleting an attachment from the database.
export async function deleteAttachment(attachmentId: string): Promise<void> {
    const stmt = db.prepare('DELETE FROM attachments WHERE id = ?');
    const result = stmt.run(attachmentId);
    
    if (result.changes === 0) {
        throw new Error("Attachment not found to delete");
    }
}
