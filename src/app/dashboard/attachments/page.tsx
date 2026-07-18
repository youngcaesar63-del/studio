'use client';

import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Folder as FolderIcon, FileText, MoreVertical, Search, Trash2, User, Loader2, FileUp, Eye, Edit, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getAttachmentsForPersonnel, addAttachments, updateAttachment, deleteAttachment, Attachment } from '@/services/attachments';
import { usePersonnel } from "@/contexts/PersonnelContext";
import type { Personnel } from "@/services/personnel.service";


const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return <FileText className="h-5 w-5 text-green-500" />;
  if (fileType === 'application/pdf') return <FileText className="h-5 w-5 text-red-500" />;
  if (fileType.includes('word')) return <FileText className="h-5 w-5 text-blue-500" />;
  return <FileText className="h-5 w-5 text-muted-foreground" />;
};

function AttachmentsPageContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { personnel: allPersonnel, loading: isPersonnelLoading } = usePersonnel();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAttachmentsLoading, setAttachmentsLoading] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<Attachment | null>(null);
  const [newAttachmentName, setNewAttachmentName] = useState("");

  const searchResults = useMemo(() => {
    if (searchQuery.trim() === '') return [];
    return allPersonnel.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.cardId.includes(searchQuery)
    ).slice(0, 5); // Limit to 5 results
  }, [allPersonnel, searchQuery]);

  // Effect to select a person if an ID is passed in the URL
  useEffect(() => {
    const personnelId = searchParams.get('personnelId');
    if (personnelId && allPersonnel.length > 0) {
      const person = allPersonnel.find(p => p.id === Number(personnelId));
      if (person) {
        setSelectedPersonnel(person);
      }
    }
  }, [searchParams, allPersonnel]);

  // Effect to load attachments for the selected person
  useEffect(() => {
    const fetchAttachments = async () => {
        if (selectedPersonnel) {
            setAttachmentsLoading(true);
            try {
                const personAttachments = await getAttachmentsForPersonnel(selectedPersonnel.id);
                setAttachments(personAttachments);
            } catch (error) {
                toast({ title: "خطأ", description: "فشل تحميل المرفقات.", variant: "destructive" });
            } finally {
                setAttachmentsLoading(false);
            }
        } else {
            setAttachments([]);
        }
    };
    fetchAttachments();
  }, [selectedPersonnel, toast]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };
  
  const handleSelectPersonnel = (person: Personnel) => {
    setSelectedPersonnel(person);
    setSearchQuery('');
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedPersonnel) return;

    setIsLoading(true);

    const newAttachmentsPromises = Array.from(files).map(file => {
        return new Promise<Omit<Attachment, 'id'>>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve({
                    personnelId: selectedPersonnel.id,
                    name: file.name,
                    type: file.type,
                    size: `${(file.size / 1024).toFixed(1)} KB`,
                    uploadDate: new Date().toISOString(),
                    dataUrl: e.target?.result as string,
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });

    try {
        const newAttachmentsData = await Promise.all(newAttachmentsPromises);
        const addedAttachments = await addAttachments(newAttachmentsData);
        setAttachments(prev => [...prev, ...addedAttachments]);
        toast({
            title: 'تم الرفع بنجاح',
            description: `تم رفع ${files.length} ملفات بنجاح.`,
        });
    } catch (error) {
        toast({ title: "خطأ", description: "فشل رفع الملفات.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  const triggerFileUpload = () => {
    if (!selectedPersonnel) {
      toast({ title: "تنبيه", description: "الرجاء اختيار ضابط أولاً قبل رفع الملفات.", variant: "default" });
      return;
    }
    fileInputRef.current?.click();
  };
  
  const openEditDialog = (attachment: Attachment) => {
    setEditingAttachment(attachment);
    setNewAttachmentName(attachment.name);
    setEditDialogOpen(true);
  };

  const handleUpdateName = async () => {
    if (!editingAttachment || !newAttachmentName.trim()) return;

    try {
        const updated = await updateAttachment(editingAttachment.id, { name: newAttachmentName.trim() });
        setAttachments(prev => prev.map(att => 
          att.id === editingAttachment.id ? updated : att
        ));
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث اسم المرفق بنجاح.',
        });
    } catch (error) {
        toast({ title: "خطأ", description: "فشل تحديث اسم المرفق.", variant: "destructive" });
    }

    setEditDialogOpen(false);
    setEditingAttachment(null);
    setNewAttachmentName("");
  };

  const handleDelete = async (attachmentId: string) => {
    try {
        await deleteAttachment(attachmentId);
        setAttachments(prev => prev.filter(att => att.id !== attachmentId));
        toast({
          title: 'تم الحذف',
          description: 'تم حذف المرفق بنجاح.',
          variant: 'destructive'
        });
    } catch (error) {
         toast({ title: "خطأ", description: "فشل حذف المرفق.", variant: "destructive" });
    }
  };
    
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2"><FolderIcon className="h-6 w-6"/>إدارة المرفقات</CardTitle>
          <CardDescription>ابحث عن ضابط لرفع وعرض مرفقاته.</CardDescription>
           <div className="pt-2">
                <div className="flex items-start rounded-md border border-l-4 border-l-blue-500 bg-muted/30 p-4">
                    <AlertCircle className="h-6 w-6 mr-3 text-blue-500 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-foreground">توجيهات المرفقات</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                           يرجى رفع المرفقات التالية لكل ضابط: صورة شخصية بالزي العسكري (بحجم البوستال)، صورة للبطاقة العسكرية، صورة من الرقم الوطني، وصور من جميع الشهادات العسكرية والأكاديمية الحاصل عليها.
                        </p>
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4 w-full max-w-lg">
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="ابحث بالاسم أو رقم البطاقة..." 
              className="pr-10" 
              value={searchQuery}
              onChange={handleSearch}
              disabled={isPersonnelLoading}
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full bg-card border rounded-md shadow-lg mt-1">
                {searchResults.map(p => (
                  <div 
                    key={p.id}
                    className="p-2 hover:bg-muted cursor-pointer"
                    onClick={() => handleSelectPersonnel(p)}
                  >
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.rank} - {p.cardId}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedPersonnel && (
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription>مرفقات الضابط</CardDescription>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5"/>{selectedPersonnel.name} <Badge variant="secondary">{selectedPersonnel.rank}</Badge>
              </CardTitle>
            </div>
             <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            <Button onClick={triggerFileUpload} disabled={isLoading}>
              {isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <FileUp className="ml-2 h-4 w-4" />}
              {isLoading ? 'جاري الرفع...' : 'رفع ملف جديد'}
            </Button>
          </CardHeader>
          <CardContent>
            {isAttachmentsLoading ? <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div> : 
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">الاسم</TableHead>
                    <TableHead className="text-center border-r hidden md:table-cell">تاريخ الرفع</TableHead>
                    <TableHead className="text-center border-r hidden sm:table-cell">الحجم</TableHead>
                    <TableHead className="text-center border-r w-32">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attachments.length > 0 ? (
                    attachments.map((file) => (
                      <TableRow key={file.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium flex items-center justify-start gap-2 text-right">
                          {getFileIcon(file.type)}
                          <span className="truncate" title={file.name}>{file.name}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-center border-r">{new Date(file.uploadDate).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-center border-r">{file.size}</TableCell>
                        <TableCell className="text-center border-r">
                           <div className="flex items-center justify-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(file.dataUrl, '_blank')}><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(file)}><Edit className="h-4 w-4" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                        <AlertDialogDescription>
                                        سيتم حذف المرفق &apos;{file.name}&apos; بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(file.id)}>حذف</AlertDialogAction>
                                    </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        لا توجد مرفقات لهذا الضابط.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            }
             <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>تعديل اسم المرفق</DialogTitle>
                        <DialogDescription>
                            أدخل الاسم الجديد للمرفق ثم اضغط على حفظ.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                الاسم
                            </Label>
                            <Input
                                id="name"
                                value={newAttachmentName}
                                onChange={(e) => setNewAttachmentName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setEditDialogOpen(false)}>إلغاء</Button>
                        <Button type="submit" onClick={handleUpdateName}>حفظ التغييرات</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// `useSearchParams` must be wrapped in a Suspense boundary by the page,
// otherwise static prerendering of this route fails at build time.
export default function AttachmentsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <AttachmentsPageContent />
    </Suspense>
  );
}
